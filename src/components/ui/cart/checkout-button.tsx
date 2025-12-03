// src/components/ui/cart/checkout-button.tsx
"use client";

import { useState } from "react";
import CheckoutGateModal from "./checkout-gate-modal";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface CheckoutButtonProps {
  itemCount: number;
}

export default function CheckoutButton({ itemCount }: CheckoutButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { status } = useSession();
  const router = useRouter();

  const handleCheckoutClick = () => {
    if (itemCount === 0) return;

    if (status === "authenticated") {
      router.push("/checkout/address");
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleCheckoutClick}
        disabled={itemCount === 0}
        className="w-full rounded-md border border-transparent bg-primary px-6 py-3.5 text-base font-medium text-primary-foreground shadow-sm hover:bg-primary/90 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 active:scale-[0.98]"
      >
        Checkout
      </button>
      <CheckoutGateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        cartItemCount={itemCount}
      />
    </>
  );
}
