'use client'

import { useState } from "react";
import { ProductVariantWithAttributes } from "@/types/product";
import { CartWithItems } from "@/types/cart";
import AddToCartButton from "@/components/ui/cart/add-to-cart-button";

interface VariantSelectorProps {
  variants: ProductVariantWithAttributes[];
  cart: CartWithItems | null; // Accept the cart as a prop
}

export default function VariantSelector({ variants, cart }: VariantSelectorProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariantWithAttributes>(variants[0]);

  return (
    <div>
      <h2 className="sr-only">Product information</h2>
      <p className="text-3xl tracking-tight text-gray-900">
        ${(selectedVariant.price / 100).toFixed(2)}
      </p>

      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-900">Size</h3>
        <fieldset aria-label="Choose a size" className="mt-4">
          <div className="flex items-center space-x-3">
            {variants.map((variant) => (
              <label
                key={variant.id}
                className={`group relative flex items-center justify-center rounded-md border py-3 px-4 text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1 cursor-pointer ${
                  selectedVariant.id === variant.id
                    ? "border-indigo-500 ring-2 ring-indigo-500"
                    : "border-gray-200"
                }`}
              >
                <input
                  type="radio"
                  name="size-choice"
                  value={variant.id}
                  checked={selectedVariant.id === variant.id}
                  onChange={() => setSelectedVariant(variant)}
                  className="sr-only"
                />
                <span>{variant.attributes?.size}</span>
                <span
                  className="pointer-events-none absolute -inset-px rounded-md"
                  aria-hidden="true"
                />
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="mt-10">
        {/* Pass the selected variant and the cart to the button component */}
        <AddToCartButton
          variantId={selectedVariant.id}
          cart={cart}
        />
      </div>
    </div>
  );
}

