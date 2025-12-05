"use client";

import { useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { toggleWishlistItem } from "@/app/actions/wishlist";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface WishlistButtonProps {
  productId: string;
  initialIsWished: boolean;
}

export default function WishlistButton({ productId, initialIsWished }: WishlistButtonProps) {
  const [isWished, setIsWished] = useState(initialIsWished);
  const [isPending, startTransition] = useTransition();

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation if inside a product card

    // Optimistic UI update
    const previousState = isWished;
    setIsWished(!isWished);

    startTransition(async () => {
      try {
        const result = await toggleWishlistItem(productId);
        if (result.added) {
          toast.success(result.message);
        } else {
          toast.info(result.message);
        }
      } catch (error) {
        // Revert UI on failure
        setIsWished(previousState);
        toast.error("Failed to update wishlist. Please try again.");
      }
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className="group flex items-center justify-center p-2 rounded-full hover:bg-secondary/10 transition-all duration-200 tap-target"
      aria-label={isWished ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart
        className={cn(
          "w-6 h-6 transition-colors duration-200",
          isWished
            ? "fill-burgundy text-burgundy"
            : "text-muted-foreground group-hover:text-secondary"
        )}
        strokeWidth={1.5}
      />
    </button>
  );
}
