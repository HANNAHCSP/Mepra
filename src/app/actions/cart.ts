'use server'

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { CartWithItems } from "@/types/cart"; // Import our new type

// Function to get or create a cart
export async function getCart(): Promise<CartWithItems | null> { // Explicit return type
  const cookieStore = await cookies();
  const cartId = cookieStore.get("cartId")?.value;
  if (!cartId) return null;

  const cart = await prisma.cart.findUnique({
    where: { id: cartId },
    include: {
      items: {
        include: {
          variant: {
            include: {
              product: true,
            },
          },
        },
        orderBy: {
          id: "asc",
        },
      },
    },
  });

  return cart;
}
export async function createCart() {
  const cart = await prisma.cart.create({
    data: {},
  });
  const cookieStore = await cookies();
  cookieStore.set("cartId", cart.id);
  return cart;
}
// Action to add an item to the cart
export async function addItem(variantId: string) {
  const cookieStore = await cookies();
  let cartId = cookieStore.get("cartId")?.value;
  if (!cartId) {
    const newCart = await createCart();
    cartId = newCart.id;
  }

  const existingItem = await prisma.cartItem.findFirst({
    where: { cartId, variantId },
  });

  if (existingItem) {
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: { increment: 1 } },
    });
  } else {
    await prisma.cartItem.create({
      data: {
        cartId,
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
    // If quantity is less than 1, remove the item
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

// NEW: Action for the '-' button
export async function decrementItem(itemId: string) {
  const item = await prisma.cartItem.findUnique({
    where: { id: itemId },
    select: { quantity: true },
  });

  // If item is the last one, remove it from the cart
  if (item && item.quantity === 1) {
    await prisma.cartItem.delete({
      where: { id: itemId },
    });
  } else {
    // Otherwise, just decrement the quantity
    await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity: { decrement: 1 } },
    });
  }
  revalidatePath("/cart");
}