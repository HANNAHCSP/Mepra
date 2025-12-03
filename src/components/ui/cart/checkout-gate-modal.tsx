// src/components/ui/cart/checkout-gate-modal.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { X, Zap, CheckCircle2, ArrowRight } from "lucide-react";

interface CheckoutGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItemCount: number;
}

export default function CheckoutGateModal({
  isOpen,
  onClose,
  cartItemCount,
}: CheckoutGateModalProps) {
  const router = useRouter();

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  if (!isOpen) return null;

  const handleGuestCheckout = () => {
    router.push("/checkout/address?guest=true");
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div
        className="fixed inset-0 bg-primary/20 backdrop-blur-sm transition-opacity"
        onClick={handleBackdropClick}
      ></div>

      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close modal"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="mt-3 w-full text-center sm:mt-0 sm:text-left">
                <h3 className="text-2xl font-light leading-6 text-foreground" id="modal-title">
                  Ready to checkout?
                </h3>

                {cartItemCount > 0 && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    {cartItemCount} item{cartItemCount !== 1 ? "s" : ""} in your cart
                  </p>
                )}

                <div className="mt-6 space-y-4">
                  {/* Guest Checkout Option */}
                  <div className="border-2 rounded-lg p-4 hover:bg-accent/50 transition-all duration-200">
                    <h4 className="font-medium text-foreground flex items-center">
                      <Zap className="w-5 h-5 mr-2 text-secondary" />
                      Express Checkout
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1 pl-7">
                      Quick checkout without creating an account.
                    </p>
                    <button
                      onClick={handleGuestCheckout}
                      type="button"
                      className="mt-3 w-full inline-flex justify-center items-center rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 transition-all duration-200 active:scale-[0.98]"
                    >
                      Continue as Guest
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </button>
                  </div>

                  {/* Sign In Option */}
                  <div className="border-2 rounded-lg p-4 hover:bg-accent/50 transition-all duration-200">
                    <h4 className="font-medium text-foreground flex items-center">
                      <CheckCircle2 className="w-5 h-5 mr-2 text-secondary" />
                      Account Benefits
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1 pl-7">
                      Save addresses, track orders, and enjoy faster future checkouts.
                    </p>
                    <Link
                      href={`/signin?callbackUrl=${encodeURIComponent("/checkout/address")}`}
                      className="mt-3 w-full inline-flex justify-center items-center rounded-md bg-white px-4 py-3 text-sm font-semibold text-foreground shadow-sm ring-2 ring-inset ring-border hover:bg-accent transition-all duration-200 active:scale-[0.98]"
                    >
                      Sign In / Create Account
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </div>

                  <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Your information is secure and encrypted.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
