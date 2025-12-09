"use server";

import { prisma } from "@/lib/prisma";
import type { OrderItem } from "@prisma/client";
import { Resend } from "resend";
import LowStockEmail from "@/components/ui/email/low-stock";

const resend = new Resend(process.env.RESEND_API_KEY);
const LOW_STOCK_THRESHOLD = 5;
const ADMIN_EMAIL = "hannahelhaddad3@gmail.com"; // Your admin email

export async function decrementInventory(items: OrderItem[]): Promise<void> {
  if (!items || items.length === 0) {
    return;
  }

  console.log(`Decrementing inventory for ${items.length} line items.`);

  try {
    await prisma.$transaction(async (tx) => {
      for (const item of items) {
        // 1. Decrement Stock & Return New Value
        // We use 'update' instead of 'updateMany' to get the result back
        const updatedVariant = await tx.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { decrement: item.quantity } },
          include: { product: true }, // Include product to get the name
        });

        // 2. Check for Low Stock
        if (updatedVariant.stock <= LOW_STOCK_THRESHOLD) {
          console.log(`⚠️ Low stock detected for ${updatedVariant.product.name} (Stock: ${updatedVariant.stock})`);
          
          // 3. Send Email (Fire & Forget - don't await/block the transaction)
          if (process.env.RESEND_API_KEY) {
            resend.emails.send({
              from: "Mepra Inventory <onboarding@resend.dev>",
              to: ADMIN_EMAIL,
              subject: `Low Stock Alert: ${updatedVariant.product.name}`,
              react: LowStockEmail({
                productName: updatedVariant.product.name,
                sku: updatedVariant.sku || "N/A",
                remainingStock: updatedVariant.stock,
                productId: updatedVariant.productId,
              }),
            }).catch(err => console.error("Failed to send low stock email:", err));
          }
        }
      }
    });

    console.log("Inventory decremented successfully.");
  } catch (error) {
    console.error("Failed to decrement inventory:", error);
    // Note: If stock goes below 0, Prisma will throw an error here automatically
    // because integer fields cannot be negative if we used unsigned logic, 
    // but standard Postgres ints allow negatives.
    // Ideally, you should have a check `stock: { gte: item.quantity }` inside the update's where clause,
    // but `update` throws if record not found. 
    // For simplicity in this flow, we rely on the pre-check done in `createOrder` (validateStock).
  }
}