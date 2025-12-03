// src/components/ui/wishlist/wishlist-button.tsx
"use client";

import { useTransition } from "react";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { toggleWishlistItem } from "@/app/actions/wishlist";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface WishlistButtonProps {
  productId: string;
  initialIsWished: boolean;
}

export default function WishlistButton({ productId, initialIsWished }: WishlistButtonProps) {
  const [isPending, startTransition] = useTransition();
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleToggleWishlist = () => {
    if (status === "unauthenticated") {
      router.push(`/signin?callbackUrl=${window.location.pathname}`);
      return;
    }

    startTransition(async () => {
      try {
        const result = await toggleWishlistItem(productId);
        if (result.added) {
          toast.success(result.message, {
            description: "View all your favorites in your wishlist",
          });
        } else if (result.removed) {
          toast.info(result.message);
        }
      } catch (error) {
        toast.error("Something went wrong. Please try again.");
      }
    });
  };

  return (
    <button
      onClick={handleToggleWishlist}
      disabled={isPending || status === "loading"}
      className={cn(
        "group flex items-center justify-center gap-2 rounded-md border-2 p-3 text-sm font-medium transition-all duration-200 tap-target",
        initialIsWished
          ? "border-burgundy/30 bg-burgundy/5 text-burgundy hover:bg-burgundy/10"
          : "border-border text-foreground hover:bg-accent hover:border-secondary/50",
        "disabled:cursor-not-allowed disabled:opacity-60 active:scale-95"
      )}
      aria-label={initialIsWished ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart
        className={cn(
          "h-5 w-5 transition-all duration-300",
          initialIsWished
            ? "fill-burgundy text-burgundy scale-110"
            : "text-muted-foreground group-hover:text-burgundy group-hover:scale-110"
        )}
      />
      <span className="font-medium">{initialIsWished ? "In Wishlist" : "Add to Wishlist"}</span>
    </button>
  );
}
