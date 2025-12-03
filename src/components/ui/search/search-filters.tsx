"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { SlidersHorizontal, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function SearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const isActive = (key: string, value: string) => searchParams.get(key) === value;

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (params.get(name) === value) {
        params.delete(name);
      } else {
        params.set(name, value);
      }
      return params.toString();
    },
    [searchParams]
  );

  const FilterContent = () => (
    <div className="space-y-8">
      {/* Mobile Header */}
      <div className="flex lg:hidden items-center justify-between pb-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">Filters</h2>
        <button onClick={() => setIsMobileOpen(false)} className="p-2 text-muted-foreground">
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Sort Section */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">
          Sort By
        </h3>
        <div className="space-y-2">
          {[
            { label: "Newest Arrivals", value: "newest" },
            { label: "Price: Low to High", value: "price_asc" },
            { label: "Price: High to Low", value: "price_desc" },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => router.push(`?${createQueryString("sort", option.value)}`)}
              className={cn(
                "flex items-center w-full text-left text-sm py-1.5 transition-colors",
                // Active: Dark Brown (Primary), Inactive: Muted, Hover: Gold (Secondary)
                isActive("sort", option.value) ||
                  (!searchParams.get("sort") && option.value === "newest")
                  ? "text-primary font-medium"
                  : "text-muted-foreground hover:text-secondary"
              )}
            >
              {isActive("sort", option.value) && <Check className="h-3 w-3 mr-2" />}
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Price Section */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">
          Price Range
        </h3>
        <div className="space-y-2">
          <button
            onClick={() => router.push(`?${createQueryString("max", "50")}`)}
            className={cn(
              "flex items-center w-full text-left text-sm py-1.5 transition-colors",
              isActive("max", "50")
                ? "text-primary font-medium"
                : "text-muted-foreground hover:text-secondary"
            )}
          >
            {isActive("max", "50") && <Check className="h-3 w-3 mr-2" />}
            Under $50
          </button>

          <button
            onClick={() => router.push(`?${createQueryString("min", "50")}`)}
            className={cn(
              "flex items-center w-full text-left text-sm py-1.5 transition-colors",
              isActive("min", "50")
                ? "text-primary font-medium"
                : "text-muted-foreground hover:text-secondary"
            )}
          >
            {isActive("min", "50") && <Check className="h-3 w-3 mr-2" />}
            $50 and up
          </button>
        </div>
      </div>

      {/* Clear All - Uses Burgundy for hover */}
      {searchParams.toString().length > 0 && (
        <div className="pt-4 border-t border-border">
          <Button
            variant="ghost"
            onClick={() => router.push("/search")}
            className="w-full text-muted-foreground hover:text-white hover:bg-burgundy"
          >
            Clear All Filters
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <>
      <div className="hidden lg:block">
        <FilterContent />
      </div>

      <div className="lg:hidden mb-6">
        <Button
          variant="outline"
          onClick={() => setIsMobileOpen(true)}
          className="w-full flex items-center justify-center gap-2 border-input text-foreground hover:bg-muted"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Show Filters & Sort
        </Button>
      </div>

      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-primary/20 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="absolute inset-y-0 right-0 w-3/4 max-w-sm bg-background shadow-xl p-6 overflow-y-auto transform transition-transform duration-300 ease-in-out border-l border-border">
            <FilterContent />
          </div>
        </div>
      )}
    </>
  );
}
