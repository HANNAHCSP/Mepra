"use client";

import { deleteProductAction } from "@/app/actions/admin-product";
import { Trash2, Loader2 } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

export default function DeleteProductButton({ productId }: { productId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    // 1. Add a confirmation check
    if (!confirm("Are you sure you want to delete this product? This cannot be undone.")) {
      return;
    }

    // 2. Call server action
    startTransition(async () => {
      const result = await deleteProductAction(productId);

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
      title="Delete Product"
    >
      {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
    </button>
  );
}
