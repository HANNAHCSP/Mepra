import type { Metadata, Viewport } from "next";
import AuthSessionProvider from "@/components/providers/session-provider";
import { Toaster } from "sonner";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  themeColor: "#5e503f",
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: "Mepra | The Luxury Art of Fine Living",
    template: "%s | Mepra",
  },
  description:
    "Discover Italian craftsmanship since 1947. Luxury flatware, serveware, and kitchenware designed to transform everyday moments into extraordinary experiences.",
  keywords: [
    "Mepra",
    "Italian Flatware",
    "Luxury Cutlery",
    "Silverware",
    "Kitchenware",
    "Made in Italy",
  ],
  authors: [{ name: "Mepra Egypt" }],
  creator: "Mepra",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-96x96.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Mepra Egypt",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Mepra Luxury Flatware",
      },
    ],
  },
  manifest: "/site.webmanifest",
};

// Organization JSON-LD
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Mepra Egypt",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  logo: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/logo.png`,
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+31 85 303 26 59",
    contactType: "customer service",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body className="safe-top safe-bottom">
        <AuthSessionProvider>{children}</AuthSessionProvider>
        <Toaster
          richColors
          position="top-right"
          toastOptions={{
            style: {
              background: "var(--card)",
              color: "var(--foreground)",
              border: "1px solid var(--border)",
            },
          }}
        />
      </body>
    </html>
  );
}
