"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { CartWithItems } from "@/types/cart";
import { VariantAttributes } from "@/types/product";
import { randomUUID } from "crypto";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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

export async function getCart(): Promise<CartWithItems | null> {
  const cookieStore = await cookies();
  const session = await getServerSession(authOptions);

  if (session?.user?.id) {
    const userCart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
      include: {
        items: {
          include: { variant: { include: { product: true } } },
          orderBy: { id: "asc" },
        },
      },
    });
    if (userCart) return userCart;
  }

  const cartId = cookieStore.get("cartId")?.value;
  if (!cartId) return null;

  return await findCartById(cartId);
}

export async function createCart(): Promise<CartWithItems> {
  const session = await getServerSession(authOptions);
  const cookieStore = await cookies();

  let cart;

  if (session?.user?.id) {
    cart = await prisma.cart.create({
      data: { userId: session.user.id },
      include: { items: { include: { variant: { include: { product: true } } } } },
    });
  } else {
    const guestId = randomUUID();
    cart = await prisma.cart.create({
      data: { guestId: guestId },
      include: { items: { include: { variant: { include: { product: true } } } } },
    });

    cookieStore.set("cartId", cart.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
    });
    cookieStore.set("guestId", guestId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
    });
  }

  return cart;
}

export async function validateStock(cartId: string): Promise<{ valid: boolean; errors: string[] }> {
  const cart = await findCartById(cartId);
  if (!cart) return { valid: false, errors: ["Cart not found"] };

  const errors: string[] = [];

  for (const item of cart.items) {
    if (item.quantity > item.variant.stock) {
      const attributes = item.variant.attributes as unknown as VariantAttributes;
      const size = attributes?.size ?? "Standard";

      errors.push(
        `Sorry, only ${item.variant.stock} left of ${item.variant.product.name} (Size: ${size}).`
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export async function mergeAnonymousCartIntoUserCart(userId: string) {
  const cookieStore = await cookies();
  const cartId = cookieStore.get("cartId")?.value;

  if (!cartId) return;

  const guestCart = await prisma.cart.findUnique({
    where: { id: cartId },
    include: { items: true },
  });

  if (!guestCart) return;

  const userCart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: true },
  });

  if (!userCart) {
    await prisma.cart.update({
      where: { id: guestCart.id },
      data: { userId, guestId: null },
    });
  } else {
    for (const guestItem of guestCart.items) {
      const existingItem = userCart.items.find((i) => i.variantId === guestItem.variantId);

      if (existingItem) {
        await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: existingItem.quantity + guestItem.quantity },
        });
      } else {
        await prisma.cartItem.create({
          data: {
            cartId: userCart.id,
            variantId: guestItem.variantId,
            quantity: guestItem.quantity,
          },
        });
      }
    }
    await prisma.cart.delete({ where: { id: guestCart.id } });
  }

  cookieStore.delete("cartId");
  cookieStore.delete("guestId");

  revalidatePath("/cart");
}

export async function addItem(variantId: string) {
  let cart = await getCart();
  if (!cart) {
    cart = await createCart();
  }

  const existingItem = await prisma.cartItem.findFirst({
    where: { cartId: cart.id, variantId },
  });

  const variant = await prisma.productVariant.findUnique({ where: { id: variantId } });
  if (!variant) throw new Error("Variant not found");

  const currentQty = existingItem ? existingItem.quantity : 0;
  if (currentQty + 1 > variant.stock) {
    // This error message will be caught by the frontend
    throw new Error(`Only ${variant.stock} item(s) in stock`);
  }

  if (existingItem) {
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: { increment: 1 } },
    });
  } else {
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        variantId,
        quantity: 1,
      },
    });
  }

  revalidatePath("/cart");
}

export async function updateItemQuantity(itemId: string, quantity: number) {
  if (quantity < 1) {
    await prisma.cartItem.delete({ where: { id: itemId } });
  } else {
    await prisma.cartItem.update({ where: { id: itemId }, data: { quantity } });
  }
  revalidatePath("/cart");
}

export async function removeItem(itemId: string) {
  await prisma.cartItem.delete({ where: { id: itemId } });
  revalidatePath("/cart");
}

export async function incrementItem(itemId: string) {
  const item = await prisma.cartItem.findUnique({
    where: { id: itemId },
    include: { variant: true },
  });

  if (!item) return;

  if (item.quantity + 1 > item.variant.stock) {
    // --- FIX: Throw error instead of silent return ---
    throw new Error(`Cannot add more. Only ${item.variant.stock} left in stock.`);
  }

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
    await prisma.cartItem.delete({ where: { id: itemId } });
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

  if (session?.user?.id) {
    await prisma.cart.deleteMany({
      where: { userId: session.user.id },
    });
  } else if (cartId) {
    try {
      await prisma.cart.delete({ where: { id: cartId } });
    } catch (e) {
      // Ignore if already deleted
    }
  }

  cookieStore.delete("cartId");
  cookieStore.delete("guestId");
  cookieStore.delete("shippingAddress");
}
