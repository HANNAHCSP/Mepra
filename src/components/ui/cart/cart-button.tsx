// src/components/ui/cart/cart-button-v2.tsx
import { getCart } from "@/app/actions/cart";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";

export default async function CartButton() {
  const cart = await getCart();
  const itemCount = cart?.items.reduce((acc, item) => acc + item.quantity, 0) ?? 0;

  return (
    <Link
      href="/cart"
      className="relative flex items-center gap-2.5 px-4 py-2.5 rounded-md text-foreground/80 hover:text-foreground hover:bg-accent/60 transition-all duration-300 group overflow-hidden"
      aria-label={`Shopping cart with ${itemCount} items`}
    >
      {/* Animated background shimmer */}
      <div className="absolute inset-0 bg-gradient-to-r from-secondary/0 via-secondary/5 to-secondary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />

      <div className="relative flex items-center gap-2.5">
        {/* Icon container with badge */}
        <div className="relative">
          <ShoppingBag
            className="w-4 h-4 lg:w-[18px] lg:h-[18px] relative z-10"
            strokeWidth={1.5}
          />

          {/* Premium Badge */}
          {itemCount > 0 && (
            <div className="absolute -top-2 -right-2 flex items-center justify-center">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-secondary/30 blur-md animate-pulse" />

              {/* Badge */}
              <span className="relative flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-gradient-to-br from-secondary via-secondary to-secondary/90 text-[9px] font-bold text-white shadow-lg border border-secondary/20 px-1">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            </div>
          )}
        </div>

        {/* Text */}
        <span className="hidden md:inline relative z-10 text-xs lg:text-sm font-medium tracking-wider uppercase">
          Cart
        </span>
      </div>
    </Link>
  );
}
