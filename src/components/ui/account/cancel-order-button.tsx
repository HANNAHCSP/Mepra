"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { cancelOrderAction } from "@/app/actions/orders";
import { Button } from "@/components/ui/button";
import { Loader2, XCircle, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export default function CancelOrderButton({ orderId }: { orderId: string }) {
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const handleCancel = () => {
    startTransition(async () => {
      const result = await cancelOrderAction(orderId);

      if (result.success) {
        toast.success(result.message);
        setShowConfirm(false);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    });
  };

  if (showConfirm) {
    return (
      <div className="flex flex-col items-end gap-2 animate-in fade-in zoom-in duration-200 bg-destructive/5 p-4 rounded-lg border border-destructive/20 mt-6 md:mt-0">
        <div className="flex items-center gap-2 text-destructive mb-1">
          <AlertTriangle className="h-4 w-4" />
          <span className="text-sm font-medium">Are you sure?</span>
        </div>
        <p className="text-xs text-muted-foreground max-w-xs text-right mb-2">
          This action cannot be undone. If you paid online, the refund process will be initiated
          automatically.
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowConfirm(false)}
            disabled={isPending}
          >
            Keep Order
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleCancel}
            disabled={isPending}
            className="gap-2"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <XCircle className="h-4 w-4" />
            )}
            Yes, Cancel It
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Button
      variant="outline"
      onClick={() => setShowConfirm(true)}
      className="w-full sm:w-auto text-destructive border-destructive/30 hover:bg-destructive/10 hover:border-destructive/50"
    >
      Cancel Order
    </Button>
  );
}
