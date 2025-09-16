// src/app/(main)/checkout/address/page.tsx
'use client'

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { z } from 'zod';

import { saveShippingAddress } from '@/app/actions/checkout';
import { ShippingAddressSchema } from '@/lib/zod-schemas';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type FormData = z.infer<typeof ShippingAddressSchema>;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? 'Saving...' : 'Continue to Shipping'}
    </Button>
  );
}

export default function AddressPage() {
  const [state, formAction] = useActionState(saveShippingAddress, {
    message: '',
    success: false,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(ShippingAddressSchema),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      address: '',
      apartment: '',
      city: '',
      country: 'Egypt', // Default value
      zipCode: '',
      phone: '',
    },
  });

  useEffect(() => {
    if (!state.success && state.message) {
      toast.error(state.message);
    }
  }, [state]);


  return (
    <div>
      <nav aria-label="Breadcrumb">
        <ol role="list" className="flex items-center space-x-2 text-sm">
          <li><span className="font-medium text-indigo-600">Address</span></li>
          <li><ChevronRight className="h-5 w-5 text-gray-300" /></li>
          <li><span className="text-gray-500">Shipping</span></li>
          <li><ChevronRight className="h-5 w-5 text-gray-300" /></li>
          <li><span className="text-gray-500">Payment</span></li>
        </ol>
      </nav>

      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900">Contact Information</h2>
        {/* The form now wraps the entire content to be submitted */}
        <form action={formAction} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <Input id="email" type="email" {...register('email')} />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
             {/* Display server-side errors */}
            {state.errors?.email && <p className="mt-1 text-sm text-red-600">{state.errors.email[0]}</p>}
          </div>

          <h2 className="text-lg font-medium text-gray-900 pt-4">Shipping Address</h2>
          <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
              <Input id="firstName" type="text" {...register('firstName')} />
              {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>}
              {state.errors?.firstName && <p className="mt-1 text-sm text-red-600">{state.errors.firstName[0]}</p>}
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
              <Input id="lastName" type="text" {...register('lastName')} />
              {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>}
               {state.errors?.lastName && <p className="mt-1 text-sm text-red-600">{state.errors.lastName[0]}</p>}
            </div>
          </div>
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
            <Input id="address" type="text" {...register('address')} />
            {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>}
            {state.errors?.address && <p className="mt-1 text-sm text-red-600">{state.errors.address[0]}</p>}
          </div>
          <div>
            <label htmlFor="apartment" className="block text-sm font-medium text-gray-700">Apartment, suite, etc. (optional)</label>
            <Input id="apartment" type="text" {...register('apartment')} />
          </div>
          <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
             <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                <Input id="city" type="text" {...register('city')} />
                {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>}
                {state.errors?.city && <p className="mt-1 text-sm text-red-600">{state.errors.city[0]}</p>}
            </div>
            <div>
                <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">ZIP Code</label>
                <Input id="zipCode" type="text" {...register('zipCode')} />
                {errors.zipCode && <p className="mt-1 text-sm text-red-600">{errors.zipCode.message}</p>}
                {state.errors?.zipCode && <p className="mt-1 text-sm text-red-600">{state.errors.zipCode[0]}</p>}
            </div>
          </div>
           <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
            <Input id="country" type="text" {...register('country')} />
            {errors.country && <p className="mt-1 text-sm text-red-600">{errors.country.message}</p>}
            {state.errors?.country && <p className="mt-1 text-sm text-red-600">{state.errors.country[0]}</p>}
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone (optional)</label>
            <Input id="phone" type="tel" {...register('phone')} />
          </div>
          <div className="pt-6">
            <SubmitButton />
          </div>
        </form>
      </div>
    </div>
  );
}