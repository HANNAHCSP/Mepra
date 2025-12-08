"use client";

import { unarchiveProductAction } from "@/app/actions/admin-product";
import { ArchiveRestore, Loader2 } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

export default function UnarchiveProductButton({ productId }: { productId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleUnarchive = () => {
    startTransition(async () => {
      const result = await unarchiveProductAction(productId);

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <button
      onClick={handleUnarchive}
      disabled={isPending}
      className="text-muted-foreground hover:text-green-600 transition-colors p-2 disabled:opacity-50"
      title="Restore Product"
    >
      {isPending ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <ArchiveRestore className="w-4 h-4" />
      )}
    </button>
  );
}
