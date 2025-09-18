// src/app/(main)/wishlist/page.tsx
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { Heart } from 'lucide-react';
import { authOptions } from '@/lib/auth';
import { getWishlist } from '@/app/actions/wishlist';
import WishlistItemCard from '@/components/ui/wishlist/wishlist-item-card';

export default async function WishlistPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/signin?callbackUrl=/wishlist');
  }

  const wishlist = await getWishlist();
  const items = wishlist?.items ?? [];

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="sm:flex sm:items-baseline sm:justify-between">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">My Wishlist</h1>
            <p className="mt-1 text-sm text-gray-500 sm:mt-0">{items.length} item{items.length !== 1 ? 's' : ''}</p>
        </div>

        <div className="mt-12">
          {items.length === 0 ? (
            <div className="text-center py-24 border-2 border-dashed rounded-lg">
              <Heart className="mx-auto h-12 w-12 text-gray-400" />
              <h2 className="mt-4 text-xl font-medium text-gray-900">Your wishlist is empty</h2>
              <p className="mt-2 text-sm text-gray-500">
                Looks like you haven&apos;t added anything yet.
              </p>
              <Link href="/products" className="mt-6 inline-block rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white hover:bg-indigo-700">
                Start Exploring
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
              {items.map(({ product }) => (
                <WishlistItemCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}