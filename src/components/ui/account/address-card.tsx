// src/components/ui/account/address-card.tsx
"use client";

import { Address } from "@prisma/client";
import { Trash2 } from "lucide-react";
import { useTransition } from "react";
import { deleteAddress } from "@/app/actions/account";
import { toast } from "sonner";

export function AddressCard({ address }: { address: Address }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteAddress(address.id);
        toast.success("Address deleted successfully.");
      } catch (error) {
        toast.error("Failed to delete address.");
      }
    });
  };

  return (
    <div className="border-2 rounded-lg p-6 flex justify-between items-start bg-card hover:shadow-md transition-all duration-200">
      <div className="text-sm text-foreground">
        <p className="font-semibold text-base mb-1">{address.street}</p>
        <p className="text-muted-foreground">
          {address.city}, {address.state} {address.zipCode}
        </p>
        <p className="text-muted-foreground">{address.country}</p>
      </div>
      <button
        onClick={handleDelete}
        disabled={isPending}
        className="text-muted-foreground hover:text-burgundy disabled:opacity-50 transition-colors duration-200 tap-target"
        aria-label="Delete address"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
}
