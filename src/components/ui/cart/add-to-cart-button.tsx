'use client'

import { addItem, decrementItem, incrementItem } from "@/app/actions/cart";
import { CartWithItems } from "@/types/cart";
import { Minus, Plus } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner"; // Import the toast function from sonner

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
        // This line triggers the success toast
        toast.success("Item added to your cart.");
      } catch (error) {
        // This line triggers the error toast
        toast.error("Error: Could not add item to cart.");
        console.error("Failed to add item:", error);
      }
    });
  };

  if (cartItem) {
    return (
      <div className="flex items-center justify-center rounded-md border border-gray-300">
        <button
          type="button"
          disabled={isPending}
          onClick={() => {
            startTransition(async () => {
              await decrementItem(cartItem.id);
            });
          }}
          className="p-3 text-gray-600 hover:text-gray-800 disabled:opacity-50"
        >
          <span className="sr-only">Decrement quantity</span>
          <Minus className="h-5 w-5" />
        </button>

        <span className="w-12 text-center text-base font-medium text-gray-800">
          {cartItem.quantity}
        </span>

        <button
          type="button"
          disabled={isPending}
          onClick={() => {
            startTransition(async () => {
              await incrementItem(cartItem.id);
            });
          }}
          className="p-3 text-gray-600 hover:text-gray-800 disabled:opacity-50"
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
      className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
    >
      {isPending ? "Adding..." : "Add to cart"}
    </button>
  );
}