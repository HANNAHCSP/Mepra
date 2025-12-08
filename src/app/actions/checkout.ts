"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ShippingAddressSchema, type ShippingAddressFormState } from "@/lib/zod-schemas";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { revalidatePath } from "next/cache";

// --- EXISTING ADDRESS ACTIONS ---

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

  const session = await getServerSession(authOptions);

  try {
    // 1. If user is logged in, save/update this address in the DB
    if (session?.user?.id) {
      // Check if this specific address already exists to avoid duplicates
      // (Optional: simplified check matching street + zip)
      const existingAddress = await prisma.address.findFirst({
        where: {
          userId: session.user.id,
          street: parsed.data.address,
          zipCode: parsed.data.zipCode,
        },
      });

      if (!existingAddress) {
        await prisma.address.create({
          data: {
            userId: session.user.id,
            street: parsed.data.address,
            city: parsed.data.city,
            state: parsed.data.state,
            zipCode: parsed.data.zipCode,
            country: parsed.data.country,
            // You can add logic to set isDefault if it's their first address
            isDefault: (await prisma.address.count({ where: { userId: session.user.id } })) === 0,
          },
        });
      }
    }

    // 2. Save to Cookie (Required for the current checkout flow)
    const addressJson = JSON.stringify(parsed.data);
    (await cookies()).set("shippingAddress", addressJson, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
  } catch (error) {
    console.error("Failed to save address:", error);
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

  // Construct the payload expected by the checkout cookie
  const shippingAddressPayload = {
    email: session.user.email,
    firstName: session.user.name?.split(" ")[0] || "",
    lastName: session.user.name?.split(" ").slice(1).join(" ") || "",
    address: address.street,
    city: address.city,
    state: address.state,
    zipCode: address.zipCode,
    country: address.country,
    // Add default values for optional fields if needed
    phone: "",
    apartment: "",
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

export async function updateShippingMethod(methodId: string) {
  const parsed = ShippingMethodSchema.safeParse({ methodId });

  if (parsed.success) {
    (await cookies()).set("shippingMethod", parsed.data.methodId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
    revalidatePath("/checkout");
  }
}

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
