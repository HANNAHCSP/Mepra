// src/app/layout.tsx
import type { Metadata } from "next";
import AuthSessionProvider from "@/components/providers/session-provider";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: "Mepra | MepraEG- Official Store",
    template: "%s | Mepra ",
  },
  description:
    "Official store for MepraEG, offering Italian-made luxury flatware, cookware, and serveware since 1947. Discover timeless design and exceptional quality.",
  openGraph: {
    title: "Mepra | MepraEG- Official Store",
    description: "Experience Italian craftsmanship with Mepra's luxury collections.",
    url: "/",
    siteName: "MepraEG",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_EG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mepra | MepraEG- Official Store",
    description:
      "Discover timeless Italian design and exceptional quality with Mepra's luxury collections.",
    images: ["/opengraph-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // ADD: Viewport configuration for mobile
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    viewportFit: "cover", // Support for notched devices
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* PWA Meta Tags for Mobile */}
        <meta name="theme-color" content="#5e503f" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
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
