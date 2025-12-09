"use client";

import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/cart-context";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function CartButton() {
  const { itemCount } = useCart();
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (itemCount > 0) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 300);
      return () => clearTimeout(timer);
    }
  }, [itemCount]);

  return (
    <Link
      href="/cart"
      className="group p-2 flex items-center justify-center transition-opacity hover:opacity-80"
      aria-label="View Cart"
    >
      <div className="relative">
        <ShoppingBag
          className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors"
          strokeWidth={1.5}
        />

        {itemCount > 0 && (
          <span
            className={cn(
              // Updated positioning: Moved further right (-right-2) and up (-top-2)
              "absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-white shadow-sm ring-2 ring-white transition-transform duration-300",
              animate ? "scale-125" : "scale-100"
            )}
          >
            {itemCount}
          </span>
        )}
      </div>
    </Link>
  );
}
