// src/app/actions/refund.ts
"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createPaymobRefund, getPaymobAuthToken } from "@/lib/paymob.actions";
import { sendRefundStatusEmail } from "@/lib/email";
import { RefundStatus, OrderStatus, PaymentStatus, Role } from "@prisma/client";

const RequestRefundSchema = z.object({
  orderId: z.string(),
  amountCents: z.coerce.number().int().positive("Refund amount must be positive."),
  reason: z.string().optional(),
});

type RefundFormState = {
  success: boolean;
  message: string;
};

/**
 * Action for a customer to request a refund.
 */
export async function requestRefundAction(
  prevState: RefundFormState,
  formData: FormData
): Promise<RefundFormState> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, message: "Authentication required." };
  }

  const parsed = RequestRefundSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0].message };
  }

  const { orderId, amountCents, reason } = parsed.data;

  try {
    const order = await prisma.order.findFirst({
      where: { id: orderId, userId: session.user.id },
      include: { payments: { include: { refunds: true } } },
    });

    if (!order) {
      return { success: false, message: "Order not found." };
    }
    if (order.paymentStatus !== PaymentStatus.CAPTURED) {
      return { success: false, message: "Order not eligible for refund." };
    }

    const payment = order.payments.find((p) => p.status === PaymentStatus.CAPTURED);
    if (!payment) {
      return { success: false, message: "No captured payment found for this order." };
    }

    const totalRefunded = payment.refunds.reduce((sum, r) => sum + r.amountCents, 0);
    const refundableBalance = payment.amount - totalRefunded;

    if (amountCents > refundableBalance) {
      return { success: false, message: "Refund amount exceeds refundable balance." };
    }

    await prisma.refund.create({
      data: {
        orderId,
        paymentId: payment.id,
        amountCents,
        reason,
        status: RefundStatus.REQUESTED,
        requestedByUserId: session.user.id,
      },
    });

    revalidatePath(`/account/orders/${order.orderNumber}`);
    return { success: true, message: "Refund request submitted successfully." };
  } catch (error) {
    console.error("Refund request error:", error);
    return { success: false, message: "An unexpected error occurred." };
  }
}

/**
 * Action for an admin to approve or deny a refund request.
 */
export async function processRefundAction(refundId: string, action: "approve" | "deny") {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin") {
    throw new Error("Unauthorized");
  }

  const refund = await prisma.refund.findUnique({
    where: { id: refundId },
    include: { payment: true },
  });

  if (!refund || refund.status !== RefundStatus.REQUESTED) {
    throw new Error("Refund not found or not in a processable state.");
  }

  if (action === "deny") {
    await prisma.refund.update({
      where: { id: refundId },
      data: { status: RefundStatus.FAILED },
    });
  } else if (action === "approve") {
    if (!refund.payment.providerRef) {
      throw new Error("Payment transaction reference not found.");
    }

    const authToken = await getPaymobAuthToken();
    const paymobRefund = await createPaymobRefund(
      authToken,
      refund.payment.providerRef,
      refund.amountCents
    );

    await prisma.refund.update({
      where: { id: refundId },
      data: {
        status: RefundStatus.PROCESSING,
        providerRef: paymobRefund.id.toString(),
      },
    });
  }

  revalidatePath(`/admin/orders/${refund.orderId}`);
}

/**
 * Finalizes a refund after receiving a webhook confirmation from Paymob. (New Function)
 * This action is idempotent and should only be called by the webhook handler.
 */
export async function finalizeRefundAction(paymobRefundId: string, isSuccess: boolean) {
  return await prisma.$transaction(async (tx) => {
    // 1. Find the refund request by the provider's transaction ID
    const refund = await tx.refund.findUnique({
      where: { providerRef: paymobRefundId },
      include: { payment: true, order: true },
    });

    // 2. Idempotency Check: If refund not found or already processed, exit safely.
    if (!refund || refund.status !== RefundStatus.PROCESSING) {
      console.warn(`Webhook for refund ${paymobRefundId} skipped: Not found or already processed.`);
      return;
    }

    // 3. Update the Refund record's status
    const updatedRefund = await tx.refund.update({
      where: { id: refund.id },
      data: { status: isSuccess ? RefundStatus.SUCCEEDED : RefundStatus.FAILED },
    });

    // 4. If the refund failed, we're done with this transaction.
    if (!isSuccess) {
      await sendRefundStatusEmail(updatedRefund, refund.order);
      return updatedRefund;
    }

    // 5. If successful, update the original Payment record
    const updatedPayment = await tx.payment.update({
      where: { id: refund.paymentId },
      data: { refundedAmountCents: { increment: refund.amountCents } },
    });

    // 6. Determine the new overall order payment status
    const newPaymentStatus =
      updatedPayment.refundedAmountCents >= updatedPayment.amount
        ? PaymentStatus.REFUNDED
        : PaymentStatus.PARTIALLY_REFUNDED;

    // --- FIX IS HERE ---
    // Determine the new OrderStatus based on the final refunded amount
    const newOrderStatus =
      newPaymentStatus === PaymentStatus.REFUNDED ? OrderStatus.REFUNDED : refund.order.status; // Keep the existing order status on partial refund

    // 7. Update the Order record with both payment and order status
    await tx.order.update({
      where: { id: refund.orderId },
      data: {
        paymentStatus: newPaymentStatus,
        status: newOrderStatus, // Update the order status
      },
    });
    // --- END OF FIX ---

    // 8. Send notification and revalidate paths
    await sendRefundStatusEmail(updatedRefund, refund.order);
    revalidatePath(`/account/orders/${refund.order.orderNumber}`);
    revalidatePath(`/admin/orders/${refund.orderId}`);

    console.log(`Successfully finalized refund ${refund.id} for order ${refund.orderId}`);
    return updatedRefund;
  });
}
