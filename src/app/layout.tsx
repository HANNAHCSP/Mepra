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
  // 1. Add this line:
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),

  title: {
    default: "Mepra | The Luxury Art of Fine Living",
    template: "%s | Mepra",
  },
  description: "Discover Italian craftsmanship since 1947. Luxury flatware, serveware, and kitchenware designed to transform everyday moments into extraordinary experiences.",
  keywords: ["Mepra", "Italian Flatware", "Luxury Cutlery", "Silverware", "Kitchenware", "Made in Italy"],
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
    // You can remove 'url' here as it will now inherit from metadataBase
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
