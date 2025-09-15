// src/app/actions/cart.ts
'use server'

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { CartWithItems } from "@/types/cart";

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
  const cart = await prisma.cart.create({
    data: {},
    include: {
      items: {
        include: {
          variant: { include: { product: true } },
        },
      },
    },
  });
  (await cookies()).set("cartId", cart.id, {
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