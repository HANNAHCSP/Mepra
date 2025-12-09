"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AddressForm } from "@/components/ui/account/address-form";
import { X, Pencil, Plus } from "lucide-react";
import type { Address } from "@prisma/client";

interface AddressModalProps {
  address?: Address; // If present, we are editing. If null, we are creating.
  trigger?: React.ReactNode; // Custom button to open modal
}

export function AddressModal({ address, trigger }: AddressModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Close modal when form submits successfully (we'll pass this handler down)
  const handleSuccess = () => {
    setIsOpen(false);
  };

  return (
    <>
      <div onClick={() => setIsOpen(true)}>
        {trigger || (
          <Button variant="outline" className="w-full gap-2">
            <Plus className="w-4 h-4" /> Add New Address
          </Button>
        )}
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-lg bg-card rounded-xl border border-border shadow-xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">
                {address ? "Edit Address" : "Add New Address"}
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <AddressForm address={address} onSuccess={handleSuccess} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
