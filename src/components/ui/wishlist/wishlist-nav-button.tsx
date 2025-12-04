// src/components/ui/wishlist/wishlist-nav-button-v2.tsx
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
      className="relative flex items-center gap-2.5 px-4 py-2.5 rounded-md text-foreground/80 hover:text-foreground hover:bg-accent/60 transition-all duration-300 group overflow-hidden"
      aria-label={`Wishlist with ${itemCount} items`}
    >
      {/* Animated background shimmer */}
      <div className="absolute inset-0 bg-gradient-to-r from-burgundy/0 via-burgundy/5 to-burgundy/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />

      <div className="relative flex items-center gap-2.5">
        {/* Icon container with badge */}
        <div className="relative">
          <Heart className="w-4 h-4 lg:w-[18px] lg:h-[18px] relative z-10" strokeWidth={1.5} />

          {/* Premium Badge */}
          {itemCount > 0 && (
            <div className="absolute -top-2 -right-2 flex items-center justify-center">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-burgundy/40 blur-md animate-pulse" />

              {/* Badge with heart theme */}
              <span className="relative flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-gradient-to-br from-burgundy via-burgundy to-burgundy/90 text-[9px] font-bold text-white shadow-lg border border-burgundy/20 px-1">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            </div>
          )}
        </div>

        {/* Text */}
        <span className="hidden md:inline relative z-10 text-xs lg:text-sm font-medium tracking-wider uppercase">
          Wishlist
        </span>
      </div>
    </Link>
  );
}
