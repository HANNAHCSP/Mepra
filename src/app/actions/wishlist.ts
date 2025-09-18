// src/app/actions/wishlist.ts
'use server';

import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Action to get the user's current wishlist
export async function getWishlist() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return null;
  }

  const wishlist = await prisma.wishlist.findUnique({
    where: { userId: session.user.id },
    include: {
      items: {
        include: {
          product: {
            include: {
              variants: {
                orderBy: {
                  price: 'asc',
                },
                take: 1,
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });

  return wishlist;
}

// Action to add or remove an item from the wishlist
export async function toggleWishlistItem(productId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error('You must be signed in to modify your wishlist.');
  }

  // Get or create the user's wishlist
  const wishlist = await prisma.wishlist.upsert({
    where: { userId: session.user.id },
    update: {},
    create: { userId: session.user.id },
  });

  const existingItem = await prisma.wishlistItem.findFirst({
    where: {
      wishlistId: wishlist.id,
      productId: productId,
    },
  });

  if (existingItem) {
    // Item exists, so remove it
    await prisma.wishlistItem.delete({
      where: { id: existingItem.id },
    });
    revalidatePath('/wishlist');
    revalidatePath(`/products/.*`); // Revalidate all product pages
    return { removed: true, message: 'Removed from wishlist.' };
  } else {
    // Item does not exist, so add it
    await prisma.wishlistItem.create({
      data: {
        wishlistId: wishlist.id,
        productId: productId,
      },
    });
    revalidatePath('/wishlist');
    revalidatePath(`/products/.*`); // Revalidate all product pages
    return { added: true, message: 'Added to wishlist.' };
  }
}