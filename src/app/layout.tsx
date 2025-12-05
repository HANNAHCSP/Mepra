// src/app/layout.tsx
import type { Metadata, Viewport } from "next"; // 1. Import Viewport type
import AuthSessionProvider from "@/components/providers/session-provider";
import { Toaster } from "sonner";
import "./globals.css";

// 2. Separate Viewport export
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  themeColor: "#5e503f", // Moved from <head>
};

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
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
  },
  // REMOVED: viewport object from here
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>{/* REMOVED: Manual meta tags in favor of the exports above */}</head>
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
