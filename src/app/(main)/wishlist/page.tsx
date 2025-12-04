// src/app/(main)/wishlist/page.tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { Heart, ArrowRight } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { getWishlist } from "@/app/actions/wishlist";
import WishlistItemCard from "@/components/ui/wishlist/wishlist-item-card";

export default async function WishlistPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/signin?callbackUrl=/wishlist");
  }

  const wishlist = await getWishlist();
  const items = wishlist?.items ?? [];

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between border-b border-border pb-8 mb-12">
          <div>
            <h1 className="text-3xl lg:text-4xl font-light text-foreground">My Wishlist</h1>
            <p className="mt-2 text-muted-foreground">Your curated list of favorites.</p>
          </div>
          <p className="mt-4 sm:mt-0 text-sm font-medium text-secondary">
            {items.length} Item{items.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Content */}
        <div>
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 px-4 border-2 border-dashed border-border rounded-xl bg-card/50">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mb-6">
                <Heart className="h-8 w-8 text-secondary" />
              </div>
              <h2 className="text-2xl font-light text-foreground mb-3">Your wishlist is empty</h2>
              <p className="text-muted-foreground text-center max-w-sm mb-8">
                Start saving your favorite Italian-crafted pieces to build your perfect collection.
              </p>
              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow-lg hover:bg-primary/90 hover:shadow-xl transition-all duration-300 active:scale-95"
              >
                Explore Collection
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
              {items.map(({ product }) => (
                <WishlistItemCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
