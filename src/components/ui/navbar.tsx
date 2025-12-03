// src/components/ui/navbar.tsx
"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Search, User2 } from "lucide-react";

export default function Navbar({
  cart,
  wishlist,
}: {
  cart?: React.ReactNode;
  wishlist?: React.ReactNode;
}) {
  const { data: session, status } = useSession();

  const getAccountUrl = () => {
    if (status === "loading") return "/signin";
    if (!session?.user) return "/signin";
    return session.user.role === "admin" ? "/admin" : "/account";
  };

  const accountUrl = getAccountUrl();

  return (
    <nav className="bg-white text-foreground">
      {/* UPDATED: Softer black background */}
      <div className="bg-[#0a0a0a] text-white text-xs">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-8 flex items-center justify-end gap-6"></div>
      </div>

      <div className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* UPDATED: Increased vertical padding */}
          <div className="grid grid-cols-[1fr_auto_1fr] items-center h-24">
            <div aria-hidden />
            <Link href="/" className="relative bg-white px-6 py-2 text-center select-none">
              <span className="absolute left-0 right-0 -top-1 h-[2px] bg-primary" />
              <span className="absolute left-0 right-0 -bottom-1 h-[2px] bg-primary" />
              <div className="leading-none font-medium tracking-[0.18em] text-[22px] text-foreground">
                THE
              </div>
              <div className="leading-none font-medium tracking-[0.12em] text-[26px] text-foreground">
                LUXURY ART
              </div>
              <div className="mt-1 text-[10px] tracking-[0.35em] text-muted-foreground">
                MEPRAEG
              </div>
            </Link>

            {/* UPDATED: Improved icon sizes and colors */}
            <div className="flex items-center justify-end gap-6 text-sm font-semibold">
              <Link
                href="/search"
                className="hidden sm:inline-flex items-center gap-2 text-foreground hover:text-secondary transition-colors duration-200"
              >
                <Search size={18} />
                <span className="uppercase">Search</span>
              </Link>
              <Link
                href={accountUrl}
                className="inline-flex items-center gap-2 text-foreground hover:text-secondary transition-colors duration-200"
              >
                <User2 size={18} />
                <span className="uppercase">
                  {session?.user
                    ? session.user.role === "admin"
                      ? "Admin"
                      : "Account"
                    : "Account"}
                </span>
              </Link>

              {wishlist}
              {cart}
            </div>
          </div>
        </div>

        {/* UPDATED: Better hover colors */}
        <div className="border-t border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-center">
            <div className="flex flex-wrap items-center gap-6 text-[13px] font-extrabold uppercase tracking-wide">
              <Link
                href="/flatware"
                className="text-foreground hover:text-secondary transition-colors duration-200"
              >
                Flatware
              </Link>
              <Link
                href="/cookware"
                className="text-foreground hover:text-secondary transition-colors duration-200"
              >
                Cookware
              </Link>
              <Link
                href="/serveware"
                className="text-foreground hover:text-secondary transition-colors duration-200"
              >
                Serveware
              </Link>
              <Link
                href="/configurator"
                className="text-foreground hover:text-secondary transition-colors duration-200"
              >
                Configurator
              </Link>
              <Link
                href="/faq"
                className="text-foreground hover:text-secondary transition-colors duration-200"
              >
                FAQ
              </Link>
              <Link
                href="/search"
                className="sm:hidden inline-flex items-center gap-2 hover:text-secondary transition-colors duration-200"
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
