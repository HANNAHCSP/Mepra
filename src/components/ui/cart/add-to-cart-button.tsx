"use client";

import { addItem, decrementItem, incrementItem } from "@/app/actions/cart";
import { CartWithItems } from "@/types/cart";
import { Minus, Plus, Check, Loader2, ShoppingBag } from "lucide-react";
import { useTransition, useState, useEffect } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/cart-context";

interface AddToCartButtonProps {
  variantId: string;
  cart: CartWithItems | null;
}

export default function AddToCartButton({ variantId, cart }: AddToCartButtonProps) {
  // We use useTransition only for the background server work, not the UI
  const [isPending, startTransition] = useTransition();
  const [justAdded, setJustAdded] = useState(false);
  const { increment } = useCart();

  const cartItem = cart?.items.find((item) => item.variantId === variantId);

  // Reset the "Added" state after 2 seconds
  useEffect(() => {
    if (justAdded) {
      const timer = setTimeout(() => setJustAdded(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [justAdded]);

  const handleAddItem = () => {
    // 1. INSTANT UI UPDATE (Synchronous)
    // We do NOT wait for startTransition here. This makes it feel instant.
    setJustAdded(true);
    increment(1);

    // Instant Toast (No delay)
    toast.success("Added to cart", {
      description: "Item secured.",
      duration: 2000,
    });

    // 2. BACKGROUND SERVER SYNC
    // The user doesn't see this pending state for the "add" action because we already showed success.
    startTransition(async () => {
      try {
        await addItem(variantId);
      } catch (error) {
        // Rollback visual state only if it fails
        increment(-1);
        setJustAdded(false);
        toast.error("Could not add item. Please try again.");
      }
    });
  };

  const handleIncrement = () => {
    if (!cartItem) return;

    // Instant UI
    increment(1);

    // Background Server
    startTransition(async () => {
      try {
        await incrementItem(cartItem.id);
      } catch (error) {
        increment(-1); // Rollback
        toast.error("Cannot add more items.");
      }
    });
  };

  const handleDecrement = () => {
    if (!cartItem) return;

    // Instant UI
    increment(-1);

    // Background Server
    startTransition(async () => {
      try {
        await decrementItem(cartItem.id);
      } catch (error) {
        increment(1); // Rollback
        toast.error("Error updating cart.");
      }
    });
  };

  // --- RENDER: QUANTITY CONTROLS ---
  if (cartItem) {
    return (
      <div className="flex items-center justify-center rounded-md border-2 border-input overflow-hidden bg-background">
        <button
          type="button"
          disabled={isPending}
          onClick={handleDecrement}
          className="p-3 text-muted-foreground hover:text-primary hover:bg-accent disabled:opacity-50 transition-colors duration-200"
          aria-label="Decrease quantity"
        >
          <Minus className="h-4 w-4" />
        </button>

        {/* Note: We show the local optimistic quantity if possible, but fallback to server data */}
        <span className="w-12 text-center text-sm font-semibold text-foreground">
          {cartItem.quantity}
        </span>

        <button
          type="button"
          disabled={isPending}
          onClick={handleIncrement}
          className="p-3 text-muted-foreground hover:text-primary hover:bg-accent disabled:opacity-50 transition-colors duration-200"
          aria-label="Increase quantity"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    );
  }

  // --- RENDER: ADD BUTTON ---
  return (
    <button
      onClick={handleAddItem}
      // We disable only if explicitly pending on a NON-add action to prevent spamming
      disabled={isPending && !justAdded}
      className={cn(
        "flex w-full items-center justify-center gap-2 rounded-md px-8 py-3.5 text-base font-medium transition-all duration-300 shadow-sm hover:shadow-md active:scale-95",
        // COLOR LOGIC: Strictly using brand tokens
        justAdded
          ? "bg-secondary text-secondary-foreground" // Success state = Secondary (Dark/Luxury)
          : "bg-primary text-primary-foreground hover:bg-primary/90", // Default = Primary (Gold/Umber)
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
      )}
    >
      {justAdded ? (
        <>
          <Check className="h-5 w-5 animate-in zoom-in spin-in-90 duration-300" />
          <span>Added</span>
        </>
      ) : (
        <>
          <ShoppingBag className="h-5 w-5" />
          <span>Add to cart</span>
        </>
      )}
    </button>
  );
}
