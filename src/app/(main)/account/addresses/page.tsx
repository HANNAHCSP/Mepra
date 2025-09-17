import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { AddressCard } from '@/components/ui/account/address-card';
import { AddressForm } from '@/components/ui/account/address-form';


export default async function AddressesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect('/signin');
  }

  const addresses = await prisma.address.findMany({
    where: { userId: session.user.id },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Manage Addresses</h1>
        <p className="text-gray-500 mt-1">
          Add, edit, or remove your saved shipping addresses.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {addresses.length > 0 ? (
            addresses.map((address) => (
              <AddressCard key={address.id} address={address} />
            ))
          ) : (
            <div className="p-6 text-center border rounded-lg bg-gray-50">
              <p className="text-gray-600">You have no saved addresses.</p>
            </div>
          )}
        </div>
        <div className="lg:col-span-1">
          <AddressForm />
        </div>
      </div>
    </div>
  );
}