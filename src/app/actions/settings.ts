"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const SettingsSchema = z.object({
  storeName: z.string().min(1),
  supportEmail: z.string().email(),
  supportPhone: z.string().min(1),
  announcementBar: z.string().optional(),
  shippingThreshold: z.coerce.number().min(0),
});

export async function getStoreSettings() {
  // Try to find the settings
  let settings = await prisma.storeSettings.findUnique({
    where: { id: "default" },
  });

  // If not found (first run), create default
  if (!settings) {
    settings = await prisma.storeSettings.create({
      data: { id: "default" },
    });
  }

  return settings;
}

export async function updateStoreSettings(prevState: { success: boolean; message: string } | undefined, formData: FormData) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin") {
    return { success: false, message: "Unauthorized" };
  }

  const parsed = SettingsSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return { success: false, message: "Invalid data" };
  }

  try {
    await prisma.storeSettings.update({
      where: { id: "default" },
      data: parsed.data,
    });

    revalidatePath("/"); // Update home
    revalidatePath("/admin/settings"); // Update admin
    return { success: true, message: "Settings updated successfully" };
  } catch (error) {
    console.error("Settings Update Error:", error);
    return { success: false, message: "Failed to update settings" };
  }
}
