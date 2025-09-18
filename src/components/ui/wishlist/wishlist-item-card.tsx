// src/components/ui/wishlist/wishlist-item-card.tsx
'use client';

import { useTransition } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';
import { X, ShoppingCart } from 'lucide-react';
import { addItem } from '@/app/actions/cart';
import { toggleWishlistItem } from '@/app/actions/wishlist';
import type { Prisma } from '@prisma/client';

// Define a precise type for the product data passed to this component
type WishlistProduct = Prisma.ProductGetPayload<{
  include: {
    variants: {
      orderBy: { price: 'asc' },
      take: 1
    }
  }
}>

export default function WishlistItemCard({ product }: { product: WishlistProduct }) {
  const [isPending, startTransition] = useTransition();
  const defaultVariant = product.variants[0];

  const handleAddToCart = () => {
    if (!defaultVariant) {
      toast.error('This product is currently unavailable.');
      return;
    }
    startTransition(async () => {
      try {
        await addItem(defaultVariant.id);
        toast.success(`${product.name} added to cart.`);
      } catch (e) {
        toast.error('Failed to add item to cart.');
      }
    });
  };

  const handleRemove = () => {
    startTransition(async () => {
      try {
        await toggleWishlistItem(product.id);
        toast.info(`${product.name} removed from wishlist.`);
      } catch (e) {
        toast.error('Failed to remove item.');
      }
    });
  };

  return (
    <div className="group relative flex flex-col rounded-lg border bg-white shadow-sm overflow-hidden">
      <div className="absolute top-2 right-2 z-10">
        <button
          onClick={handleRemove}
          disabled={isPending}
          className="p-1.5 bg-white/60 backdrop-blur-sm rounded-full text-gray-500 hover:text-gray-800 hover:bg-white disabled:opacity-50"
          aria-label="Remove from wishlist"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <Link href={`/products/${product.handle}`} className="block">
        <div className="aspect-square w-full bg-gray-200 group-hover:opacity-75">
          <Image
            src={product.imageUrl || '/placeholder.svg'}
            alt={product.name}
            width={400}
            height={400}
            className="h-full w-full object-cover object-center"
          />
        </div>
      </Link>
      
      <div className="flex flex-1 flex-col p-4 space-y-2">
        <h3 className="text-sm font-medium text-gray-900">
          <Link href={`/products/${product.handle}`}>
            {product.name}
          </Link>
        </h3>
        <p className="text-sm text-gray-500">
          {defaultVariant.stock > 0 ? 'In Stock' : 'Out of Stock'}
        </p>
        <div className="flex flex-1 items-end justify-between">
          <p className="text-base font-medium text-gray-900">
            ${(defaultVariant.price / 100).toFixed(2)}
          </p>
        </div>
      </div>

      <button
        onClick={handleAddToCart}
        disabled={isPending || defaultVariant.stock === 0}
        className="flex items-center justify-center gap-2 w-full bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ShoppingCart className="h-4 w-4" />
        {isPending ? 'Adding...' : 'Add to cart'}
      </button>
    </div>
  );
}