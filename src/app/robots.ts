// src/app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const sitemap = `${process.env.NEXT_PUBLIC_APP_URL}/sitemap.xml`;

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/account'],
      },
    ],
    sitemap,
  };
}