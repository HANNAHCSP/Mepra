// src/components/ui/wishlist/wishlist-nav-button.tsx
import Link from "next/link";
import { Heart } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function WishlistNavButton() {
  const session = await getServerSession(authOptions);

  let itemCount = 0;
  if (session?.user?.id) {
    itemCount = await prisma.wishlistItem.count({
      where: { wishlist: { userId: session.user.id } },
    });
  }

  return (
    <Link
      href="/wishlist"
      className="relative flex items-center gap-2 px-3 py-2 rounded-lg text-foreground hover:text-secondary hover:bg-accent/50 transition-all duration-200 group"
      aria-label={`Wishlist with ${itemCount} items`}
    >
      <div className="relative">
        <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-burgundy text-[10px] font-bold text-white border-2 border-card shadow-sm">
            {itemCount > 9 ? "9+" : itemCount}
          </span>
        )}
      </div>
      <span className="hidden md:inline text-sm font-medium uppercase tracking-wide">Wishlist</span>
    </Link>
  );
}
