"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { getCart, validateStock } from "./cart";
import { ShippingAddressSchema } from "@/lib/zod-schemas";
import { OrderStatus, PaymentStatus } from "@prisma/client";
import { addHours } from "date-fns";
import crypto from "crypto";
import { decrementInventory } from "./inventory";
import { sendOrderConfirmationEmail, notifyStaffOfNewOrder } from "@/lib/email";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function createOrder() {
  const cookieStore = await cookies();
  const cart = await getCart();
  const addressCookie = cookieStore.get("shippingAddress")?.value;
  const session = await getServerSession(authOptions);

  if (!cart || cart.items.length === 0) {
    throw new Error("Cart is empty.");
  }

  if (!addressCookie) {
    throw new Error("Shipping address not found.");
  }

  const stockCheck = await validateStock(cart.id);
  if (!stockCheck.valid) {
    throw new Error(stockCheck.errors.join(" "));
  }

  const shippingAddress = ShippingAddressSchema.parse(JSON.parse(addressCookie));
  const total = cart.items.reduce((sum, item) => sum + item.quantity * item.variant.price, 0);

  const orderNumber = `MEPRA-${Date.now()}`;

  const order = await prisma.order.create({
    data: {
      orderNumber,
      userId: session?.user?.id,
      customerEmail: shippingAddress.email,
      total,
      shippingAddress: shippingAddress,
      status: OrderStatus.DRAFT,
      paymentStatus: PaymentStatus.PENDING,
      items: {
        create: cart.items.map((item) => ({
          variantId: item.variantId,
          quantity: item.quantity,
          price: item.variant.price,
          name: item.variant.product.name,
        })),
      },
    },
  });

  return order;
}

export async function finalizeOrder(
  orderId: string,
  paymobTransactionId: string,
  isSuccess: boolean
) {
  return await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: { payments: true, items: true },
    });

    if (!order) {
      throw new Error(`Order with ID ${orderId} not found.`);
    }

    const existingPayment = order.payments.find((p) => p.providerRef === paymobTransactionId);
    if (existingPayment) {
      console.log(`Transaction ${paymobTransactionId} already processed for order ${orderId}.`);
      return order;
    }

    await tx.payment.create({
      data: {
        orderId: order.id,
        provider: "paymob",
        providerRef: paymobTransactionId,
        amount: order.total,
        status: isSuccess ? PaymentStatus.CAPTURED : PaymentStatus.FAILED,
      },
    });

    if (!isSuccess) {
      return await tx.order.update({
        where: { id: order.id },
        data: { paymentStatus: PaymentStatus.FAILED },
      });
    }

    const updatedOrder = await tx.order.update({
      where: { id: order.id },
      data: {
        status: OrderStatus.CONFIRMED,
        paymentStatus: PaymentStatus.CAPTURED,
      },
      include: { items: true },
    });

    await decrementInventory(updatedOrder.items);

    Promise.all([
      sendOrderConfirmationEmail(updatedOrder),
      notifyStaffOfNewOrder(updatedOrder),
    ]).catch((err) => {
      console.error(`Failed to send emails for order ${order.id}:`, err);
    });

    return updatedOrder;
  });
}

export async function issueUpgradeInviteAction(orderId: string, email: string) {
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return { success: false, error: "An account with this email already exists." };
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = addHours(new Date(), 24);

    // Insert the invite using a parameterized raw query so we don't need
    // to rely on a generated delegate or use an `any` cast.
    await prisma.guestUpgradeInvite.create({
      data: {
        orderId,
        email,
        token,
        expiresAt,
      },
    });

    console.log(`Generated upgrade link for ${email}: /upgrade-account?token=${token}`);

    return { success: true };
  } catch (error) {
    console.error("Failed to issue upgrade invite:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}
