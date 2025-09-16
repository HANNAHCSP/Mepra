// src/app/actions/inventory.ts
'use server';

import { prisma } from "@/lib/prisma";
import type { OrderItem } from "@prisma/client";

/**
 * Decrements the stock for a list of order items.
 * Uses a Prisma transaction to ensure all updates succeed or none do.
 * @param items - An array of OrderItem objects from your database.
 */
export async function decrementInventory(items: OrderItem[]): Promise<void> {
  if (!items || items.length === 0) {
    return;
  }

  console.log(`Decrementing inventory for ${items.length} line items.`);

  const stockUpdates = items.map(item => {
    return prisma.productVariant.update({
      where: {
        id: item.variantId,
        // Optional: Add a check to ensure stock is sufficient before decrementing
        stock: {
          gte: item.quantity,
        }
      },
      data: {
        stock: {
          decrement: item.quantity,
        },
      },
    });
  });

  try {
    // $transaction ensures all these updates are executed as a single atomic operation
    await prisma.$transaction(stockUpdates);
    console.log("Inventory decremented successfully.");
  } catch (error) {
    // This could happen if, for example, the stock gte check fails for one of the items.
    console.error("Failed to decrement inventory. The transaction has been rolled back.", error);
    // You might want to add logic here to flag the order for manual review.
  }
}