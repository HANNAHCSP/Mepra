"use client";

import { useState, useTransition } from "react";
import { markOrderAsPaidAction } from "@/app/actions/admin-order";
import { Button } from "@/components/ui/button";
import { Banknote, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function MarkPaidButton({ orderId }: { orderId: string }) {
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleMarkPaid = () => {
    startTransition(async () => {
      const result = await markOrderAsPaidAction(orderId);
      if (result.success) {
        toast.success(result.message);
        setShowConfirm(false);
      } else {
        toast.error(result.message);
      }
    });
  };

  if (showConfirm) {
    return (
      <div className="flex items-center gap-2 animate-in fade-in zoom-in duration-200">
        <span className="text-xs text-muted-foreground hidden sm:inline">Cash received?</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowConfirm(false)}
          disabled={isPending}
          className="h-8 w-8 p-0"
        >
          <span className="sr-only">Cancel</span>
          <AlertCircle className="w-4 h-4 text-muted-foreground" />
        </Button>
        <Button
          onClick={handleMarkPaid}
          disabled={isPending}
          size="sm"
          className="bg-green-600 hover:bg-green-700 text-white h-8 gap-1.5"
        >
          {isPending ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <CheckCircle2 className="w-3.5 h-3.5" />
          )}
          Confirm
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={() => setShowConfirm(true)}
      variant="outline"
      size="sm"
      className={cn(
        "gap-2 border-green-200 hover:bg-green-50 text-green-700 hover:text-green-800 w-full justify-center transition-colors"
      )}
    >
      <Banknote className="w-4 h-4" />
      Mark Cash Received
    </Button>
  );
}
