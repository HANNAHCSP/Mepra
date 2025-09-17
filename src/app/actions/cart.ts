// src/app/actions/cart.ts
'use server'

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { CartWithItems } from "@/types/cart";
import { randomUUID } from 'crypto'; 
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";


// Helper function to find a cart by ID
async function findCartById(cartId: string) {
  return prisma.cart.findUnique({
    where: { id: cartId },
    include: {
      items: {
        include: {
          variant: { include: { product: true } },
        },
        orderBy: { id: "asc" },
      },
    },
  });
}

// Get the current cart, returns null if not found
export async function getCart(): Promise<CartWithItems | null> {
  const cookieStore = await cookies();
  const cartId = cookieStore.get("cartId")?.value;

  if (!cartId) {
    return null;
  }

  const cart = await findCartById(cartId);
  return cart;
}

// Creates a new cart and sets the cookie
export async function createCart(): Promise<CartWithItems> {

 const guestId = randomUUID();

  const cart = await prisma.cart.create({
    data: {guestId: guestId, },
    include: {
      items: {
        include: {
          variant: { include: { product: true } },
        },
      },
    },
  });
  // Store both cartId and the new guestId in cookies
  const cookieStore = await cookies();
  cookieStore.set("cartId", cart.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
   cookieStore.set("guestId", guestId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
  return cart;
}

// Gets the current cart or creates a new one if it doesn't exist or is invalid
async function getOrCreateCart(): Promise<CartWithItems> {
  const existingCart = await getCart();

  if (existingCart) {
    return existingCart;
  }

  return await createCart();
}

// Action to add an item to the cart
export async function addItem(variantId: string) {
  const cart = await getOrCreateCart();

  const existingItem = await prisma.cartItem.findFirst({
    where: { cartId: cart.id, variantId },
  });

  if (existingItem) {
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: { increment: 1 } },
    });
  } else {
    // This now safely uses a guaranteed-to-exist cartId
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        variantId,
        quantity: 1,
      },
    });
  }

  revalidatePath("/products");
  revalidatePath("/cart");
}


export async function updateItemQuantity(itemId: string, quantity: number) {
  if (quantity < 1) {
    await prisma.cartItem.delete({
      where: { id: itemId },
    });
  } else {
    await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });
  }
  revalidatePath("/cart");
}

export async function removeItem(itemId: string) {
  await prisma.cartItem.delete({
    where: { id: itemId },
  });
  revalidatePath("/cart");
}

export async function incrementItem(itemId: string) {
  await prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity: { increment: 1 } },
  });
  revalidatePath("/cart");
}

export async function decrementItem(itemId: string) {
  const item = await prisma.cartItem.findUnique({
    where: { id: itemId },
    select: { quantity: true },
  });

  if (item && item.quantity === 1) {
    await prisma.cartItem.delete({
      where: { id: itemId },
    });
  } else {
    await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity: { decrement: 1 } },
    });
  }
  revalidatePath("/cart");
}

export async function clearCart(): Promise<void> {
  
  const session = await getServerSession(authOptions);
  const cookieStore = await cookies();
  const cartId = cookieStore.get("cartId")?.value;

  if (!cartId) {
    return; // No cart to clear
  }

  // If the user is logged in, their cart is in the database. Delete it.
  if (session?.user?.id) {
    try {
      await prisma.cart.delete({
        where: { id: cartId, userId: session.user.id },
      });
      console.log(`Cleared cart ${cartId} for user ${session.user.id}.`);
    } catch (error) {
      // It's possible the cart was already deleted or doesn't match the user.
      // We can safely ignore this error.
      console.log(`Could not find cart ${cartId} to delete for user ${session.user.id}. It may have already been cleared.`);
    }
  }
  
  // For both logged-in users and guests, we must clear the cookies.
  cookieStore.delete('cartId');
  cookieStore.delete('guestId');
  cookieStore.delete('shippingAddress');
  
  // Revalidate paths to update UI across the app
  revalidatePath('/cart');
  revalidatePath('/'); // To update the cart count in the navbar
  console.log('Cart cookies cleared.');
}