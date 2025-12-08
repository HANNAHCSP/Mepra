"use server";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export type ProductSearchParams = {
  query?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: string; // 'price_asc' | 'price_desc' | 'newest'
  categories?: string[]; // New
  collections?: string[]; // New
};

export async function searchProducts(params: ProductSearchParams) {
  const { query, minPrice, maxPrice, sort, categories, collections } = params;

  // 1. Dynamic Filtering Logic
  const where: Prisma.ProductWhereInput = {
    isArchived: false,
    AND: [
      // Search Logic: Name or Description
      query
        ? {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { description: { contains: query, mode: "insensitive" } },
            ],
          }
        : {},

      // Price Filter
      minPrice || maxPrice
        ? {
            variants: {
              some: {
                price: {
                  gte: minPrice ? parseFloat(minPrice) * 100 : undefined,
                  lte: maxPrice ? parseFloat(maxPrice) * 100 : undefined,
                },
              },
            },
          }
        : {},

      // Category Filter (OR logic within categories: Flatware OR Serveware)
      categories && categories.length > 0
        ? {
            category: { in: categories, mode: "insensitive" },
          }
        : {},

      // Collection Filter
      collections && collections.length > 0
        ? {
            collection: { in: collections, mode: "insensitive" },
          }
        : {},
    ],
  };

  // 2. Sorting Logic
  let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };

  if (sort === "price_asc") {
    // Note: Sorting by relation aggregates is complex.
    // For now, we fallback to name to prevent crashes, or you can implement raw SQL later.
    orderBy = { name: "asc" };
  } else if (sort === "price_desc") {
    orderBy = { name: "desc" };
  } else if (sort === "newest") {
    orderBy = { createdAt: "desc" };
  }

  // 3. Fetch Data
  const products = await prisma.product.findMany({
    where,
    orderBy,
    include: {
      variants: {
        take: 1,
        orderBy: { price: "asc" },
      },
    },
  });

  return products;
}

/**
 * Fetches related products for a given product ID.
 */
export async function getRelatedProducts(currentProductId: string, limit = 4) {
  const products = await prisma.product.findMany({
    where: {
      id: { not: currentProductId },
    },
    take: limit,
    orderBy: { createdAt: "desc" },
    include: {
      variants: {
        take: 1,
        orderBy: { price: "asc" },
      },
    },
  });

  return products;
}

/**
 * NEW: Helper to get all unique categories and collections for the filter sidebar
 * This avoids hardcoding them in the UI.
 */
export async function getFilterFacets() {
  const [categories, collections] = await Promise.all([
    prisma.product.findMany({
      select: { category: true },
      where: { category: { not: null } },
      distinct: ["category"],
    }),
    prisma.product.findMany({
      select: { collection: true },
      where: { collection: { not: null } },
      distinct: ["collection"],
    }),
  ]);

  return {
    categories: categories.map((c) => c.category!).filter(Boolean),
    collections: collections.map((c) => c.collection!).filter(Boolean),
  };
}
