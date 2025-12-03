// src/components/ui/checkout/address-selection.tsx
"use client";

import { useState, useActionState, useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import type { Address } from "@prisma/client";
import { ChevronRight, PlusCircle, Home } from "lucide-react";
import { saveShippingAddress, selectSavedAddress } from "@/app/actions/checkout";
import { ShippingAddressSchema } from "@/lib/zod-schemas";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";

type FormData = z.infer<typeof ShippingAddressSchema>;

function SubmitButton({ text }: { text: string }) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
    >
      {pending ? "Saving..." : text}
    </Button>
  );
}

interface AddressSelectionProps {
  savedAddresses: Address[];
  userEmail?: string | null;
}

export default function AddressSelection({ savedAddresses, userEmail }: AddressSelectionProps) {
  // 'list' shows saved addresses, 'form' shows the form to add a new one.
  const [view, setView] = useState(savedAddresses.length > 0 ? "list" : "form");
  const [isPending, startTransition] = useTransition();

  const [state, formAction] = useActionState(saveShippingAddress, {
    message: "",
    success: false,
  });

  const {
    register,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(ShippingAddressSchema),
    defaultValues: { email: userEmail || "" },
  });

  useEffect(() => {
    if (!state.success && state.message) {
      toast.error(state.message);
    }
  }, [state]);

  const handleSelectAddress = (addressId: string) => {
    startTransition(async () => {
      await selectSavedAddress(addressId);
    });
  };

  return (
    <div>
      <nav aria-label="Breadcrumb">
        <ol role="list" className="flex items-center space-x-2 text-sm">
          <li>
            <span className="font-medium text-primary">Address</span>
          </li>
          <li>
            <ChevronRight className="h-5 w-5 text-gray-300" />
          </li>
          <li>
            <span className="text-gray-500">Shipping</span>
          </li>
          <li>
            <ChevronRight className="h-5 w-5 text-gray-300" />
          </li>
          <li>
            <span className="text-gray-500">Payment</span>
          </li>
        </ol>
      </nav>

      <div className="mt-8">
        {view === "list" && (
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-gray-900">Select a Shipping Address</h2>
            {savedAddresses.map((address) => (
              <div
                key={address.id}
                className="border rounded-lg p-4 flex justify-between items-center"
              >
                <div className="text-sm">
                  <p className="font-medium">{address.street}</p>
                  <p>
                    {address.city}, {address.state} {address.zipCode}
                  </p>
                </div>
                <Button
                  onClick={() => handleSelectAddress(address.id)}
                  disabled={isPending}
                  size="sm"
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {isPending ? "Selecting..." : "Use Address"}
                </Button>
              </div>
            ))}
            <Button variant="outline" onClick={() => setView("form")} className="w-full">
              <PlusCircle className="mr-2 h-4 w-4" /> Add a new address
            </Button>
          </div>
        )}

        {view === "form" && (
          <form action={formAction} className="space-y-4">
            {savedAddresses.length > 0 && (
              <button
                type="button"
                onClick={() => setView("list")}
                className="text-sm text-indigo-600 hover:underline mb-4"
              >
                &larr; Back to saved addresses
              </button>
            )}
            <h2 className="text-lg font-medium text-gray-900">Contact Information</h2>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                readOnly={!!userEmail}
                className={userEmail ? "bg-gray-100" : ""}
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
              {state.errors?.email && (
                <p className="mt-1 text-sm text-red-600">{state.errors.email[0]}</p>
              )}
            </div>

            <h2 className="text-lg font-medium text-gray-900 pt-4">Shipping Address</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <Input id="firstName" type="text" {...register("firstName")} />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <Input id="lastName" type="text" {...register("lastName")} />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                )}
              </div>
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <Input id="address" type="text" {...register("address")} />
              {errors.address && (
                <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="apartment" className="block text-sm font-medium text-gray-700">
                Apartment, suite, etc. (optional)
              </label>
              <Input id="apartment" type="text" {...register("apartment")} />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  City
                </label>
                <Input id="city" type="text" {...register("city")} />
                {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>}
              </div>
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                  State / Province
                </label>
                <Input id="state" type="text" {...register("state")} />
                {errors.state && (
                  <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
                  ZIP Code
                </label>
                <Input id="zipCode" type="text" {...register("zipCode")} />
                {errors.zipCode && (
                  <p className="mt-1 text-sm text-red-600">{errors.zipCode.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                  Country
                </label>
                <Input id="country" type="text" {...register("country")} defaultValue="Egypt" />
                {errors.country && (
                  <p className="mt-1 text-sm text-red-600">{errors.country.message}</p>
                )}
              </div>
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone (optional)
              </label>
              <Input id="phone" type="tel" {...register("phone")} />
            </div>
            <div className="pt-6">
              <SubmitButton text="Continue to Shipping" />
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
