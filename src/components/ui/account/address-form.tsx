"use client";

import { useFormStatus } from "react-dom";
import { saveAddress } from "@/app/actions/account";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import type { Address } from "@prisma/client";
import { GOVERNORATES } from "@/lib/shipping-rates";

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

export function AddressForm({ address, onSuccess }: { address?: Address; onSuccess?: () => void }) {
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
          Street Address
        </label>
        <Input
          name="street"
          defaultValue={address?.street}
          placeholder="123 Main Street"
          required
          className="mt-1"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            City
          </label>
          <Input
            name="city"
            defaultValue={address?.city}
            placeholder="Maadi"
            required
            className="mt-1"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Governorate
          </label>
          <select
            name="state"
            defaultValue={address?.state || ""}
            required
            className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="" disabled>
              Select governorate
            </option>
            {GOVERNORATES.map((gov) => (
              <option key={gov} value={gov}>
                {gov}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Postal Code
          </label>
          <Input
            name="zipCode"
            defaultValue={address?.zipCode}
            placeholder="11511"
            required
            className="mt-1"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Country
          </label>
          <Input
            name="country"
            defaultValue={address?.country || "Egypt"}
            placeholder="Egypt"
            required
            className="mt-1"
          />
        </div>
      </div>

      <div className="pt-2">
        <SubmitButton isEditing={!!address} />
      </div>
    </form>
  );
}
