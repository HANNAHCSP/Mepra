// src/app/actions/auth.ts
'use server';
import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';
import { z } from 'zod';
import { ShippingAddressSchema } from '@/lib/zod-schemas';

const CreateAccountSchema = z.object({
  name: z.string().trim().min(2, { message: 'Name must be at least 2 characters.' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
  orderId: z.string().cuid(),
});

type FormState = {
  success: boolean;
  message: string;
  errors?: {
    name?: string[];
    password?: string[];
    orderId?: string[];
    _form?: string[];
  };
};

export async function createAccountFromGuestOrder(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const parsed = CreateAccountSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!parsed.success) {
    return {
      success: false,
      message: 'Invalid form data.',
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { name, password, orderId } = parsed.data;

  try {
    const order = await prisma.order.findUnique({ where: { id: orderId } });

    if (!order || order.userId) {
      return { success: false, message: 'This order is not a guest order or does not exist.' };
    }

    const customerEmail = order.customerEmail;
    const existingUser = await prisma.user.findUnique({ where: { email: customerEmail } });

    if (existingUser) {
      return {
        success: false,
        message: 'An account with this email already exists. Please sign in.',
      };
    }

    const hashedPassword = await hash(password, 12);
    const shippingAddress = ShippingAddressSchema.parse(order.shippingAddress);

    await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          name,
          email: customerEmail,
          password: hashedPassword,
        },
      });

      // Link all past guest orders with this email to the new user.
      await tx.order.updateMany({
        where: {
          customerEmail: customerEmail,
          userId: null,
        },
        data: {
          userId: newUser.id,
        },
      });
      
      // Save the shipping address from the order to the user's profile
      await tx.address.create({
        data: {
          userId: newUser.id,
          street: shippingAddress.address,
          city: shippingAddress.city,
          state: shippingAddress.state,
          zipCode: shippingAddress.zipCode,
          country: shippingAddress.country,
          isDefault: true,
        }
      });
    });
    
    return { success: true, message: 'Account created successfully! Signing you in...' };

  } catch (error) {
    console.error('Error creating account from guest order:', error);
    return { success: false, message: 'An internal error occurred. Please try again.' };
  }
}