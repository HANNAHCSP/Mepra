"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function deleteReviewAction(reviewId: string) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin") {
    return { success: false, message: "Unauthorized" };
  }

  try {
    // 1. Get the product ID before deleting (to revalidate its page)
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      include: { product: true },
    });

    if (!review) return { success: false, message: "Review not found" };

    // 2. Delete
    await prisma.review.delete({ where: { id: reviewId } });

    // 3. Revalidate Admin list AND the specific Product page
    revalidatePath("/admin/reviews");
    revalidatePath(`/products/${review.product.handle}`);

    return { success: true, message: "Review deleted" };
  } catch (error) {
    console.error("Delete Review Error:", error);
    return { success: false, message: "Failed to delete review" };
  }
}
