// src/components/ui/navbar.tsx
"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Search, User2, Heart, ShoppingBag } from "lucide-react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const cartCount = 0; // TODO: wire to your cart state

  // Determine the correct account URL based on authentication and role
  const getAccountUrl = () => {
    if (status === "loading") return "/signin"; // Default while loading
    if (!session?.user) return "/signin"; // Not signed in
    
    // Signed in - redirect based on role
    return session.user.role === "admin" ? "/admin" : "/account";
  };

  const accountUrl = getAccountUrl();

  return (
    <nav className="bg-white text-gray-900">
      {/* Black Top strip */}
      <div className="bg-black text-white text-[11px]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-8 flex items-center justify-end gap-6">
         
        </div>
      </div>

      {/* Main header row: grid so the brand is perfectly centered */}
      <div className="border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center h-20">
            <div aria-hidden />

            {/* Brand */}
            <Link
              href="/"
              className="relative bg-white px-6 py-2 text-center select-none"
            >
              {/* top hairline */}
              <span className="absolute left-0 right-0 -top-1 h-[2px] bg-black" />
              {/* bottom hairline */}
              <span className="absolute left-0 right-0 -bottom-1 h-[2px] bg-black" />

              <div className="leading-none font-medium tracking-[0.18em] text-[22px]">
                THE
              </div>
              <div className="leading-none font-medium tracking-[0.12em] text-[26px]">
                LUXURY ART
              </div>
              <div className="mt-1 text-[10px] tracking-[0.35em] text-gray-600">
                MEPRAEG
              </div>
            </Link>

            {/* Right-side actions */}
            <div className="flex items-center justify-end gap-5 text-sm font-semibold">
              <Link
                href="/search"
                className="hidden sm:inline-flex items-center gap-2 text-gray-700 hover:text-amber-500"
              >
                <Search size={16} />
                <span className="uppercase">Search</span>
              </Link>

              <Link
                href={accountUrl}
                className="inline-flex items-center gap-2 text-gray-700 hover:text-amber-500"
              >
                <User2 size={16} />
                <span className="uppercase">
                  {session?.user ? (session.user.role === "admin" ? "Admin" : "Account") : "Account"}
                </span>
              </Link>

              <Link
                href="/wishlist"
                className="inline-flex items-center gap-2 text-gray-700 hover:text-amber-500"
              >
                <Heart size={16} />
                <span className="uppercase">My Wishlist</span>
              </Link>

              <Link
                href="/cart"
                className="inline-flex items-center gap-2 text-gray-700 hover:text-amber-500"
              >
                <ShoppingBag size={16} />
                <span className="uppercase">Cart</span>
                <span className="ml-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-green-500 px-1 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Nav links row */}
        <div className="border-t">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-center">
            <div className="flex flex-wrap items-center gap-6 text-[13px] font-extrabold uppercase tracking-wide">
              <Link href="/flatware" className="text-black hover:text-amber-600">
                Flatware
              </Link>
              <Link href="/cookware" className="text-black hover:text-amber-600">
                Cookware
              </Link>
              <Link href="/serveware" className="text-black hover:text-amber-600">
                Serveware
              </Link>
              <Link href="/configurator" className="text-black hover:text-amber-600">
                Configurator
              </Link>
              <Link href="/faq" className="text-black hover:text-amber-600">
                FAQ
              </Link>

              {/* Search (mobile-friendly duplicate) */}
              <Link
                href="/search"
                className="sm:hidden inline-flex items-center gap-2 hover:text-orange-400"
              >
                <Search size={16} />
                <span>Search</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}