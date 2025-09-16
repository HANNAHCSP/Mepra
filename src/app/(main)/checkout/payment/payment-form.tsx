// src/app/(main)/checkout/payment/payment-form.tsx
'use client';

interface PaymentFormProps {
  paymentToken: string;
  iframeId?: string;
}

export default function PaymentForm({ paymentToken, iframeId }: PaymentFormProps) {
  if (!iframeId) {
    return <p className="text-red-500">Iframe ID is not configured.</p>;
  }

  const iframeSrc = `https://accept.paymob.com/api/acceptance/iframes/${iframeId}?payment_token=${paymentToken}`;

  return (
    <iframe
      src={iframeSrc}
      className="w-full h-[600px] border-none"
      title="Paymob Checkout"
      allow="payment"
    ></iframe>
  );
}