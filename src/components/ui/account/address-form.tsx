"use client";

import { useActionState, useEffect } from "react"; // Changed useFormStatus to useActionState hook pattern
import { useFormStatus } from "react-dom";
import { saveAddress } from "@/app/actions/account";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import type { Address } from "@prisma/client";

function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : isEditing ? (
        "Update Address"
      ) : (
        "Save Address"
      )}
    </Button>
  );
}

// Update props to accept address data
export function AddressForm({ address, onSuccess }: { address?: Address; onSuccess?: () => void }) {
  // Note: We need to wrap the server action to handle the toast in the component
  const handleSubmit = async (formData: FormData) => {
    const result = await saveAddress(formData);

    if (result.success) {
      toast.success(result.message);
      if (onSuccess) onSuccess();
    } else {
      toast.error(result.message);
    }
  };

  return (
    <form action={handleSubmit} className="space-y-4">
      {/* Hidden ID field for updates */}
      {address && <input type="hidden" name="addressId" value={address.id} />}

      <div>
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Street
        </label>
        <Input name="street" defaultValue={address?.street} placeholder="123 Main St" required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            City
          </label>
          <Input name="city" defaultValue={address?.city} placeholder="Cairo" required />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            State
          </label>
          <Input name="state" defaultValue={address?.state} placeholder="Cairo" required />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Zip Code
          </label>
          <Input name="zipCode" defaultValue={address?.zipCode} placeholder="11511" required />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Country
          </label>
          <Input name="country" defaultValue={address?.country} placeholder="Egypt" required />
        </div>
      </div>

      <div className="pt-2">
        <SubmitButton isEditing={!!address} />
      </div>
    </form>
  );
}
