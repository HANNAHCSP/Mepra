"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition, useEffect } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";

export function SearchBox() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [term, setTerm] = useState(searchParams.get("q") || "");
  const [isPending, startTransition] = useTransition();

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

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-lg group">
      <div className="relative">
        {/* Icon: Uses muted foreground (Soft Gold/Gray) */}
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground group-focus-within:text-secondary transition-colors">
          <Search className="h-4 w-4" />
        </div>

        {/* Input: Uses generic input styles which now map to your palette */}
        <Input
          type="search"
          placeholder="Search products..."
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          className="pl-10 pr-10 h-12 bg-white shadow-sm border-input hover:border-secondary transition-all text-base focus-visible:ring-ring"
        />

        <div className="absolute inset-y-0 right-0 flex items-center pr-3 gap-2">
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin text-secondary" />
          ) : term ? (
            <button
              type="button"
              onClick={handleClear}
              className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-full p-1 transition-all"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      </div>
    </form>
  );
}
