"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

const AddressSchema = z.object({
  street: z.string().trim().min(1, "Street is required"),
  city: z.string().trim().min(1, "City is required"),
  state: z.string().trim().min(1, "State/Province is required"),
  zipCode: z.string().trim().min(1, "ZIP/Postal code is required"),
  country: z.string().trim().min(1, "Country is required"),
  isDefault: z.coerce.boolean().optional(),
  addressId: z.string().optional(),
});

export async function saveAddress(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, message: "You must be logged in." };
  }

  const parsed = AddressSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!parsed.success) {
    return { success: false, message: "Invalid address data." };
  }

  const { addressId, ...data } = parsed.data;

  try {
    if (addressId) {
      // Update existing
      await prisma.address.update({
        where: { id: addressId, userId: session.user.id }, // Security check
        data,
      });
    } else {
      // Create new
      await prisma.address.create({
        data: {
          ...data,
          userId: session.user.id,
        },
      });
    }

    revalidatePath("/account/addresses");
    // Also revalidate checkout incase user is editing from there
    revalidatePath("/checkout/address");

    return { success: true, message: "Address saved successfully." };
  } catch (error) {
    console.error("Address Error:", error);
    return { success: false, message: "Failed to save address." };
  }
}

export async function deleteAddress(addressId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  await prisma.address.delete({
    where: {
      id: addressId,
      userId: session.user.id,
    },
  });

  revalidatePath("/account/addresses");
}
