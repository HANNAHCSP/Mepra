"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import { SlidersHorizontal, X, Check, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { getFilterFacets } from "@/app/actions/product";

export function SearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // State for dynamic facets
  const [facets, setFacets] = useState<{ categories: string[]; collections: string[] }>({
    categories: [],
    collections: [],
  });

  useEffect(() => {
    // Load available categories/collections on mount
    getFilterFacets().then(setFacets);
  }, []);

  // Helper to toggle array filters (e.g. ?category=Flatware&category=Serveware)
  const toggleFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      const current = params.getAll(key);

      if (current.includes(value)) {
        params.delete(key);
        current.filter((c) => c !== value).forEach((c) => params.append(key, c));
      } else {
        params.append(key, value);
      }

      router.push(`/search?${params.toString()}`);
    },
    [searchParams, router]
  );

  const isActive = (key: string, value: string) => {
    return searchParams.getAll(key).includes(value);
  };

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
    <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-300">
      <div className="flex lg:hidden items-center justify-between pb-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">Filters</h2>
        <button onClick={() => setIsMobileOpen(false)} className="p-2 text-muted-foreground">
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Categories */}
      {facets.categories.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">
            Category
          </h3>
          <div className="space-y-2">
            {facets.categories.map((cat) => (
              <button
                key={cat}
                onClick={() => toggleFilter("category", cat)}
                className={cn(
                  "flex items-center w-full text-left text-sm py-1.5 transition-colors",
                  isActive("category", cat)
                    ? "text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <div
                  className={cn(
                    "w-4 h-4 rounded border mr-3 flex items-center justify-center transition-colors",
                    isActive("category", cat) ? "bg-primary border-primary" : "border-gray-300"
                  )}
                >
                  {isActive("category", cat) && <Check className="w-3 h-3 text-white" />}
                </div>
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Collections */}
      {facets.collections.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">
            Collection
          </h3>
          <div className="space-y-2">
            {facets.collections.map((col) => (
              <button
                key={col}
                onClick={() => toggleFilter("collection", col)}
                className={cn(
                  "flex items-center w-full text-left text-sm py-1.5 transition-colors",
                  isActive("collection", col)
                    ? "text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <div
                  className={cn(
                    "w-4 h-4 rounded border mr-3 flex items-center justify-center transition-colors",
                    isActive("collection", col) ? "bg-primary border-primary" : "border-gray-300"
                  )}
                >
                  {isActive("collection", col) && <Check className="w-3 h-3 text-white" />}
                </div>
                {col}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Price Section */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">
          Price Range
        </h3>
        <div className="space-y-2">
          {[
            { label: "Under $50", max: "50" },
            { label: "$50 - $100", min: "50", max: "100" },
            { label: "$100 and up", min: "100" },
          ].map((range) => {
            const isSelected =
              searchParams.get("min") === (range.min || null) &&
              searchParams.get("max") === (range.max || null);

            return (
              <button
                key={range.label}
                onClick={() => {
                  const params = new URLSearchParams(searchParams.toString());
                  if (isSelected) {
                    params.delete("min");
                    params.delete("max");
                  } else {
                    if (range.min) params.set("min", range.min);
                    else params.delete("min");
                    if (range.max) params.set("max", range.max);
                    else params.delete("max");
                  }
                  router.push(`/search?${params.toString()}`);
                }}
                className={cn(
                  "flex items-center w-full text-left text-sm py-1.5 transition-colors",
                  isSelected
                    ? "text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <div
                  className={cn(
                    "w-4 h-4 rounded-full border mr-3 flex items-center justify-center transition-colors",
                    isSelected ? "border-primary" : "border-gray-300"
                  )}
                >
                  {isSelected && <div className="w-2 h-2 rounded-full bg-primary" />}
                </div>
                {range.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Clear All */}
      {searchParams.toString().length > 0 && (
        <div className="pt-4 border-t border-border">
          <Button
            variant="ghost"
            onClick={() => router.push("/search")}
            className="w-full text-muted-foreground hover:text-burgundy transition-colors"
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
          className="w-full flex items-center justify-center gap-2"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filter Products
        </Button>
      </div>

      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-primary/20 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="absolute inset-y-0 right-0 w-3/4 max-w-sm bg-background shadow-xl p-6 overflow-y-auto border-l border-border">
            <FilterContent />
          </div>
        </div>
      )}
    </>
  );
}
