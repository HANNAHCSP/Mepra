// src/app/actions/profile.ts
'use server';

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { hash } from 'bcryptjs';

// Schema for updating user's name
const UpdateNameSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters.'),
});

// Schema for updating user's password
const UpdatePasswordSchema = z.object({
  newPassword: z.string().min(8, 'Password must be at least 8 characters.'),
});

type FormState = {
  success: boolean;
  message: string;
};

// Server Action to update the user's name
export async function updateNameAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, message: 'Authentication required.' };
  }

  const parsed = UpdateNameSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0].message };
  }

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { name: parsed.data.name },
    });

    revalidatePath('/account/profile');
    return { success: true, message: 'Your name has been updated successfully.' };
  } catch (error) {
    console.error('Error updating name:', error);
    return { success: false, message: 'An unexpected error occurred.' };
  }
}

// Server Action to update the user's password
export async function updatePasswordAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return { success: false, message: 'Authentication required.' };
    }

    const parsed = UpdatePasswordSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!parsed.success) {
        return { success: false, message: parsed.error.issues[0].message };
    }

    try {
        const hashedPassword = await hash(parsed.data.newPassword, 12);
        await prisma.user.update({
            where: { id: session.user.id },
            data: { password: hashedPassword },
        });

        return { success: true, message: 'Your password has been updated successfully.' };
    } catch (error) {
        console.error('Error updating password:', error);
        return { success: false, message: 'An unexpected error occurred.' };
    }
}