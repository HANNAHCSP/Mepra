'use client';

import { Address } from '@prisma/client';
import { Trash2 } from 'lucide-react';
import { useTransition } from 'react';
import { deleteAddress } from '@/app/actions/account';
import { toast } from 'sonner';

export function AddressCard({ address }: { address: Address }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteAddress(address.id);
        toast.success('Address deleted successfully.');
      } catch (error) {
        toast.error('Failed to delete address.');
      }
    });
  };

  return (
    <div className="border rounded-lg p-4 flex justify-between items-start">
      <div className="text-sm text-gray-700">
        <p className="font-medium">{address.street}</p>
        <p>{address.city}, {address.state} {address.zipCode}</p>
        <p>{address.country}</p>
      </div>
      <button
        onClick={handleDelete}
        disabled={isPending}
        className="text-gray-400 hover:text-red-600 disabled:opacity-50"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
}