"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { processRefundAction } from "@/app/actions/refund";
import { Button } from "@/components/ui/button";
import { RefundStatusBadge } from "@/components/ui/refund-status-badge";
import {
  Check,
  X,
  RefreshCw,
  AlertTriangle,
  CreditCard,
  Banknote,
  History,
  ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Order, Refund, User, Payment } from "@prisma/client";
import { cn } from "@/lib/utils";

type RefundWithDetails = Refund & {
  requestedByUser: User | null;
  payment: Payment;
};

type OrderWithRefunds = Order & {
  refunds: RefundWithDetails[];
};

interface RefundPanelProps {
  order: OrderWithRefunds;
}

export default function RefundPanel({ order }: RefundPanelProps) {
  const pendingRefunds = order.refunds.filter((r) => r.status === "REQUESTED");
  const processedRefunds = order.refunds.filter((r) => r.status !== "REQUESTED");

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* --- SECTION 1: ACTIVE REQUESTS --- */}
      {pendingRefunds.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive">
            <AlertTriangle className="w-5 h-5" />
            <div>
              <h4 className="text-sm font-semibold">Action Required</h4>
              <p className="text-xs opacity-90">
                A customer has requested a refund. Please review below.
              </p>
            </div>
          </div>

          {pendingRefunds.map((refund) => (
            <RefundRequestCard key={refund.id} refund={refund} />
          ))}
        </div>
      )}

      {/* --- SECTION 2: HISTORY --- */}
      {processedRefunds.length > 0 && (
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-muted/30 flex items-center gap-2">
            <History className="w-4 h-4 text-muted-foreground" />
            <h3 className="font-medium text-foreground">Refund History</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase tracking-wider text-muted-foreground bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium">Amount</th>
                  <th className="px-6 py-3 font-medium">Method</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Reference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {processedRefunds.map((refund) => (
                  <tr key={refund.id} className="hover:bg-muted/5 transition-colors">
                    <td className="px-6 py-4 text-muted-foreground">
                      {new Date(refund.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-medium text-foreground">
                      ${(refund.amountCents / 100).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      {refund.payment.provider === "CASH_ON_DELIVERY" ? (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Banknote className="w-3.5 h-3.5" /> Cash
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <CreditCard className="w-3.5 h-3.5" /> Paymob
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <RefundStatusBadge status={refund.status} />
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                      {refund.providerRef || "Manual"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// --- SUB-COMPONENT: REFUND CARD WITH SAFE CONFIRMATION ---
function RefundRequestCard({ refund }: { refund: RefundWithDetails }) {
  const [isPending, startTransition] = useTransition();
  const [confirmState, setConfirmState] = useState<"idle" | "approving" | "denying">("idle");

  const isCOD = refund.payment.provider === "CASH_ON_DELIVERY";

  const handleAction = (action: "approve" | "deny") => {
    startTransition(async () => {
      try {
        await processRefundAction(refund.id, action);
        toast.success(`Refund ${action === "approve" ? "processed" : "rejected"} successfully.`);
        setConfirmState("idle");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to process request.");
      }
    });
  };

  return (
    <div className="group rounded-xl border border-border bg-card shadow-sm transition-all hover:shadow-md overflow-hidden">
      {/* Card Header */}
      <div className="p-6 grid md:grid-cols-2 gap-6">
        <div>
          <div className="flex items-baseline gap-3 mb-1">
            <span className="text-3xl font-light text-primary">
              ${(refund.amountCents / 100).toFixed(2)}
            </span>
            <Badge variant="secondary" className="font-normal">
              {isCOD ? "Cash Order" : "Online Payment"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Requested by{" "}
            <span className="font-medium text-foreground">
              {refund.requestedByUser?.name || "Customer"}
            </span>
            <span className="mx-1">•</span>
            {new Date(refund.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Reason Box */}
        <div className="bg-muted/30 p-4 rounded-lg border border-border/50">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
            Reason for Return
          </p>
          <p className="text-sm text-foreground/90 italic">
            &quot;{refund.reason || "No reason provided."}&quot;
          </p>
        </div>
      </div>

      {/* Action Footer */}
      <div className="px-6 py-4 bg-muted/20 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
        {/* Contextual Hint */}
        <div className="text-xs text-muted-foreground flex items-center gap-2">
          {isCOD ? (
            <>
              <Banknote className="w-4 h-4 text-primary" />
              <span>
                <strong>Manual Action:</strong> Ensure cash is returned before approving.
              </span>
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4 text-primary" />
              <span>
                <strong>Auto Action:</strong> Approving will trigger a refund via Paymob.
              </span>
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {confirmState === "idle" ? (
            <>
              <Button
                variant="outline"
                onClick={() => setConfirmState("denying")}
                disabled={isPending}
                className="flex-1 sm:flex-none border-destructive/20 text-destructive hover:bg-destructive/10 hover:border-destructive/50"
              >
                Reject
              </Button>
              <Button
                variant="default"
                onClick={() => setConfirmState("approving")}
                disabled={isPending}
                className="flex-1 sm:flex-none"
              >
                Process Refund
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-3 w-full animate-in fade-in slide-in-from-right-2 duration-200">
              <span className="text-sm font-medium text-foreground whitespace-nowrap">
                Are you sure?
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setConfirmState("idle")}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                variant={confirmState === "approving" ? "default" : "destructive"}
                size="sm"
                onClick={() => handleAction(confirmState === "approving" ? "approve" : "deny")}
                disabled={isPending}
                className="gap-2 min-w-[120px]"
              >
                {isPending ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : confirmState === "approving" ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <X className="w-3.5 h-3.5" />
                )}
                Confirm {confirmState === "approving" ? "Approve" : "Reject"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
