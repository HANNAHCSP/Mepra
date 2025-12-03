// src/components/ui/admin/refund-panel.tsx
"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { processRefundAction } from "@/app/actions/refund";
import { Button } from "@/components/ui/button";
import { RefundStatusBadge } from "@/components/ui/refund-status-badge";
import { Check, X, RefreshCw } from "lucide-react";
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
        toast.success(`Refund ${action === "approve" ? "approved" : "denied"} successfully.`);
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Failed to process refund.";
        toast.error(message);
      }
    });
  };

  const pendingRefunds = order.refunds.filter((r) => r.status === "REQUESTED");
  const processedRefunds = order.refunds.filter((r) => r.status !== "REQUESTED");

  return (
    <div className="space-y-6">
      {/* Active Requests Section */}
      {pendingRefunds.length > 0 && (
        <div className="bg-card border border-[#A9927D]/30 rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-[#5E503F] text-white flex justify-between items-center">
            <h3 className="font-light tracking-wide text-sm uppercase">Refund Request</h3>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
          </div>
          
          <div className="divide-y divide-[#A9927D]/10">
            {pendingRefunds.map((refund) => (
              <div key={refund.id} className="p-6 bg-[#A9927D]/5">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-3xl font-light text-primary">
                      ${(refund.amountCents / 100).toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">
                      Requested by {refund.requestedByUser?.name || "Client"}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-medium text-foreground/70 bg-white px-2 py-1 rounded border border-border">
                      {new Date(refund.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-border/40 mb-6">
                  <p className="text-sm text-foreground/80 italic">
                    &quot;{refund.reason || "No specific reason provided."}&quot;
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => handleProcess(refund.id, "approve")}
                    disabled={isPending}
                    className="flex-1 bg-[#5E503F] hover:bg-[#4A3F32] text-white shadow-md hover:shadow-lg transition-all"
                  >
                    {isPending ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <Check className="w-4 h-4 mr-2" />}
                    Approve Request
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleProcess(refund.id, "deny")}
                    disabled={isPending}
                    className="flex-1 border-burgundy/30 text-burgundy hover:bg-burgundy/5 hover:border-burgundy/50"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Decline
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* History Section */}
      {processedRefunds.length > 0 && (
        <div className="bg-card border border-border/60 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-border/60 bg-accent/20">
            <h3 className="font-medium text-foreground">Refund History</h3>
          </div>
          <ul className="divide-y divide-border/40">
            {processedRefunds.map((refund) => (
              <li key={refund.id} className="p-4 flex items-center justify-between hover:bg-accent/10 transition-colors">
                <div className="flex flex-col">
                  <span className="font-medium text-foreground">${(refund.amountCents / 100).toFixed(2)}</span>
                  <span className="text-xs text-muted-foreground">
                    Processed on {new Date(refund.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                <RefundStatusBadge status={refund.status} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}