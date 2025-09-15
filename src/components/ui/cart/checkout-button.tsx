// src/components/ui/cart/checkout-button.tsx
'use client'

import { useState } from "react";
import CheckoutGateModal from "./checkout-gate-modal";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// Accept the itemCount prop
interface CheckoutButtonProps {
  itemCount: number;
}

export default function CheckoutButton({ itemCount }: CheckoutButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { status } = useSession();
  const router = useRouter();

  const handleCheckoutClick = () => {
    // If cart is empty, do nothing
    if (itemCount === 0) return;

    if (status === 'authenticated') {
      router.push('/checkout/address');
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleCheckoutClick}
        disabled={itemCount === 0} // Disable button if cart is empty
        className="w-full rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Checkout
      </button>
      <CheckoutGateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        cartItemCount={itemCount} // Pass the count to the modal
      />
    </>
  );
}