// src/components/ui/products/variant-selector.tsx
"use client";

import { useState } from "react";
import { ProductVariantWithAttributes } from "@/types/product";
import { CartWithItems } from "@/types/cart";
import AddToCartButton from "@/components/ui/cart/add-to-cart-button";
import { Alert } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface VariantSelectorProps {
  variants: ProductVariantWithAttributes[];
  cart: CartWithItems | null;
}

export default function VariantSelector({ variants, cart }: VariantSelectorProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariantWithAttributes>(variants[0]);

  const isLowStock = selectedVariant.stock < 5 && selectedVariant.stock > 0;
  const isOutOfStock = selectedVariant.stock === 0;

  return (
    <div>
      <h2 className="sr-only">Product information</h2>
      <p className="text-4xl font-light tracking-tight text-primary">
        ${(selectedVariant.price / 100).toFixed(2)}
      </p>

      {/* Stock Warning */}
      {isLowStock && (
        <Alert variant="warning" className="mt-4">
          <AlertTriangle className="h-4 w-4" />
          <span className="font-medium">Only {selectedVariant.stock} left in stock!</span>
        </Alert>
      )}

      {isOutOfStock && (
        <Alert variant="destructive" className="mt-4">
          <span className="font-medium">Out of Stock</span>
        </Alert>
      )}

      <div className="mt-6">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
          Select Size
        </h3>
        <fieldset aria-label="Choose a size" className="mt-4">
          <div className="grid grid-cols-4 gap-3">
            {variants.map((variant) => {
              const variantOutOfStock = variant.stock === 0;

              return (
                <label
                  key={variant.id}
                  className={`group relative flex items-center justify-center rounded-md border-2 py-3 px-4 text-sm font-medium uppercase cursor-pointer transition-all duration-200 ${
                    variantOutOfStock
                      ? "border-border bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                      : selectedVariant.id === variant.id
                        ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                        : "border-border hover:border-secondary/50 hover:bg-accent"
                  }`}
                >
                  <input
                    type="radio"
                    name="size-choice"
                    value={variant.id}
                    checked={selectedVariant.id === variant.id}
                    onChange={() => !variantOutOfStock && setSelectedVariant(variant)}
                    disabled={variantOutOfStock}
                    className="sr-only"
                  />
                  <span>{variant.attributes?.size}</span>
                  {variantOutOfStock && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <svg
                        className="h-full w-full text-muted-foreground"
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                        stroke="currentColor"
                      >
                        <line
                          x1="0"
                          y1="100"
                          x2="100"
                          y2="0"
                          vectorEffect="non-scaling-stroke"
                          strokeWidth="2"
                        />
                      </svg>
                    </span>
                  )}
                </label>
              );
            })}
          </div>
        </fieldset>
      </div>

      <div className="mt-10">
        <AddToCartButton variantId={selectedVariant.id} cart={cart} />
      </div>
    </div>
  );
}
