// src/app/actions/checkout.ts
'use server'

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ShippingAddressSchema, type ShippingAddressFormState } from '@/lib/zod-schemas';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// This action handles the form for NEW addresses
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
      path: '/',
    });
  } catch (error) {
    return {
      message: "Failed to save address. Please try again.",
      success: false,
    };
  }

  redirect('/checkout/shipping');
}

// This NEW action handles selecting an EXISTING address
export async function selectSavedAddress(addressId: string) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        throw new Error('You must be logged in to perform this action.');
    }

    const address = await prisma.address.findFirst({
        where: {
            id: addressId,
            userId: session.user.id, // Security check
        },
    });

    if (!address) {
        throw new Error('Address not found or you do not have permission to use it.');
    }
    
    // Create an object that matches the ShippingAddressSchema structure
    const shippingAddressPayload = {
        email: session.user.email,
        firstName: session.user.name?.split(' ')[0] || '',
        lastName: session.user.name?.split(' ').slice(1).join(' ') || '',
        address: address.street,
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
        country: address.country,
        // Optional fields can be omitted if not present
    };

    try {
        const addressJson = JSON.stringify(shippingAddressPayload);
        (await cookies()).set('shippingAddress', addressJson, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
        });
    } catch (error) {
        // Handle potential errors, though stringify is unlikely to fail here
        console.error("Failed to set shipping address cookie:", error);
        throw new Error('Could not process the selected address.');
    }

    redirect('/checkout/shipping');
}