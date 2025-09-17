
// src/components/ui/checkout/thank-you-client-page.tsx


'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import PostPurchaseAuthModal from './post-purchase-auth-modal';
import { clearCart } from '@/app/actions/cart'; // Import the new universal action

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

  // This effect will run once when the component mounts.
  useEffect(() => {
    // Call the new `clearCart` action. It will handle both
    // guest and signed-in user cases correctly on the server.
    clearCart();
  }, []); // Empty dependency array ensures it runs only once.

  return (
    <>
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold text-gray-900">Thank you for your order!</h1>
        <p className="mt-2 text-gray-600">
          Your order #{orderNumber} has been placed and a confirmation has been sent to your email.
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