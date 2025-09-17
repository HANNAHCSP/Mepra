// src/components/ui/checkout/thank-you-client-page.tsx
'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import PostPurchaseAuthModal from './post-purchase-auth-modal';
import { clearCart } from '@/app/actions/cart';

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
  
  // This effect runs once on mount to clear the user's cart.
  useEffect(() => {
    clearCart();
  }, []); // Empty dependency array ensures it runs only once.

  return (
    <>
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold text-gray-900">Thank you for your order!</h1>
        <p className="mt-2 text-gray-600">
          Your order #{orderNumber} has been placed. A confirmation has been sent to your email.
        </p>
        
        <div className="mt-8">
          <Link 
            href="/products" 
            className="text-indigo-600 hover:text-indigo-500 font-medium"
          >
            Continue Shopping &rarr;
          </Link>
        </div>
      </div>

      {/* The PostPurchaseAuthModal is already implemented correctly.
        It handles the inline signup form which is a much better UX
        than the email-based upgrade card. We will trigger it directly if it's a guest order.
      */}
      {isGuestOrder && (
         <PostPurchaseAuthModal
            isOpen={true} // We can default it to open for guests
            onClose={() => {
                // In a real app, you might want a state to control this,
                // but for now, we'll just let the user navigate away.
            }}
            orderId={orderId}
            customerEmail={customerEmail}
          />
      )}
    </>
  );
}