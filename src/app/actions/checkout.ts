// src/app/actions/checkout.ts
'use server'

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ShippingAddressSchema, type ShippingAddressFormState } from '@/lib/zod-schemas';

// Server action to save the shipping address to a cookie
export async function saveShippingAddress(
  prevState: ShippingAddressFormState,
  formData: FormData
): Promise<ShippingAddressFormState> {
  const parsed = ShippingAddressSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!parsed.success) {
    return {
      message: "Invalid form data.",
      errors: parsed.error.flatten().fieldErrors,
      success: false,
    };
  }

  try {
    const addressJson = JSON.stringify(parsed.data);
   (await cookies()).set('shippingAddress', addressJson, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
  } catch (error) {
    return {
      message: "Failed to save address. Please try again.",
      success: false,
    };
  }

  redirect('/checkout/shipping');
}

