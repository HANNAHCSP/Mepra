// src/components/ui/admin/refund-panel.tsx
"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { processRefundAction } from "@/app/actions/refund";
import { Button } from "@/components/ui/button";
import { RefundStatusBadge } from "@/components/ui/refund-status-badge";
import { AlertCircle, CheckCircle, XCircle } from "lucide-react";
import type { Order, Refund, User } from "@prisma/client";

type RefundWithUser = Refund & { requestedByUser: User | null };
type OrderWithRefunds = Order & { refunds: RefundWithUser[] };

interface RefundPanelProps {
  order: OrderWithRefunds;
}

export default function RefundPanel({ order }: RefundPanelProps) {
  const [isPending, startTransition] = useTransition();

  const handleProcess = (refundId: string, action: "approve" | "deny") => {
    startTransition(async () => {
      try {
        await processRefundAction(refundId, action);
        toast.success(`Refund request has been ${action === "approve" ? "approved" : "denied"}.`, {
          description:
            action === "approve"
              ? "The refund is now being processed by the payment provider."
              : "The customer has been notified of the decision.",
        });
      } catch (error: Error | unknown) {
        const errorMessage = error instanceof Error ? error.message : "Failed to process refund.";
        toast.error(errorMessage);
      }
    });
  };

  const pendingRefunds = order.refunds.filter((r) => r.status === "REQUESTED");
  const processedRefunds = order.refunds.filter((r) => r.status !== "REQUESTED");

  return (
    <div className="bg-card border-2 border-border rounded-lg shadow-sm overflow-hidden">
      <div className="bg-accent/50 px-6 py-4 border-b-2 border-border">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-secondary" />
          Refunds
        </h2>
      </div>

      {pendingRefunds.length > 0 && (
        <div className="p-6 bg-secondary/5 border-b-2 border-border">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
            <h3 className="font-semibold text-foreground">Pending Requests</h3>
          </div>
          <ul className="space-y-4">
            {pendingRefunds.map((refund) => (
              <li
                key={refund.id}
                className="p-4 bg-card rounded-lg border-2 border-border shadow-sm"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <p className="font-bold text-xl text-primary mb-1">
                      ${(refund.amountCents / 100).toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground mb-2">
                      <span className="font-medium">Reason:</span>{" "}
                      {refund.reason || "No reason provided"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Requested by {refund.requestedByUser?.name || "Customer"} on{" "}
                      {new Date(refund.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleProcess(refund.id, "deny")}
                      disabled={isPending}
                      className="gap-1"
                    >
                      <XCircle className="h-4 w-4" />
                      Deny
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleProcess(refund.id, "approve")}
                      disabled={isPending}
                      className="gap-1 bg-secondary hover:bg-secondary/90"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Approve
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {processedRefunds.length > 0 && (
        <div className="p-6">
          <h3 className="font-semibold text-foreground mb-4">Refund History</h3>
          <ul className="space-y-3">
            {processedRefunds.map((refund) => (
              <li
                key={refund.id}
                className="flex justify-between items-center p-3 rounded-md bg-accent/30"
              >
                <div>
                  <p className="font-medium text-foreground">
                    ${(refund.amountCents / 100).toFixed(2)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(refund.updatedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <RefundStatusBadge status={refund.status} />
              </li>
            ))}
          </ul>
        </div>
      )}

      {order.refunds.length === 0 && (
        <div className="p-8 text-center">
          <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No refunds for this order.</p>
        </div>
      )}
    </div>
  );
}
