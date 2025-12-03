// src/components/ui/products/product-card.tsx
import Image from "next/image";
import Link from "next/link";
import { Eye, Heart } from "lucide-react";

interface ProductCardProps {
  id: string;
  name: string;
  handle: string;
  imageUrl: string | null;
  price: number;
  isWished?: boolean;
  onQuickView?: () => void;
  onToggleWishlist?: () => void;
}

export default function ProductCard({
  name,
  handle,
  imageUrl,
  price,
  isWished = false,
  onQuickView,
  onToggleWishlist,
}: ProductCardProps) {
  return (
    <div className="group relative">
      {/* Image Container */}
      <Link href={`/products/${handle}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-muted border border-border">
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={name}
            fill
            className="object-cover transition-all duration-500 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300" />

          {/* Quick Actions */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {onToggleWishlist && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onToggleWishlist();
                }}
                className="p-2.5 bg-white rounded-full shadow-lg hover:bg-secondary hover:text-white transition-all"
                aria-label="Add to wishlist"
              >
                <Heart className={`h-5 w-5 ${isWished ? "fill-current text-burgundy" : ""}`} />
              </button>
            )}
            {onQuickView && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onQuickView();
                }}
                className="p-2.5 bg-white rounded-full shadow-lg hover:bg-secondary hover:text-white transition-all"
                aria-label="Quick view"
              >
                <Eye className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </Link>

      {/* Product Info */}
      <div className="mt-4 space-y-2">
        <Link href={`/products/${handle}`}>
          <h3 className="text-base font-medium text-foreground group-hover:text-secondary transition-colors line-clamp-2">
            {name}
          </h3>
        </Link>
        <p className="text-lg font-semibold text-primary">${(price / 100).toFixed(2)}</p>
      </div>

      {/* Add to Cart Quick Action (bottom) */}
      <div className="mt-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
        <Link
          href={`/products/${handle}`}
          className="block w-full text-center px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
