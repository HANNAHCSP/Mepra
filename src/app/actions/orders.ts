// src/app/actions/orders.ts
'use server';

import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { getCart } from './cart';
import { ShippingAddressSchema } from '@/lib/zod-schemas';
import { OrderStatus, PaymentStatus } from '@prisma/client';
import { addHours } from 'date-fns'; 
import crypto from 'crypto';


// This action creates the initial order record in our database
export async function createOrder() {
  const cookieStore = await cookies();
  const cart = await getCart();
  const addressCookie = cookieStore.get('shippingAddress')?.value;

  if (!cart || !addressCookie) {
    throw new Error('Cart or shipping address not found.');
  }

  const shippingAddress = ShippingAddressSchema.parse(JSON.parse(addressCookie));
  const total = cart.items.reduce((sum, item) => sum + item.quantity * item.variant.price, 0);

  // A simple way to generate a unique, human-readable order number
  const orderNumber = `MEPRA-${Date.now()}`;

  const order = await prisma.order.create({
    data: {
      orderNumber,
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

// This action finalizes the order after successful payment
// It's designed to be "idempotent" - it can be called multiple times for the same transaction
// without creating duplicate data.
export async function finalizeOrder(
  orderId: string,
  paymobTransactionId: string,
  isSuccess: boolean
) {
  return await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: { payments: true },
    });

    if (!order) {
      throw new Error(`Order with ID ${orderId} not found.`);
    }

    // Check if this transaction has already been processed
    const existingPayment = order.payments.find(
      (p) => p.providerRef === paymobTransactionId
    );

    if (existingPayment) {
      console.log(`Transaction ${paymobTransactionId} already processed for order ${orderId}.`);
      return order; // Already handled, just return the order
    }

    // Record the payment attempt
    await tx.payment.create({
      data: {
        orderId: order.id,
        provider: 'paymob',
        providerRef: paymobTransactionId,
        amount: order.total,
        status: isSuccess ? PaymentStatus.CAPTURED : PaymentStatus.FAILED,
      },
    });

    // If payment was successful, update the order status
    if (isSuccess) {
      const updatedOrder = await tx.order.update({
        where: { id: order.id },
        data: {
          status: OrderStatus.CONFIRMED,
          paymentStatus: PaymentStatus.CAPTURED,
        },
      });

      // Clear the cart cookie
      (await cookies()).delete('cartId');   
      
      return updatedOrder;
    }

    // If payment failed, just update the status
    return await tx.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: PaymentStatus.FAILED,
      },
    });
  });
}

// New action for issuing an upgrade invite
export async function issueUpgradeInviteAction(orderId: string, email: string) {
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      // If the email is already registered, we can't create a new account with it.
      // In a real app, you might send an email saying "Your order is placed. Log in to see it."
      return { success: false, error: "An account with this email already exists." };
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = addHours(new Date(), 24); // Invite is valid for 24 hours

    await prisma.guestUpgradeInvite.create({
      data: {
        orderId,
        email,
        token,
        expiresAt,
      },
    });

    // In a real application, you would email the user a link here:
    // const upgradeLink = `${process.env.NEXT_PUBLIC_APP_URL}/upgrade-account?token=${token}`;
    // await sendEmail({ to: email, subject: "Create your Mepra account", body: `Click here to create your account: ${upgradeLink}` });

    console.log(`Generated upgrade link for ${email}: /upgrade-account?token=${token}`);

    return { success: true };
  } catch (error) {
    console.error("Failed to issue upgrade invite:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}