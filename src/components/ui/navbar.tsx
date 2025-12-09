"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  Search,
  User2,
  ChevronDown,
  Utensils,
  UtensilsCrossed,
  Coffee,
  ChefHat,
  Soup,
  Menu,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface NavbarProps {
  cart?: React.ReactNode;
  wishlist?: React.ReactNode;
  announcement?: string;
}

export default function Navbar({ cart, wishlist, announcement }: NavbarProps) {
  const { data: session, status } = useSession();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const getAccountUrl = () => {
    if (status === "loading") return "/signin";
    if (!session?.user) return "/signin";
    return session.user.role === "admin" ? "/admin" : "/account";
  };

  const accountUrl = getAccountUrl();

  // Helper to get user initials safely
  const userInitials = session?.user?.name
    ? session.user.name.charAt(0).toUpperCase()
    : session?.user?.email?.charAt(0).toUpperCase();

  const flatwareItems = [
    {
      href: "/flatware/cutlery-sets",
      label: "Cutlery Sets",
      icon: UtensilsCrossed,
      desc: "Complete collections",
    },
    {
      href: "/flatware/daily-use",
      label: "Daily Use Sets",
      icon: Coffee,
      desc: "Everyday elegance",
    },
    { href: "/flatware/spoons", label: "Spoons", icon: Soup, desc: "Table, tea & dessert" },
    { href: "/flatware/forks", label: "Forks", icon: Utensils, desc: "Dinner & salad forks" },
    { href: "/flatware/knives", label: "Knives", icon: ChefHat, desc: "Steak & butter knives" },
    {
      href: "/flatware/servings",
      label: "Servings",
      icon: Utensils,
      desc: "Ladles, servers & more",
    },
  ];

  return (
    <nav className="bg-white text-foreground relative z-50 font-sans group/nav">
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className="relative bg-[#1a1a1a] text-white overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 h-9 flex items-center justify-between text-[10px] uppercase tracking-[0.2em] font-medium">
          <span className="hidden lg:flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity cursor-default">
            <span>Italian Heritage</span>
            <span className="w-1 h-1 rounded-full bg-white/30" />
            <span>Est. 1947</span>
          </span>
          <p className="w-full lg:w-auto text-center animate-in fade-in slide-in-from-top-1 duration-700">
            {announcement || "Complimentary Shipping on Orders Over 1000 EGP"}
          </p>
          <span className="hidden lg:flex opacity-70 hover:opacity-100 transition-opacity cursor-pointer">
            Lifetime Warranty
          </span>
        </div>
      </div>

      {/* 2. MAIN HEADER */}
      <div className="relative bg-white z-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* LEFT: Search Trigger */}
            <div className="flex flex-1 items-center justify-start">
              <Link
                href="/search"
                className="group/search flex items-center gap-3 pr-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Search"
              >
                <Search
                  className="w-4 h-4 transition-transform group-hover/search:scale-110"
                  strokeWidth={1.5}
                />
                <span className="hidden sm:inline-block text-[11px] font-bold uppercase tracking-widest border-b border-transparent group-hover/search:border-foreground transition-all">
                  Search
                </span>
              </Link>
            </div>

            {/* CENTER: Brand Logo */}
            <Link
              href="/"
              className="flex-shrink-0 flex flex-col items-center justify-center group/logo"
              aria-label="Mepra Home"
            >
              <h1 className="text-2xl lg:text-3xl font-semibold tracking-[0.3em] text-foreground leading-none ml-1.5 transition-opacity group-hover/logo:opacity-80">
                MEPRA
              </h1>
              <span className="text-[9px] font-medium tracking-[0.7em] text-secondary mt-1.5 uppercase transition-all group-hover/logo:text-primary">
                The Luxury Art
              </span>
            </Link>

            {/* RIGHT: User Actions */}
            <div className="flex flex-1 items-center justify-end gap-4 sm:gap-6">
              {/* Account Link - ENHANCED */}
              <Link
                href={accountUrl}
                className="group flex items-center justify-center transition-all duration-300"
                aria-label={session?.user ? "My Account" : "Sign In"}
              >
                {status === "authenticated" ? (
                  // Logged In: Personalized Avatar
                  <div className="h-8 w-8 rounded-full bg-secondary/10 border border-secondary/30 text-secondary flex items-center justify-center text-xs font-bold ring-2 ring-transparent group-hover:bg-secondary group-hover:text-white group-hover:shadow-md group-hover:ring-secondary/20 transition-all duration-300">
                    {userInitials}
                  </div>
                ) : (
                  // Logged Out: Clean Icon
                  <div className="p-1.5 rounded-full text-muted-foreground hover:text-secondary hover:bg-secondary/5 transition-all duration-200">
                    <User2 className="w-5 h-5" strokeWidth={1.5} />
                  </div>
                )}
              </Link>

              {/* Divider */}
              <div className="h-4 w-[1px] bg-border/40 hidden sm:block" />

              {/* Wishlist */}
              <div className="text-muted-foreground hover:text-secondary transition-colors cursor-pointer p-1">
                {wishlist}
              </div>

              {/* Cart */}
              <div className="text-muted-foreground hover:text-secondary transition-colors cursor-pointer p-1">
                {cart}
              </div>

              {/* Mobile Trigger */}
              <button className="lg:hidden ml-1 text-foreground hover:text-secondary transition-colors">
                <Menu className="w-6 h-6" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. SECONDARY NAVIGATION */}
      <div className="hidden lg:block bg-[#f5f5f4] border-t border-b border-border/10 shadow-[inset_0_1px_4px_rgba(0,0,0,0.02)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-12 h-12">
            {/* Flatware Mega Menu Trigger */}
            <div
              className="group h-full flex items-center"
              onMouseEnter={() => setActiveDropdown("flatware")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link
                href="/flatware"
                className={cn(
                  "relative h-full flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.15em] transition-colors duration-200 px-2",
                  activeDropdown === "flatware"
                    ? "text-secondary bg-white shadow-sm"
                    : "text-foreground/80 hover:text-secondary"
                )}
              >
                Flatware
                <ChevronDown
                  className={cn(
                    "w-3 h-3 transition-transform duration-200",
                    activeDropdown === "flatware" ? "rotate-180" : ""
                  )}
                />
              </Link>

              {/* --- MEGA MENU (Dropdown) --- */}
              <div
                className={cn(
                  "absolute left-1/2 -translate-x-1/2 top-full w-[800px] bg-white rounded-b-xl shadow-xl border-x border-b border-border/20 overflow-hidden transition-all duration-200 ease-out origin-top z-40",
                  activeDropdown === "flatware"
                    ? "opacity-100 visible translate-y-0"
                    : "opacity-0 invisible -translate-y-2 pointer-events-none"
                )}
              >
                <div className="flex h-[300px]">
                  {/* Left: Category Grid */}
                  <div className="flex-1 p-8 bg-white">
                    <div className="flex items-center justify-between mb-5 pb-3 border-b border-border/30">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        Categories
                      </span>
                      <Link
                        href="/flatware"
                        className="text-[10px] font-bold uppercase text-secondary hover:text-primary transition-colors"
                      >
                        View All
                      </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                      {flatwareItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="group/item flex items-center gap-3 p-2 -ml-2 rounded-md hover:bg-neutral-50 transition-colors"
                        >
                          <div className="p-1.5 rounded-full bg-secondary/10 text-secondary group-hover/item:bg-secondary group-hover/item:text-white transition-colors">
                            <item.icon className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-foreground group-hover/item:text-primary uppercase tracking-wide transition-colors">
                              {item.label}
                            </h4>
                            <p className="text-[9px] text-muted-foreground mt-0.5">{item.desc}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Right: Featured Visual */}
                  <div className="w-[260px] relative bg-secondary/10">
                    <Image
                      src="/craftsman.png"
                      alt="Mepra Craftsmanship"
                      fill
                      className="object-cover opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-6 flex flex-col justify-end text-white text-center">
                      <h3 className="font-serif text-lg italic leading-tight mb-3">
                        The Art of
                        <br />
                        Craftsmanship
                      </h3>
                      <Link
                        href="/about"
                        className="inline-block text-[10px] font-bold uppercase tracking-widest border border-white/30 px-4 py-2 hover:bg-white hover:text-black transition-all"
                      >
                        Discover
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Link */}
            <div className="h-full flex items-center">
              <Link
                href="/faq"
                className="relative text-[11px] font-bold uppercase tracking-[0.15em] text-foreground/80 hover:text-secondary transition-colors duration-200 px-2"
              >
                FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
