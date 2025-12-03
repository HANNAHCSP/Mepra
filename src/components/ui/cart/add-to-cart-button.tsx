// src/components/ui/cart/add-to-cart-button.tsx
"use client";

import { addItem, decrementItem, incrementItem } from "@/app/actions/cart";
import { CartWithItems } from "@/types/cart";
import { Minus, Plus, Check } from "lucide-react";
import { useTransition, useState, useEffect } from "react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
interface AddToCartButtonProps {
  variantId: string;
  cart: CartWithItems | null;
}

export default function AddToCartButton({ variantId, cart }: AddToCartButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [justAdded, setJustAdded] = useState(false);

  const cartItem = cart?.items.find((item) => item.variantId === variantId);

  useEffect(() => {
    if (justAdded) {
      const timer = setTimeout(() => setJustAdded(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [justAdded]);

  const handleAddItem = () => {
    startTransition(async () => {
      try {
        await addItem(variantId);
        setJustAdded(true);
        toast.success("Added to cart", {
          description: "Item successfully added to your shopping cart",
        });
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Error: Could not add item to cart.");
        }
      }
    });
  };

  if (cartItem) {
    return (
      <div className="flex items-center justify-center rounded-md border-2 border-input overflow-hidden">
        <button
          type="button"
          disabled={isPending}
          onClick={() => {
            startTransition(async () => {
              await decrementItem(cartItem.id);
            });
          }}
          className="p-3 text-muted-foreground hover:text-foreground hover:bg-accent disabled:opacity-50 transition-all duration-200 tap-target"
          aria-label="Decrease quantity"
        >
          <Minus className="h-5 w-5" />
        </button>

        <span className="w-14 text-center text-base font-semibold text-foreground">
          {cartItem.quantity}
        </span>

        <button
          type="button"
          disabled={isPending}
          onClick={() => {
            startTransition(async () => {
              try {
                await incrementItem(cartItem.id);
              } catch (error) {
                if (error instanceof Error) {
                  toast.error(error.message);
                } else {
                  toast.error("Cannot add more items.");
                }
              }
            });
          }}
          className="p-3 text-muted-foreground hover:text-foreground hover:bg-accent disabled:opacity-50 transition-all duration-200 tap-target"
          aria-label="Increase quantity"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleAddItem}
      disabled={isPending}
      className={cn(
        "flex w-full items-center justify-center gap-2 rounded-md border border-transparent px-8 py-3.5 text-base font-medium transition-all duration-200 tap-target active:scale-95",
        justAdded
          ? "bg-secondary text-secondary-foreground"
          : "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md",
        "focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 disabled:opacity-50"
      )}
    >
      {justAdded ? (
        <>
          <Check className="h-5 w-5" />
          <span>Added!</span>
        </>
      ) : isPending ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Adding...</span>
        </>
      ) : (
        <span>Add to cart</span>
      )}
    </button>
  );
}
