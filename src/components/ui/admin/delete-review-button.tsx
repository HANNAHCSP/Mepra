"use client";

import { deleteReviewAction } from "@/app/actions/admin-review";
import { Trash2, Loader2 } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

export default function DeleteReviewButton({ reviewId }: { reviewId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    startTransition(async () => {
      const result = await deleteReviewAction(reviewId);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="text-muted-foreground hover:text-red-600 transition-colors p-2 disabled:opacity-50"
      title="Delete Review"
    >
      {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
    </button>
  );
}
