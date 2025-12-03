'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { Truck, Zap, Loader2 } from 'lucide-react';
import { ShippingRate } from '@/lib/shipping-rates';
import { updateShippingMethod, saveShippingMethodAndContinue } from '@/app/actions/checkout';

interface ShippingFormProps {
  options: ShippingRate[];
  currentMethod: string;
}

export default function ShippingForm({ options, currentMethod }: ShippingFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Handle radio button change (Instant Update)
  const handleMethodChange = (methodId: string) => {
    startTransition(async () => {
      // 1. Save cookie on server
      await updateShippingMethod(methodId);
      // 2. Refresh the page data (updates Order Summary)
      router.refresh(); 
    });
  };

  return (
    <form action={saveShippingMethodAndContinue}>
      <div className="mt-4 space-y-4">
        {options.map((option) => (
          <label
            key={option.id}
            className={`relative flex cursor-pointer rounded-lg border p-4 shadow-sm focus:outline-none transition-all ${
              currentMethod === option.id
                ? 'border-primary ring-1 ring-primary bg-primary/5'
                : 'border-border bg-white hover:border-primary/50'
            }`}
          >
            <input
              type="radio"
              name="methodId"
              value={option.id}
              checked={currentMethod === option.id}
              onChange={() => handleMethodChange(option.id)}
              className="sr-only"
            />
            <span className="flex flex-1">
              <span className="flex flex-col">
                <span className="block text-sm font-medium text-foreground flex items-center gap-2">
                  {option.id === 'express' ? (
                    <Zap className="h-4 w-4 text-secondary" />
                  ) : (
                    <Truck className="h-4 w-4 text-muted-foreground" />
                  )}
                  {option.name}
                </span>
                <span className="mt-1 flex items-center text-sm text-muted-foreground">
                  {option.description}
                </span>
              </span>
            </span>
            <span className="mt-0 text-sm font-medium text-foreground">
              ${(option.priceCents / 100).toFixed(2)}
            </span>
            
            {/* Loading Indicator for specific option */}
            {isPending && currentMethod === option.id && (
                <div className="absolute right-2 top-2">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                </div>
            )}
          </label>
        ))}
      </div>

      <div className="mt-10 border-t border-border pt-6">
        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-md border border-transparent bg-primary px-4 py-3 text-base font-medium text-primary-foreground shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 flex justify-center disabled:opacity-50"
        >
          {isPending ? 'Updating...' : 'Continue to Payment'}
        </button>
      </div>
    </form>
  );
}