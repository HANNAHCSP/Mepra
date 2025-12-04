// src/components/ui/wishlist/wishlist-item-card.tsx
"use client";

import { useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { Trash2, ShoppingBag } from "lucide-react";
import { addItem } from "@/app/actions/cart";
import { toggleWishlistItem } from "@/app/actions/wishlist";
import type { Prisma } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Define a precise type for the product data passed to this component
type WishlistProduct = Prisma.ProductGetPayload<{
  include: {
    variants: {
      orderBy: { price: "asc" };
      take: 1;
    };
  };
}>;

export default function WishlistItemCard({ product }: { product: WishlistProduct }) {
  const [isPending, startTransition] = useTransition();
  const defaultVariant = product.variants[0];
  const isOutOfStock = !defaultVariant || defaultVariant.stock === 0;

  const handleAddToCart = () => {
    if (!defaultVariant) {
      toast.error("This product is currently unavailable.");
      return;
    }
    startTransition(async () => {
      try {
        await addItem(defaultVariant.id);
        toast.success("Added to cart", {
          description: `${product.name} is now in your cart.`,
        });
      } catch (e) {
        toast.error("Failed to add item to cart.");
      }
    });
  };

  const handleRemove = () => {
    startTransition(async () => {
      try {
        await toggleWishlistItem(product.id);
        toast.info("Removed from wishlist");
      } catch (e) {
        toast.error("Failed to remove item.");
      }
    });
  };

  return (
    <div className="group relative flex flex-col rounded-xl border border-border/60 bg-card shadow-sm transition-all duration-300 hover:shadow-md hover:border-secondary/30 overflow-hidden">
      {/* Remove Button (Floating Top Right) */}
      <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <Button
          variant="secondary"
          size="icon"
          onClick={handleRemove}
          disabled={isPending}
          className="h-8 w-8 rounded-full bg-white/90 backdrop-blur-md shadow-sm hover:bg-burgundy hover:text-white"
          aria-label="Remove from wishlist"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Image Section */}
      <Link
        href={`/products/${product.handle}`}
        className="block relative aspect-[4/5] overflow-hidden bg-muted"
      >
        <Image
          src={product.imageUrl || "/placeholder.svg"}
          alt={product.name}
          fill
          className={cn(
            "object-cover transition-transform duration-700 group-hover:scale-105",
            isOutOfStock && "opacity-60 grayscale"
          )}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/5">
            <Badge
              variant="secondary"
              className="bg-white/90 backdrop-blur-md text-foreground border border-border shadow-sm px-3 py-1"
            >
              Out of Stock
            </Badge>
          </div>
        )}
      </Link>

      {/* Content Section */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex-1 space-y-2">
          <Link href={`/products/${product.handle}`} className="block group/title">
            <h3 className="font-medium text-lg text-foreground group-hover/title:text-primary transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>

          <div className="flex items-center justify-between">
            <p className="text-xl font-light text-primary">
              ${(defaultVariant?.price / 100).toFixed(2)}
            </p>
            {!isOutOfStock && (
              <Badge variant="CONFIRMED" className="px-2 py-0.5 text-[10px]">
                In Stock
              </Badge>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-5 pt-4 border-t border-border/50">
          <Button
            onClick={handleAddToCart}
            disabled={isPending || isOutOfStock}
            className="w-full gap-2"
            variant={isOutOfStock ? "secondary" : "default"}
          >
            <ShoppingBag className="h-4 w-4" />
            {isPending ? "Adding..." : isOutOfStock ? "Unavailable" : "Add to Cart"}
          </Button>
        </div>
      </div>
    </div>
  );
}
