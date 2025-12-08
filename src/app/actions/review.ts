"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

const ReviewSchema = z.object({
  productId: z.string(),
  rating: z.coerce.number().min(1).max(5),
  comment: z.string().optional(),
});

export async function submitReviewAction(formData: FormData) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return { success: false, message: "You must be logged in to review." };
  }

  const parsed = ReviewSchema.safeParse({
    productId: formData.get("productId"),
    rating: formData.get("rating"),
    comment: formData.get("comment"),
  });

  if (!parsed.success) {
    return { success: false, message: "Invalid review data." };
  }

  const { productId, rating, comment } = parsed.data;

  try {
    // Optional: Check if user already reviewed (prevent spam)
    const existingReview = await prisma.review.findFirst({
      where: {
        userId: session.user.id,
        productId: productId,
      },
    });

    if (existingReview) {
      return { success: false, message: "You have already reviewed this product." };
    }

    await prisma.review.create({
      data: {
        userId: session.user.id,
        productId,
        rating,
        comment,
      },
    });

    revalidatePath(`/products/[handle]`); // Will revalidate whichever product page triggered this
    return { success: true, message: "Review submitted successfully!" };
  } catch (error) {
    console.error("Review submission error:", error);
    return { success: false, message: "Failed to submit review." };
  }
}
