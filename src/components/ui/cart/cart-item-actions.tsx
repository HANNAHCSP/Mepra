'use client'

import { useTransition } from "react";
import { removeItem, incrementItem, decrementItem } from "@/app/actions/cart";
import { Prisma } from "@prisma/client";
import { X, Plus, Minus } from "lucide-react";

type CartItemWithProduct = Prisma.CartItemGetPayload<{
  include: { variant: { include: { product: true } } };
}>;

export default function CartItemActions({ item }: { item: CartItemWithProduct }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center rounded-md border border-gray-300">
        <button
          type="button"
          disabled={isPending}
          onClick={() => {
            startTransition(async () => {
              await decrementItem(item.id);
            });
          }}
          className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
        >
          <span className="sr-only">Decrement quantity</span>
          <Minus className="h-4 w-4" />
        </button>

        <span className="w-10 text-center text-sm font-medium text-gray-700">
          {item.quantity}
        </span>

        <button
          type="button"
          disabled={isPending}
          onClick={() => {
            startTransition(async () => {
              await incrementItem(item.id);
            });
          }}
          className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
        >
          <span className="sr-only">Increment quantity</span>
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
          className="-m-2 inline-flex p-2 text-gray-400 hover:text-gray-500"
        >
          <span className="sr-only">Remove</span>
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}