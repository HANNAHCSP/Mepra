// src/components/ui/wishlist/wishlist-nav-button.tsx
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function WishlistNavButton() {
  const session = await getServerSession(authOptions);
  
  let itemCount = 0;
  if (session?.user?.id) {
    itemCount = await prisma.wishlistItem.count({
      where: { wishlist: { userId: session.user.id } },
    });
  }

  return (
    <Link
      href="/wishlist"
      className="inline-flex items-center gap-2 text-gray-700 hover:text-amber-500"
    >
      <Heart size={16} />
      <span className="uppercase">My Wishlist</span>
      {itemCount > 0 && (
        <span className="ml-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
          {itemCount}
        </span>
      )}
    </Link>
  );
}