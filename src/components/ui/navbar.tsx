// src/components/ui/navbar.tsx
"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Search, User2 } from "lucide-react";
import Image from "next/image";

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
    <nav className="bg-card text-foreground relative z-50">
      {/* Elegant Top Bar */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/95 to-primary opacity-95" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-10 flex items-center justify-center">
          <p className="text-primary-foreground text-xs font-light tracking-[0.2em] uppercase">
            Complimentary Shipping on Orders Above 1000 EGP
          </p>
        </div>
      </div>

      {/* Main Navigation Container */}
      <div className="border-b border-border/30 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Primary Nav */}
          <div className="relative flex items-center justify-between h-24 lg:h-28">
            {/* Left Section - Empty for balance */}
            <div className="hidden lg:flex flex-1" />

            {/* Center - Logo */}
            <Link
              href="/"
              className="relative group flex-shrink-0"
              aria-label="Mepra - Return to homepage"
            >
              <div className="relative w-40 h-16 lg:w-52 lg:h-20">
                <Image
                  src="/logo.png"
                  alt="Mepra - The Luxury Art"
                  fill
                  className="object-contain transition-all duration-500 ease-out group-hover:opacity-80"
                  priority
                  quality={100}
                />
              </div>
              {/* Subtle glow effect on hover */}
              <div className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-secondary/5 blur-2xl" />
              </div>
            </Link>

            {/* Right Section - Actions */}
            <div className="flex items-center justify-end gap-1 lg:gap-2 flex-1">
              {/* Search */}
              <Link
                href="/search"
                className="hidden sm:flex items-center gap-2.5 px-4 py-2.5 rounded-md text-foreground/80 hover:text-foreground hover:bg-accent/60 transition-all duration-300 group relative overflow-hidden"
                aria-label="Search products"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-secondary/0 via-secondary/5 to-secondary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <Search
                  className="w-4 h-4 lg:w-[18px] lg:h-[18px] relative z-10"
                  strokeWidth={1.5}
                />
                <span className="relative z-10 text-xs lg:text-sm font-medium tracking-wider uppercase">
                  Search
                </span>
              </Link>

              {/* Account */}
              <Link
                href={accountUrl}
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-md text-foreground/80 hover:text-foreground hover:bg-accent/60 transition-all duration-300 group relative overflow-hidden"
                aria-label={session?.user ? "My Account" : "Sign In"}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-secondary/0 via-secondary/5 to-secondary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <User2
                  className="w-4 h-4 lg:w-[18px] lg:h-[18px] relative z-10"
                  strokeWidth={1.5}
                />
                <span className="hidden md:inline relative z-10 text-xs lg:text-sm font-medium tracking-wider uppercase">
                  {session?.user
                    ? session.user.role === "admin"
                      ? "Admin"
                      : "Account"
                    : "Sign In"}
                </span>
              </Link>

              {/* Wishlist & Cart */}
              <div className="flex items-center gap-1 lg:gap-2 ml-2 pl-2 border-l border-border/40">
                {wishlist}
                {cart}
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Navigation */}
        <div className="relative border-t border-border/20 bg-gradient-to-b from-accent/40 to-accent/20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center h-12 overflow-x-auto scrollbar-hide">
              <nav
                className="flex items-center gap-8 lg:gap-12"
                role="navigation"
                aria-label="Main navigation"
              >
                {[
                  { href: "/flatware", label: "Flatware" },
                  { href: "/cookware", label: "Cookware" },
                  { href: "/serveware", label: "Serveware" },
                  { href: "/configurator", label: "Configurator" },
                  { href: "/faq", label: "FAQ" },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="relative text-xs lg:text-sm font-semibold text-foreground/70 hover:text-foreground transition-colors duration-300 whitespace-nowrap py-1 uppercase tracking-widest group"
                  >
                    {link.label}
                    {/* Elegant expanding underline */}
                    <span className="absolute bottom-0 left-1/2 w-0 h-[1.5px] bg-gradient-to-r from-transparent via-secondary to-transparent group-hover:w-full group-hover:left-0 transition-all duration-500 ease-out" />
                    {/* Subtle dot indicator */}
                    <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </Link>
                ))}

                {/* Mobile Search */}
                <Link
                  href="/search"
                  className="sm:hidden flex items-center gap-2 text-xs font-semibold text-foreground/70 hover:text-foreground transition-colors duration-300 whitespace-nowrap uppercase tracking-widest"
                >
                  <Search className="w-4 h-4" strokeWidth={1.5} />
                  <span>Search</span>
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
