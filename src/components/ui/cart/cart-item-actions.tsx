// src/components/ui/cart/cart-item-actions.tsx
"use client";

import { useTransition } from "react";
import { removeItem, incrementItem, decrementItem } from "@/app/actions/cart";
import { Prisma } from "@prisma/client";
import { X, Plus, Minus } from "lucide-react";
import { toast } from "sonner";

type CartItemWithProduct = Prisma.CartItemGetPayload<{
  include: { variant: { include: { product: true } } };
}>;

export default function CartItemActions({ item }: { item: CartItemWithProduct }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center rounded-md border-2 border-input overflow-hidden">
        <button
          type="button"
          disabled={isPending}
          onClick={() => {
            startTransition(async () => {
              await decrementItem(item.id);
            });
          }}
          className="p-3 text-muted-foreground hover:text-foreground hover:bg-accent disabled:opacity-50 transition-all duration-200 tap-target"
          aria-label="Decrease quantity"
        >
          <Minus className="h-4 w-4" />
        </button>

        <span className="w-12 text-center text-sm font-semibold text-foreground">
          {item.quantity}
        </span>

        <button
          type="button"
          disabled={isPending}
          onClick={() => {
            startTransition(async () => {
              try {
                await incrementItem(item.id);
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
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <div className="absolute right-0 top-0">
        <button
          type="button"
          disabled={isPending}
          onClick={() => {
            startTransition(async () => {
              await removeItem(item.id);
            });
          }}
          className="-m-2 inline-flex p-2 text-muted-foreground hover:text-burgundy transition-colors duration-200 tap-target"
          aria-label="Remove item"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
