"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { Fragment } from "react";

// Map readable names to paths
const routeMapping: Record<string, string> = {
  products: "Our Collection",
  cart: "Shopping Cart",
  checkout: "Checkout",
  account: "My Account",
  wishlist: "Wishlist",
  about: "Our Story",
  contact: "Contact Us",
  faq: "FAQ",
  search: "Search Results",
  "shipping-policy": "Shipping Policy",
  "returns-policy": "Returns & Refunds",
};

export default function Breadcrumbs() {
  const pathname = usePathname();

  // Don't show on homepage
  if (pathname === "/") return null;

  const segments = pathname.split("/").filter((item) => item !== "");

  return (
    <nav aria-label="Breadcrumb" className="bg-white border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
        <ol role="list" className="flex items-center space-x-2">
          {/* Home Link */}
          <li>
            <div>
              <Link
                href="/"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Home className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only">Home</span>
              </Link>
            </div>
          </li>

          {segments.map((segment, index) => {
            const href = `/${segments.slice(0, index + 1).join("/")}`;
            const isLast = index === segments.length - 1;

            // Format the name: Check map first, otherwise capitalize/clean up URL
            let name = routeMapping[segment];
            if (!name) {
              // Fallback: Remove hyphens and capitalize
              name = segment.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
            }

            // Truncate long IDs (UUIDs or CUIDs) for cleaner look
            if (name.length > 20 && !name.includes(" ")) {
              name = "Details";
            }

            return (
              <Fragment key={href}>
                <li>
                  <ChevronRight className="h-4 w-4 text-muted-foreground/50" aria-hidden="true" />
                </li>
                <li>
                  {isLast ? (
                    <span className="text-sm font-medium text-foreground" aria-current="page">
                      {name}
                    </span>
                  ) : (
                    <Link
                      href={href}
                      className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {name}
                    </Link>
                  )}
                </li>
              </Fragment>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
