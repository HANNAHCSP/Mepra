"use client";

import { useState, useActionState, useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import type { Address } from "@prisma/client";
import { ChevronRight, PlusCircle } from "lucide-react";
import { saveShippingAddress, selectSavedAddress } from "@/app/actions/checkout";
import { ShippingAddressSchema } from "@/lib/zod-schemas";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";
import { GOVERNORATES } from "@/lib/shipping-rates"; // Import Governorates

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
    defaultValues: {
      email: userEmail || "",
      country: "Egypt",
      state: "Cairo", // Default value
    },
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
                className="border rounded-lg p-4 flex justify-between items-center hover:border-primary/30 transition-colors"
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
                className="text-sm text-secondary hover:underline mb-4"
              >
                &larr; Back to saved addresses
              </button>
            )}

            <h2 className="text-lg font-medium text-foreground pt-4">Contact Information</h2>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground">
                Email
              </label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                readOnly={!!userEmail}
                className={userEmail ? "bg-muted/30" : ""}
              />
              {(errors.email || state.errors?.email) && (
                <p className="mt-1 text-sm text-burgundy">
                  {errors.email?.message || state.errors?.email?.[0]}
                </p>
              )}
            </div>

            <h2 className="text-lg font-medium text-foreground pt-4">Shipping Address</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-foreground">
                  First Name
                </label>
                <Input id="firstName" {...register("firstName")} />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-burgundy">{errors.firstName.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-foreground">
                  Last Name
                </label>
                <Input id="lastName" {...register("lastName")} />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-burgundy">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-foreground">
                Address
              </label>
              <Input id="address" {...register("address")} />
              {errors.address && (
                <p className="mt-1 text-sm text-burgundy">{errors.address.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="apartment" className="block text-sm font-medium text-foreground">
                Apartment (optional)
              </label>
              <Input id="apartment" {...register("apartment")} />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-foreground">
                  City
                </label>
                <Input id="city" {...register("city")} />
                {errors.city && <p className="mt-1 text-sm text-burgundy">{errors.city.message}</p>}
              </div>

              {/* --- CHANGED: Dropdown for Governorate --- */}
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-foreground">
                  Governorate
                </label>
                <div className="relative">
                  <select
                    id="state"
                    {...register("state")}
                    className="flex h-12 w-full rounded-md border-2 border-input bg-white px-4 py-3 text-sm text-foreground transition-colors focus-visible:outline-none focus-visible:border-secondary focus-visible:ring-4 focus-visible:ring-secondary/10 disabled:cursor-not-allowed disabled:bg-muted/30 disabled:opacity-60 appearance-none"
                  >
                    {GOVERNORATES.map((gov) => (
                      <option key={gov} value={gov}>
                        {gov}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-muted-foreground">
                    <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </div>
                </div>
                {errors.state && (
                  <p className="mt-1 text-sm text-burgundy">{errors.state.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="zipCode" className="block text-sm font-medium text-foreground">
                  ZIP Code
                </label>
                <Input id="zipCode" {...register("zipCode")} />
                {errors.zipCode && (
                  <p className="mt-1 text-sm text-burgundy">{errors.zipCode.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-foreground">
                  Country
                </label>
                <Input id="country" {...register("country")} readOnly className="bg-muted/30" />
                {errors.country && (
                  <p className="mt-1 text-sm text-burgundy">{errors.country.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-foreground">
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
