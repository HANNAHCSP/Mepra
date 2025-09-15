// src/components/ui/cart/checkout-gate-modal.tsx
'use client';

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

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
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
    <div
      className="relative z-50"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        onClick={handleBackdropClick}
      ></div>

      {/* Modal */}
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
              aria-label="Close modal"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="mt-3 w-full text-center sm:mt-0 sm:text-left">
                <h3
                  className="text-lg font-semibold leading-6 text-gray-900"
                  id="modal-title"
                >
                  Ready to checkout?
                </h3>

                {cartItemCount > 0 && (
                  <p className="mt-1 text-sm text-gray-500">
                    {cartItemCount} item{cartItemCount !== 1 ? 's' : ''} in your cart
                  </p>
                )}

                <div className="mt-6 space-y-4">
                  {/* Guest Checkout Option */}
                  <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <h4 className="font-medium text-gray-900 flex items-center">
                      <Zap className="w-5 h-5 mr-2 text-indigo-500" />
                      Express Checkout
                    </h4>
                    <p className="text-sm text-gray-500 mt-1 pl-7">
                      Quick checkout without creating an account.
                    </p>
                    <button
                      onClick={handleGuestCheckout}
                      type="button"
                      className="mt-3 w-full inline-flex justify-center items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Continue as Guest
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </button>
                  </div>

                  {/* Sign In Option */}
                  <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <h4 className="font-medium text-gray-900 flex items-center">
                      <CheckCircle2 className="w-5 h-5 mr-2 text-green-500" />
                      Account Benefits
                    </h4>
                    <p className="text-sm text-gray-500 mt-1 pl-7">
                      Save addresses, track orders, and enjoy faster future checkouts.
                    </p>
                    <Link
                      href={`/signin?callbackUrl=${encodeURIComponent('/checkout/address')}`}
                      className="mt-3 w-full inline-flex justify-center items-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                      Sign In / Create Account
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </div>

                  <p className="text-xs text-gray-400 text-center">
                    🔒 Your information is secure and encrypted.
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