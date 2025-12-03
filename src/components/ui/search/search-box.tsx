// src/components/ui/search/search-box.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition, useEffect, useRef } from "react";
import { Search, X, Loader2, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function SearchBox() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [term, setTerm] = useState(searchParams.get("q") || "");
  const [isPending, startTransition] = useTransition();
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTerm(searchParams.get("q") || "");
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateSearch(term);
  };

  const handleClear = () => {
    setTerm("");
    updateSearch("");
    inputRef.current?.focus();
  };

  const updateSearch = (newTerm: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newTerm) {
      params.set("q", newTerm);
    } else {
      params.delete("q");
    }

    startTransition(() => {
      router.push(`/search?${params.toString()}`);
    });
  };

  // Popular searches (could be dynamic)
  const popularSearches = ["Flatware", "Cookware", "Serveware"];

  return (
    <div className="relative w-full max-w-lg">
      <form onSubmit={handleSearch} className="relative group">
        <div className="relative">
          <div
            className={cn(
              "absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none transition-colors duration-200",
              isFocused ? "text-secondary" : "text-muted-foreground"
            )}
          >
            <Search className="h-5 w-5" />
          </div>

          <Input
            ref={inputRef}
            type="search"
            placeholder="Search products..."
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={cn(
              "pl-12 pr-12 h-12 bg-white shadow-sm transition-all duration-200 text-base",
              isFocused && "ring-2 ring-secondary/20 border-secondary"
            )}
          />

          <div className="absolute inset-y-0 right-0 flex items-center pr-3 gap-2">
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin text-secondary" />
            ) : term ? (
              <button
                type="button"
                onClick={handleClear}
                className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-full p-1 transition-all tap-target"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </div>
        </div>

        {/* Keyboard shortcut hint */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
          <kbd className="hidden sm:inline-flex items-center gap-1 rounded border border-border bg-muted px-2 py-1 text-xs text-muted-foreground">
            <span>⏎</span>
          </kbd>
        </div>
      </form>

      {/* Popular Searches Dropdown */}
      {isFocused && !term && (
        <div className="absolute z-50 mt-2 w-full bg-card border-2 border-border rounded-lg shadow-lg p-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-4 w-4 text-secondary" />
            <span className="text-sm font-semibold text-foreground">Popular Searches</span>
          </div>
          <div className="space-y-1">
            {popularSearches.map((search) => (
              <button
                key={search}
                onClick={() => {
                  setTerm(search);
                  updateSearch(search);
                }}
                className="w-full text-left px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200"
              >
                {search}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
