// src/app/actions/refund.ts
"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createPaymobRefund, getPaymobAuthToken } from "@/lib/paymob.actions";
import { sendRefundStatusEmail } from "@/lib/email";
import { RefundStatus, OrderStatus, PaymentStatus } from "@prisma/client";

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

    await prisma.$transaction([
      prisma.refund.create({
        data: {
          orderId,
          paymentId: payment.id,
          amountCents,
          reason,
          status: RefundStatus.REQUESTED,
          requestedByUserId: session.user.id,
        },
      }),
      prisma.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.RETURN_REQUESTED },
      }),
    ]);

    revalidatePath(`/account/orders/${order.orderNumber}`);
    revalidatePath(`/admin/orders/${order.id}`);
    revalidatePath("/admin/orders");
    revalidatePath("/admin");

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

  if (!refund) {
    throw new Error("Refund not found.");
  }

  if (action === "deny") {
    await prisma.$transaction([
      prisma.refund.update({
        where: { id: refundId },
        data: { status: RefundStatus.FAILED },
      }),
      prisma.order.update({
        where: { id: refund.orderId },
        data: { status: OrderStatus.DELIVERED },
      }),
    ]);
  } else if (action === "approve") {
    if (!refund.payment.providerRef) {
      throw new Error("Payment transaction reference not found.");
    }

    const authToken = await getPaymobAuthToken();

    // 1. Call Paymob
    const paymobRefund = await createPaymobRefund(
      authToken,
      refund.payment.providerRef,
      refund.amountCents
    );

    // 2. Update DB - Check if webhook beat us to it
    const currentRefund = await prisma.refund.findUnique({
      where: { id: refundId },
      select: { status: true },
    });

    if (currentRefund?.status === RefundStatus.REQUESTED) {
      await prisma.refund.update({
        where: { id: refundId },
        data: {
          status: RefundStatus.PROCESSING,
          providerRef: paymobRefund.id.toString(),
        },
      });
    } else {
      // Just update the providerRef if it's missing (webhook might have set status but not this)
      await prisma.refund.update({
        where: { id: refundId },
        data: {
          providerRef: paymobRefund.id.toString(),
        },
      });
    }
  }

  revalidatePath(`/admin/orders/${refund.orderId}`);
  revalidatePath("/admin/orders");
  revalidatePath("/admin");
}

/**
 * Helper to handle the case where Paymob sends a Payment Webhook with is_refunded=true.
 */
export async function processPaymentRefundUpdate(paymentProviderRef: string) {
  // Find the payment and associated refund.
  // We look for refunds that are PROCESSING or REQUESTED to fix the race condition.
  const payment = await prisma.payment.findUnique({
    where: { providerRef: paymentProviderRef },
    include: {
      refunds: {
        where: {
          status: { in: [RefundStatus.PROCESSING, RefundStatus.REQUESTED] },
        },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  if (!payment || payment.refunds.length === 0) {
    console.log(`No pending refund found for payment ${paymentProviderRef}`);
    return;
  }

  const refund = payment.refunds[0];

  console.log(`Found pending refund ${refund.id} for payment ${paymentProviderRef}. Finalizing...`);

  // Use internal ID to finalize since we found it via relation
  await finalizeRefundAction(refund.id, true, true);
}

/**
 * Finalizes a refund.
 * @param lookupId - Either the Paymob Refund ID (providerRef) or our Internal Refund ID
 * @param isSuccess - Whether the refund succeeded
 * @param isInternalId - If true, lookupId is our DB ID. If false, it's Paymob's ID.
 */
export async function finalizeRefundAction(
  lookupId: string,
  isSuccess: boolean,
  isInternalId: boolean = false
) {
  return await prisma.$transaction(async (tx) => {
    // Use a const with conditional logic to satisfy TypeScript strict null checks
    const refund = isInternalId
      ? await tx.refund.findUnique({
          where: { id: lookupId },
          include: { payment: true, order: true },
        })
      : await tx.refund.findUnique({
          where: { providerRef: lookupId },
          include: { payment: true, order: true },
        });

    // TypeScript Check: Ensure 'refund' exists before proceeding
    if (
      !refund ||
      (refund.status !== RefundStatus.PROCESSING && refund.status !== RefundStatus.REQUESTED)
    ) {
      console.warn(`Webhook for refund ${lookupId} skipped: Not found or already handled.`);
      return;
    }

    const updatedRefund = await tx.refund.update({
      where: { id: refund.id },
      data: { status: isSuccess ? RefundStatus.SUCCEEDED : RefundStatus.FAILED },
    });

    if (!isSuccess) {
      await tx.order.update({
        where: { id: refund.orderId },
        data: { status: OrderStatus.DELIVERED },
      });
      return updatedRefund;
    }

    const updatedPayment = await tx.payment.update({
      where: { id: refund.paymentId },
      data: { refundedAmountCents: { increment: refund.amountCents } },
    });

    const newPaymentStatus =
      updatedPayment.refundedAmountCents >= updatedPayment.amount
        ? PaymentStatus.REFUNDED
        : PaymentStatus.PARTIALLY_REFUNDED;

    const newOrderStatus =
      newPaymentStatus === PaymentStatus.REFUNDED ? OrderStatus.REFUNDED : OrderStatus.DELIVERED;

    await tx.order.update({
      where: { id: refund.orderId },
      data: {
        paymentStatus: newPaymentStatus,
        status: newOrderStatus,
      },
    });

    // Parse shipping address safely for the email
    interface ShippingAddress {
      firstName?: string;
      lastName?: string;
    }

    // Safety check for JSON parsing
    let rawAddress: ShippingAddress = {};
    if (typeof refund.order.shippingAddress === "string") {
      try {
        rawAddress = JSON.parse(refund.order.shippingAddress);
      } catch (e) {
        console.error("Error parsing shipping address JSON", e);
      }
    } else {
      rawAddress = refund.order.shippingAddress as ShippingAddress;
    }

    const customerName = rawAddress?.firstName
      ? `${rawAddress.firstName} ${rawAddress.lastName}`
      : "Customer";

    await sendRefundStatusEmail({
      orderNumber: refund.order.orderNumber,
      customerEmail: refund.order.customerEmail,
      customerName: customerName,
      amount: updatedRefund.amountCents,
      status: updatedRefund.status,
    });

    // Revalidate paths using the non-null 'refund' object
    revalidatePath(`/account/orders/${refund.order.orderNumber}`);
    revalidatePath(`/admin/orders/${refund.orderId}`);
    revalidatePath("/admin/orders");
    revalidatePath("/admin");

    console.log(`Successfully finalized refund ${refund.id}`);
    return updatedRefund;
  });
}
