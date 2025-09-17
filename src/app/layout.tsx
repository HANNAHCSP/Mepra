// src/app/layout.tsx
import type { Metadata } from "next";
import AuthSessionProvider from "@/components/providers/session-provider";
import { Toaster } from 'sonner';
import "./globals.css";

// Define site-wide metadata
export const metadata: Metadata = {
  // metadataBase is crucial for resolving absolute URLs for SEO
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: "Mepra | MepraEG- Official Store",
    template: "%s | Mepra ",
  },
  description: "Official store for MepraEG, offering Italian-made luxury flatware, cookware, and serveware since 1947. Discover timeless design and exceptional quality.",
  openGraph: {
    title: "Mepra | MepraEG- Official Store - Official Store",
    description: "Experience Italian craftsmanship with Mepra's luxury collections.",
    url: "/", // Canonical URL for the site
    siteName: "MepraEG",
    images: [
      {
        url: '/opengraph-image.png', // Default social sharing image
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_EG', // Specify locale
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Mepra | MepraEG- Official Store",
    description: "Discover timeless Italian design and exceptional quality with Mepra's luxury collections.",
    images: ['/opengraph-image.png'], // Default Twitter sharing image
  },
  robots: { // Default robots policy
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthSessionProvider>
          {children}
        </AuthSessionProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}