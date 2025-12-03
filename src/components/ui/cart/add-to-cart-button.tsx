"use client";

import { addItem, decrementItem, incrementItem } from "@/app/actions/cart";
import { CartWithItems } from "@/types/cart";
import { Minus, Plus } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

interface AddToCartButtonProps {
  variantId: string;
  cart: CartWithItems | null;
}

export default function AddToCartButton({ variantId, cart }: AddToCartButtonProps) {
  const [isPending, startTransition] = useTransition();

  const cartItem = cart?.items.find((item) => item.variantId === variantId);

  const handleAddItem = () => {
    startTransition(async () => {
      try {
        await addItem(variantId);
        toast.success("Item added to your cart.");
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
      <div className="flex items-center justify-center rounded-md border border-input">
        <button
          type="button"
          disabled={isPending}
          onClick={() => {
            startTransition(async () => {
              await decrementItem(cartItem.id);
            });
          }}
          className="p-3 text-muted-foreground hover:text-foreground disabled:opacity-50"
        >
          <span className="sr-only">Decrement quantity</span>
          <Minus className="h-5 w-5" />
        </button>

        <span className="w-12 text-center text-base font-medium text-foreground">
          {cartItem.quantity}
        </span>

        <button
          type="button"
          disabled={isPending}
          onClick={() => {
            startTransition(async () => {
              // --- FIX: Error handling for increment ---
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
          className="p-3 text-muted-foreground hover:text-foreground disabled:opacity-50"
        >
          <span className="sr-only">Increment quantity</span>
          <Plus className="h-5 w-5" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleAddItem}
      disabled={isPending}
      className="flex w-full items-center justify-center rounded-md border border-transparent bg-primary px-8 py-3 text-base font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50"
    >
      {isPending ? "Adding..." : "Add to cart"}
    </button>
  );
}
