// src/components/ui/checkout/thank-you-client-page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PostPurchaseAuthModal from "./post-purchase-auth-modal";
import { clearCart } from "@/app/actions/cart";
import { CheckCircle, Package, ArrowRight } from "lucide-react";

interface ThankYouClientPageProps {
  orderId: string;
  orderNumber: string;
  customerEmail: string;
  isGuestOrder: boolean;
}

export default function ThankYouClientPage({
  orderId,
  orderNumber,
  customerEmail,
  isGuestOrder,
}: ThankYouClientPageProps) {
  const [isModalOpen, setIsModalOpen] = useState(isGuestOrder);

  useEffect(() => {
    clearCart();
  }, []);

  return (
    <>
      <div className="text-center space-y-6">
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-secondary/20 rounded-full animate-ping" />
            <div className="relative bg-secondary/10 p-4 rounded-full">
              <CheckCircle className="h-16 w-16 text-secondary" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        {/* Main Message */}
        <div className="space-y-3">
          <h1 className="text-3xl font-light tracking-tight text-foreground">
            Thank you for your order!
          </h1>
          <p className="text-base text-muted-foreground max-w-md mx-auto">
            Your order <span className="font-semibold text-foreground">#{orderNumber}</span> has
            been placed successfully.
          </p>
          <p className="text-sm text-muted-foreground">
            A confirmation email has been sent to{" "}
            <span className="font-medium text-foreground">{customerEmail}</span>
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-accent/50 border-2 border-border rounded-lg p-6 mt-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Package className="h-5 w-5 text-secondary" />
            <h2 className="text-lg font-semibold text-foreground">What&apos;s Next?</h2>
          </div>
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-2 justify-center">
              <div className="h-2 w-2 rounded-full bg-secondary" />
              <p>We&apos;ll send you tracking information once your order ships</p>
            </div>
            <div className="flex items-center gap-2 justify-center">
              <div className="h-2 w-2 rounded-full bg-secondary" />
              <p>Estimated delivery: 3-5 business days</p>
            </div>
            <div className="flex items-center gap-2 justify-center">
              <div className="h-2 w-2 rounded-full bg-secondary" />
              <p>Need help? Contact our support team</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <Link
            href="/account/orders"
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 hover:shadow-md transition-all duration-200 active:scale-95"
          >
            <Package className="h-4 w-4" />
            View Order Details
          </Link>
          <Link
            href="/products"
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-md border-2 border-border bg-white px-6 py-3.5 text-sm font-medium text-foreground hover:bg-accent transition-all duration-200 active:scale-95"
          >
            Continue Shopping
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Trust Badge */}
        <div className="pt-8 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Your payment information is secure and encrypted
          </p>
        </div>
      </div>

      {isGuestOrder && (
        <PostPurchaseAuthModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          orderId={orderId}
          customerEmail={customerEmail}
        />
      )}
    </>
  );
}
