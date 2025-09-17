'use client';

import { useFormStatus } from 'react-dom';
import { saveAddress } from '@/app/actions/account';
import { toast } from 'sonner';
import { useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? 'Saving...' : 'Save Address'}
    </Button>
  );
}

export function AddressForm() {
  const formRef = useRef<HTMLFormElement>(null);

  const handleAction = async (formData: FormData) => {
    try {
      await saveAddress(formData);
      toast.success('Address saved successfully!');
      formRef.current?.reset();
    } catch (error) {
      toast.error('Failed to save address. Please check your input.');
    }
  };

  return (
    <form ref={formRef} action={handleAction} className="space-y-4 p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold">Add New Address</h3>
      <div>
        <Input name="street" placeholder="Street Address" required />
      </div>
      <div>
        <Input name="city" placeholder="City" required />
      </div>
       <div>
        <Input name="state" placeholder="State / Province" required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input name="zipCode" placeholder="ZIP / Postal Code" required />
        <Input name="country" placeholder="Country" required />
      </div>
      <SubmitButton />
    </form>
  );
}