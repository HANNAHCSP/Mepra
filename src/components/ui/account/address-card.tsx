"use client";

import { Address } from "@prisma/client";
import { Trash2, Pencil } from "lucide-react";
import { useTransition } from "react";
import { deleteAddress } from "@/app/actions/account";
import { toast } from "sonner";
import { AddressModal } from "./address-modal";

export function AddressCard({ address }: { address: Address }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm("Are you sure you want to delete this address?")) return;

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
    <div className="group border border-border rounded-xl p-6 flex justify-between items-start bg-card hover:border-primary/20 transition-all duration-200">
      <div className="text-sm text-foreground">
        {address.isDefault && (
          <span className="inline-block mb-2 text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
            Default
          </span>
        )}
        <p className="font-semibold text-base mb-1">{address.street}</p>
        <p className="text-muted-foreground">
          {address.city}, {address.state}
        </p>
        <p className="text-muted-foreground">
          {address.zipCode}, {address.country}
        </p>
      </div>

      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <AddressModal
          address={address}
          trigger={
            <button
              className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors"
              title="Edit"
            >
              <Pencil size={16} />
            </button>
          }
        />

        <button
          onClick={handleDelete}
          disabled={isPending}
          className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors disabled:opacity-50"
          title="Delete"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
