// src/app/sitemap.ts
import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? '';

  const products = await prisma.product.findMany({
    select: { handle: true, updatedAt: true },
  });

  const productUrls = products.map((p) => ({
    url: `${appUrl}/products/${p.handle}`,
    lastModified: p.updatedAt,
  }));

  const staticUrls = [
    { url: appUrl, lastModified: new Date() },
    { url: `${appUrl}/products`, lastModified: new Date() },
  ];

  return [...staticUrls, ...productUrls];
}