"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ShippingAddressSchema, type ShippingAddressFormState } from "@/lib/zod-schemas";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { revalidatePath } from "next/cache";

// --- EXISTING ADDRESS ACTIONS (Keep these) ---

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
    (await cookies()).set("shippingAddress", addressJson, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
  } catch (error) {
    return {
      message: "Failed to save address. Please try again.",
      success: false,
    };
  }

  redirect("/checkout/shipping");
}

export async function selectSavedAddress(addressId: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("You must be logged in to perform this action.");
  }

  const address = await prisma.address.findFirst({
    where: {
      id: addressId,
      userId: session.user.id,
    },
  });

  if (!address) {
    throw new Error("Address not found or you do not have permission to use it.");
  }

  const shippingAddressPayload = {
    email: session.user.email,
    firstName: session.user.name?.split(" ")[0] || "",
    lastName: session.user.name?.split(" ").slice(1).join(" ") || "",
    address: address.street,
    city: address.city,
    state: address.state,
    zipCode: address.zipCode,
    country: address.country,
  };

  try {
    const addressJson = JSON.stringify(shippingAddressPayload);
    (await cookies()).set("shippingAddress", addressJson, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
  } catch (error) {
    console.error("Failed to set shipping address cookie:", error);
    throw new Error("Could not process the selected address.");
  }

  redirect("/checkout/shipping");
}

// --- UPDATED SHIPPING METHOD ACTIONS ---

const ShippingMethodSchema = z.object({
  methodId: z.enum(["standard", "express"]),
});

// 1. Action for "Clicking" the radio button (Updates UI without redirect)
export async function updateShippingMethod(methodId: string) {
  const parsed = ShippingMethodSchema.safeParse({ methodId });

  if (parsed.success) {
    (await cookies()).set("shippingMethod", parsed.data.methodId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
    // This tells the Layout to re-fetch cookies and update the Summary price
    revalidatePath("/checkout");
  }
}

// 2. Action for "Continue" button (Redirects to next step)
export async function saveShippingMethodAndContinue(formData: FormData) {
  const parsed = ShippingMethodSchema.safeParse({
    methodId: formData.get("methodId"),
  });

  if (!parsed.success) {
    throw new Error("Invalid shipping method selected.");
  }

  (await cookies()).set("shippingMethod", parsed.data.methodId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  redirect("/checkout/payment");
}
