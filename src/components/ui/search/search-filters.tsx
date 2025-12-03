// src/components/ui/search/search-filters.tsx
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

  // Get applied filters for chips
  const appliedFilters: Array<{ id: string; label: string; param: string }> = [];
  
  if (searchParams.get('sort') && searchParams.get('sort') !== 'newest') {
    const sortLabels: Record<string, string> = {
      price_asc: 'Price: Low to High',
      price_desc: 'Price: High to Low',
    };
    appliedFilters.push({
      id: 'sort',
      label: sortLabels[searchParams.get('sort')!] || searchParams.get('sort')!,
      param: 'sort'
    });
  }
  
  if (searchParams.get('max')) {
    appliedFilters.push({
      id: 'max',
      label: `Under $${searchParams.get('max')}`,
      param: 'max'
    });
  }
  
  if (searchParams.get('min')) {
    appliedFilters.push({
      id: 'min',
      label: `$${searchParams.get('min')} and up`,
      param: 'min'
    });
  }

  const removeFilter = (param: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(param);
    router.push(`/search?${params.toString()}`);
  };

  const FilterContent = () => (
    <div className="space-y-8">
      {/* Mobile Header */}
      <div className="flex lg:hidden items-center justify-between pb-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">Filters</h2>
        <button onClick={() => setIsMobileOpen(false)} className="p-2 text-muted-foreground hover:text-foreground transition-colors tap-target">
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Applied Filters Chips */}
      {appliedFilters.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">Active Filters</h3>
          <div className="flex flex-wrap gap-2">
            {appliedFilters.map((filter) => (
              <span
                key={filter.id}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/10 text-sm font-medium text-foreground border-2 border-secondary/20 hover:border-secondary/40 transition-all duration-200"
              >
                {filter.label}
                <button
                  onClick={() => removeFilter(filter.param)}
                  className="hover:text-burgundy transition-colors"
                  aria-label={`Remove ${filter.label} filter`}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

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
              onClick={() => router.push(`/search?${createQueryString("sort", option.value)}`)}
              className={cn(
                "flex items-center w-full text-left text-sm py-2 px-3 rounded-md transition-all duration-200",
                isActive("sort", option.value) ||
                  (!searchParams.get("sort") && option.value === "newest")
                  ? "text-primary font-semibold bg-primary/5"
                  : "text-muted-foreground hover:text-secondary hover:bg-accent"
              )}
            >
              {(isActive("sort", option.value) || (!searchParams.get("sort") && option.value === "newest")) && 
                <Check className="h-4 w-4 mr-2 flex-shrink-0" />
              }
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
            onClick={() => router.push(`/search?${createQueryString("max", "50")}`)}
            className={cn(
              "flex items-center w-full text-left text-sm py-2 px-3 rounded-md transition-all duration-200",
              isActive("max", "50")
                ? "text-primary font-semibold bg-primary/5"
                : "text-muted-foreground hover:text-secondary hover:bg-accent"
            )}
          >
            {isActive("max", "50") && <Check className="h-4 w-4 mr-2 flex-shrink-0" />}
            Under $50
          </button>

          <button
            onClick={() => router.push(`/search?${createQueryString("min", "50")}`)}
            className={cn(
              "flex items-center w-full text-left text-sm py-2 px-3 rounded-md transition-all duration-200",
              isActive("min", "50")
                ? "text-primary font-semibold bg-primary/5"
                : "text-muted-foreground hover:text-secondary hover:bg-accent"
            )}
          >
            {isActive("min", "50") && <Check className="h-4 w-4 mr-2 flex-shrink-0" />}
            $50 and up
          </button>
        </div>
      </div>

      {/* Clear All */}
      {searchParams.toString().length > 0 && (
        <div className="pt-4 border-t border-border">
          <Button
            variant="ghost"
            onClick={() => router.push("/search")}
            className="w-full text-muted-foreground hover:text-white hover:bg-burgundy transition-all duration-200"
          >
            Clear All Filters
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Filters */}
      <div className="hidden lg:block">
        <FilterContent />
      </div>

      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-6">
        <Button
          variant="outline"
          onClick={() => setIsMobileOpen(true)}
          className="w-full flex items-center justify-center gap-2 border-2 border-input text-foreground hover:bg-accent tap-target"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters & Sort {appliedFilters.length > 0 && `(${appliedFilters.length})`}
        </Button>
      </div>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-primary/20 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="absolute inset-y-0 right-0 w-3/4 max-w-sm bg-background shadow-xl p-6 overflow-y-auto transform transition-transform duration-300 ease-in-out border-l-2 border-border">
            <FilterContent />
          </div>
        </div>
      )}
    </>
  );
}