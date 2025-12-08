"use client";

import { useState, useTransition } from "react";
import { Star, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { submitReviewAction } from "@/app/actions/review";
import { cn } from "@/lib/utils";

// Define Types inline for simplicity or import from Prisma types
interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
  user: {
    name: string | null;
  };
}

interface ReviewsSectionProps {
  productId: string;
  reviews: Review[];
  userBox?: React.ReactNode; // Optional slot if we want to pass user state later
}

export default function ReviewsSection({ productId, reviews }: ReviewsSectionProps) {
  const [rating, setRating] = useState(5);
  const [isPending, startTransition] = useTransition();

  // Calculate Average
  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : "0.0";

  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await submitReviewAction(formData);
      if (result.success) {
        toast.success(result.message);
        // Reset form manually or use a ref if needed, but for now simple is fine
        const form = document.getElementById("review-form") as HTMLFormElement;
        form?.reset();
        setRating(5);
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <div className="space-y-10">
      {/* Header / Summary */}
      <div className="border-b border-border pb-8">
        <h2 className="text-2xl font-light text-foreground mb-4">Customer Reviews</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-primary">
            <span className="text-3xl font-semibold">{averageRating}</span>
            <div className="flex text-secondary">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={cn(
                    "w-5 h-5",
                    star <= Math.round(Number(averageRating)) ? "fill-current" : "text-gray-300"
                  )}
                />
              ))}
            </div>
          </div>
          <span className="text-sm text-muted-foreground">
            Based on {reviews.length} review{reviews.length !== 1 && "s"}
          </span>
        </div>
      </div>

      {/* Review List */}
      <div className="space-y-8">
        {reviews.length === 0 ? (
          <p className="text-muted-foreground italic">No reviews yet. Be the first!</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">
                    {review.user.name || "Anonymous"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex text-secondary mb-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={cn(
                        "w-3 h-3",
                        star <= review.rating ? "fill-current" : "text-gray-300"
                      )}
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">{review.comment}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Write Review Form */}
      <div className="bg-muted/30 p-6 rounded-xl border border-border">
        <h3 className="font-medium text-lg mb-4">Write a Review</h3>
        <form id="review-form" action={handleSubmit} className="space-y-4">
          <input type="hidden" name="productId" value={productId} />
          <input type="hidden" name="rating" value={rating} />

          {/* Star Selector */}
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="focus:outline-none transition-transform hover:scale-110"
              >
                <Star
                  className={cn(
                    "w-6 h-6 transition-colors",
                    star <= rating ? "fill-secondary text-secondary" : "text-gray-300"
                  )}
                />
              </button>
            ))}
            <span className="ml-2 text-sm text-muted-foreground">
              {rating === 5 ? "Excellent" : rating === 1 ? "Poor" : ""}
            </span>
          </div>

          <div>
            <textarea
              name="comment"
              rows={4}
              placeholder="Share your thoughts about this product..."
              className="w-full rounded-md border-2 border-input bg-white px-4 py-3 text-sm text-foreground transition-colors focus-visible:outline-none focus-visible:border-secondary focus-visible:ring-4 focus-visible:ring-secondary/10"
            />
          </div>

          <Button type="submit" disabled={isPending}>
            {isPending ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      </div>
    </div>
  );
}
