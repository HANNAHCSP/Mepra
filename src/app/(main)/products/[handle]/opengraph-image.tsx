// src/app/(main)/products/[handle]/opengraph-image.tsx
import { ImageResponse } from "next/og";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs"; // Changed from 'edge' to 'nodejs'
export const alt = "Mepra Product";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;

  const product = await prisma.product.findUnique({
    where: { handle },
    select: {
      name: true,
      imageUrl: true,
      variants: {
        orderBy: { price: "asc" },
        take: 1,
        select: { price: true },
      },
    },
  });

  if (!product) {
    return new Response("Product not found", { status: 404 });
  }

  const price = product.variants[0] ? `$${(product.variants[0].price / 100).toFixed(2)}` : "";

  // Simplified image handling - just check if URL exists
  const showImage = !!product.imageUrl;
  let imageUrl = product.imageUrl;

  // Convert relative URLs to absolute
  if (imageUrl && imageUrl.startsWith("/")) {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://mepraeg.vercel.app";
    imageUrl = `${baseUrl}${imageUrl}`;
  }

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          backgroundColor: "#f9fafb",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Image Section */}
        {showImage && imageUrl && (
          <div
            style={{
              display: "flex",
              width: "50%",
              alignItems: "center",
              justifyContent: "center",
              padding: "40px",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                backgroundImage: `url(${imageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                borderRadius: "24px",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              }}
            />
          </div>
        )}

        {/* Content Section */}
        <div
          style={{
            display: "flex",
            width: showImage ? "50%" : "100%",
            flexDirection: "column",
            alignItems: showImage ? "flex-start" : "center",
            justifyContent: "center",
            padding: "48px",
            color: "#111827",
            textAlign: showImage ? "left" : "center",
          }}
        >
          <div
            style={{
              fontSize: 24,
              fontWeight: 500,
              color: "#6b7280",
              letterSpacing: "0.1em",
              marginBottom: "24px",
            }}
          >
            MEPRA | THE LUXURY ART
          </div>

          <h1
            style={{
              fontSize: showImage ? 52 : 72,
              fontWeight: 700,
              lineHeight: 1.1,
              margin: "0 0 24px 0",
              color: "#111827",
              wordWrap: "break-word",
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: showImage ? 3 : 4,
              WebkitBoxOrient: "vertical",
            }}
          >
            {product.name}
          </h1>

          {price && (
            <div
              style={{
                fontSize: showImage ? 48 : 56,
                fontWeight: 700,
                color: "#059669",
                textShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
              }}
            >
              {price}
            </div>
          )}

          {/* Fallback icon when no image */}
          {!showImage && (
            <div
              style={{
                width: "120px",
                height: "120px",
                backgroundColor: "#e5e7eb",
                borderRadius: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "32px",
                fontSize: "48px",
              }}
            >
              🏺
            </div>
          )}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
