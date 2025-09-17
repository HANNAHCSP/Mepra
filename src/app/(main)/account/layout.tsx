// src/app/(main)/account/layout.tsx
import { ReactNode } from 'react';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import LogoutButton from '@/components/ui/logout-button';

export default async function AccountLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/signin');
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="md:col-span-1">
          <nav className="flex flex-col space-y-1">
            <Link
              href="/account"
              className="px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-100 transition-colors"
            >
              Account Overview
            </Link>
            <Link
              href="/account/orders"
              className="px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-100 transition-colors"
            >
              Order History
            </Link>
             <Link
              href="/account/addresses"
              className="px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-100 transition-colors"
            >
              Manage Addresses
            </Link>
             <Link
              href="/account/profile"
              className="px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-100 transition-colors"
            >
              Profile
            </Link>
          </nav>
          <div className="mt-6 px-2">
            <LogoutButton variant="secondary" size="sm" className="w-full" />
          </div>
        </aside>
        <main className="md:col-span-3">{children}</main>
      </div>
    </div>
  );
}