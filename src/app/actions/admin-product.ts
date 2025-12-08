"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { UTApi } from "uploadthing/server"; // <--- Import UTApi

// Initialize UploadThing API
const utapi = new UTApi();

// Schema for validation
const ProductSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().min(1, "Price must be greater than 0"),
  stock: z.coerce.number().min(0, "Stock cannot be negative"),
  category: z.string().min(1, "Category is required"),
  collection: z.string().optional(),
  imageUrl: z.string().url("Main image must be a valid URL"),
});

const UpdateProductSchema = ProductSchema.extend({
  imageUrl: z.string().optional(),
});

export async function createProductAction(
  prevState: { success: boolean; message: string; errors?: Record<string, string[]> },
  formData: FormData
) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin") {
    return { success: false, message: "Unauthorized" };
  }

  const parsed = ProductSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return { success: false, message: "Invalid data", errors: parsed.error.flatten().fieldErrors };
  }

  const { name, description, price, stock, category, collection, imageUrl } = parsed.data;

  const handle =
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "") + `-${Date.now().toString().slice(-4)}`;

  try {
    await prisma.product.create({
      data: {
        name,
        description,
        handle,
        imageUrl,
        category,
        collection,
        images: [imageUrl],
        variants: {
          create: {
            price: price * 100,
            stock,
            attributes: { size: "Standard" },
          },
        },
      },
    });

    revalidatePath("/admin/products");
    revalidatePath("/products");
  } catch (error) {
    console.error("Create Product Error:", error);
    return { success: false, message: "Failed to create product." };
  }

  redirect("/admin/products");
}

export async function updateProductAction(
  productId: string,
  prevState: { success: boolean; message: string; errors?: Record<string, string[]> },
  formData: FormData
) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin") {
    return { success: false, message: "Unauthorized" };
  }

  const rawData = Object.fromEntries(formData);
  const parsed = UpdateProductSchema.safeParse(rawData);

  if (!parsed.success) {
    return {
      success: false,
      message: "Invalid data",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { name, description, price, stock, category, collection, imageUrl } = parsed.data;

  try {
    // 1. Fetch current product to check old image
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
      select: { imageUrl: true },
    });

    // 2. If image changed (or removed), delete the old one from UploadThing
    if (existingProduct?.imageUrl && existingProduct.imageUrl !== imageUrl) {
      const fileKey = existingProduct.imageUrl.split("/").pop(); // Extract key (e.g. 'file-key.jpg') from URL
      if (fileKey) {
        await utapi.deleteFiles(fileKey);
        console.log(`Deleted old image: ${fileKey}`);
      }
    }

    // 3. Update Database
    await prisma.product.update({
      where: { id: productId },
      data: {
        name,
        description,
        imageUrl, // Can be empty string if removed
        category,
        collection,
        images: imageUrl ? [imageUrl] : [], // Update gallery
        variants: {
          updateMany: {
            where: { productId },
            data: {
              price: price * 100,
              stock,
            },
          },
        },
      },
    });

    revalidatePath("/admin/products");
    revalidatePath(`/products`);
    return { success: true, message: "Product updated successfully!" };
  } catch (error) {
    console.error("Update Product Error:", error);
    return { success: false, message: "Failed to update product." };
  }
}

// ... imports

export async function deleteProductAction(productId: string) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin") return { success: false, message: "Unauthorized" };

  try {
    // 1. Fetch product first to get image URL (needed if we hard delete)
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { imageUrl: true },
    });

    // 2. Try HARD Delete
    await prisma.product.delete({ where: { id: productId } });

    // 3. If successful (no orders existed), delete image from UploadThing
    if (product?.imageUrl) {
      const fileKey = product.imageUrl.split("/").pop();
      if (fileKey) {
        await utapi.deleteFiles(fileKey);
      }
    }

    revalidatePath("/admin/products");
    return { success: true, message: "Product permanently deleted" };
  } catch (error: unknown) {
    // 4. Handle "Foreign Key Constraint" (Orders exist)
    if (error instanceof Error && "code" in error && error.code === "P2003") {
      try {
        // Soft Delete (Archive) instead
        await prisma.product.update({
          where: { id: productId },
          data: { isArchived: true },
        });

        revalidatePath("/admin/products");
        return { success: true, message: "Product archived (it has existing orders)" };
      } catch (archiveError) {
        return { success: false, message: "Failed to archive product" };
      }
    }

    console.error("Delete Product Error:", error);
    return { success: false, message: "Failed to delete" };
  }
}

export async function unarchiveProductAction(productId: string) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin") return { success: false, message: "Unauthorized" };

  try {
    await prisma.product.update({
      where: { id: productId },
      data: { isArchived: false },
    });

    revalidatePath("/admin/products");
    revalidatePath("/products"); // Make it visible in store again
    return { success: true, message: "Product restored successfully" };
  } catch (error) {
    console.error("Unarchive Product Error:", error);
    return { success: false, message: "Failed to unarchive product" };
  }
}
