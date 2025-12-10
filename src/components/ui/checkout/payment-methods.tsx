"use client";

import { useState, useTransition } from "react";
import { CreditCard, Banknote, Loader2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import PaymentForm from "@/app/(main)/checkout/payment/payment-form";
import { submitCodOrder } from "@/app/actions/orders";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface PaymentMethodsProps {
  paymentToken: string;
  iframeId?: string;
  orderId: string;
  orderTotal: number;
}

export default function PaymentMethods({
  paymentToken,
  iframeId,
  orderId,
  orderTotal,
}: PaymentMethodsProps) {
  const [method, setMethod] = useState<"card" | "cod">("card");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleCodSubmit = () => {
    startTransition(async () => {
      const result = await submitCodOrder(orderId);

      if (result.success) {
        toast.success("Order placed successfully!");
        // Use window.location to force a full refresh on the thank you page
        // or just router.push if your thank you page fetches data dynamically
        router.push(`/order-confirmation/${orderId}`);
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <div className="space-y-8">
      {/* 1. Selection Tabs */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => setMethod("card")}
          className={cn(
            "flex flex-col items-center justify-center p-6 border-2 rounded-xl transition-all duration-200",
            method === "card"
              ? "border-primary bg-primary/5 text-primary shadow-sm"
              : "border-border bg-white text-muted-foreground hover:border-primary/30 hover:bg-gray-50"
          )}
        >
          <CreditCard className="w-8 h-8 mb-3" />
          <span className="font-medium">Credit Card</span>
        </button>

        <button
          onClick={() => setMethod("cod")}
          className={cn(
            "flex flex-col items-center justify-center p-6 border-2 rounded-xl transition-all duration-200",
            method === "cod"
              ? "border-primary bg-primary/5 text-primary shadow-sm"
              : "border-border bg-white text-muted-foreground hover:border-primary/30 hover:bg-gray-50"
          )}
        >
          <Banknote className="w-8 h-8 mb-3" />
          <span className="font-medium">Cash on Delivery</span>
        </button>
      </div>

      {/* 2. Render Selected Method */}
      <div className="min-h-[400px]">
        {method === "card" ? (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="mb-4 text-sm text-muted-foreground flex items-center gap-2 bg-green-50 p-3 rounded-lg border border-green-100">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              Secure connection established via Paymob
            </div>
            <PaymentForm paymentToken={paymentToken} iframeId={iframeId} />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in slide-in-from-bottom-2 duration-300 border rounded-xl bg-accent/10">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-6 border border-border">
              <Banknote className="w-10 h-10 text-secondary" />
            </div>
            <h3 className="text-xl font-medium text-foreground mb-2">Pay Cash Upon Delivery</h3>
            <p className="text-muted-foreground max-w-sm mb-8 leading-relaxed">
              You will pay{" "}
              <strong className="text-foreground">${(orderTotal / 100).toFixed(2)}</strong> to the
              courier when your order arrives.
              <br />
              <span className="text-xs mt-2 block opacity-70">
                Please have the exact amount ready.
              </span>
            </p>

            <Button
              onClick={handleCodSubmit}
              disabled={isPending}
              size="lg"
              className="w-full max-w-xs gap-2 h-12 text-base"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Processing Order...
                </>
              ) : (
                <>
                  Place Order Now <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
