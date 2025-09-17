'use server';

import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

const AddressSchema = z.object({
  street: z.string().trim().min(1, 'Street is required'),
  city: z.string().trim().min(1, 'City is required'),
  state: z.string().trim().min(1, 'State/Province is required'),
  zipCode: z.string().trim().min(1, 'ZIP/Postal code is required'),
  country: z.string().trim().min(1, 'Country is required'),
  isDefault: z.coerce.boolean().optional(),
  addressId: z.string().optional(), // For updates
});

export async function saveAddress(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error('You must be logged in to save an address.');
  }

  const parsed = AddressSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!parsed.success) {
    // In a real app, you would return a structured error object
    throw new Error('Invalid address data.');
  }

  const { addressId, ...data } = parsed.data;

  if (addressId) {
    // Update existing address
    await prisma.address.update({
      where: { id: addressId, userId: session.user.id }, // Security check
      data,
    });
  } else {
    // Create new address
    await prisma.address.create({
      data: {
        ...data,
        userId: session.user.id,
      },
    });
  }

  revalidatePath('/account/addresses');
}

export async function deleteAddress(addressId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error('You must be logged in to delete an address.');
  }
  
  await prisma.address.delete({
    where: {
      id: addressId,
      userId: session.user.id, // Security check
    },
  });

  revalidatePath('/account/addresses');
}