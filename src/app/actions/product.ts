"use server";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export type ProductSearchParams = {
  query?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: string; // 'price_asc' | 'price_desc' | 'newest'
};

export async function searchProducts(params: ProductSearchParams) {
  const { query, minPrice, maxPrice, sort } = params;

  // 1. Dynamic Filtering Logic
  const where: Prisma.ProductWhereInput = {
    AND: [
      // Search Logic: Looks in Name OR Description
      query
        ? {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { description: { contains: query, mode: "insensitive" } },
            ],
          }
        : {},
      // Price Filter: Checks if ANY variant matches the price range
      minPrice || maxPrice
        ? {
            variants: {
              some: {
                price: {
                  gte: minPrice ? parseFloat(minPrice) * 100 : undefined, // Database stores cents
                  lte: maxPrice ? parseFloat(maxPrice) * 100 : undefined,
                },
              },
            },
          }
        : {},
    ],
  };

  // 2. Sorting Logic
  let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };

  // Note: Sorting by relation aggregates (like cheapest variant) is complex in Prisma.
  // For Phase 1, we stick to basic sorts or sort in memory if needed.
  // This simple implementation sorts by the product creation date or name as a fallback.
  if (sort === "price_asc") {
    // Advanced implementation would require raw SQL or denormalization
    // For now, we keep it simple or default to 'name' to prevent crashes
    orderBy = { name: "asc" };
  } else if (sort === "price_desc") {
    orderBy = { name: "desc" };
  }

  // 3. Fetch Data
  const products = await prisma.product.findMany({
    where,
    orderBy,
    include: {
      variants: {
        take: 1, // We only need one variant to display the "From $X.XX" price
        orderBy: { price: "asc" }, // Get the cheapest variant
      },
    },
  });

  return products;
}
