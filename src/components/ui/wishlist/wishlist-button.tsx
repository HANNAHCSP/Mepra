// src/components/ui/wishlist/wishlist-button.tsx
'use client';

import { useTransition } from 'react';
import { Heart } from 'lucide-react';
import { toast } from 'sonner';
import { toggleWishlistItem } from '@/app/actions/wishlist';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface WishlistButtonProps {
  productId: string;
  initialIsWished: boolean;
}

export default function WishlistButton({ productId, initialIsWished }: WishlistButtonProps) {
  const [isPending, startTransition] = useTransition();
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleToggleWishlist = () => {
    if (status === 'unauthenticated') {
      router.push(`/signin?callbackUrl=${window.location.pathname}`);
      return;
    }
    
    startTransition(async () => {
      try {
        const result = await toggleWishlistItem(productId);
        if (result.added) {
          toast.success(result.message);
        } else if (result.removed) {
          toast.info(result.message);
        }
      } catch (error) {
        toast.error('Something went wrong. Please try again.');
      }
    });
  };

  return (
    <button
      onClick={handleToggleWishlist}
      disabled={isPending || status === 'loading'}
      className="flex items-center justify-center gap-2 rounded-md border p-3 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
      aria-label={initialIsWished ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart className={cn('h-5 w-5', initialIsWished ? 'fill-red-500 text-red-500' : 'text-gray-400')} />
      <span>{initialIsWished ? 'In Wishlist' : 'Add to Wishlist'}</span>
    </button>
  );
}