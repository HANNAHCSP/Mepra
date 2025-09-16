// src/app/(main)/checkout/payment/page.tsx
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { createOrder } from '@/app/actions/orders';
import { getPaymobAuthToken, createPaymobOrder, getPaymobPaymentKey } from '@/lib/paymob.actions';
import { ShippingAddressSchema } from '@/lib/zod-schemas';
import PaymentForm from './payment-form';

type ShippingAddress = z.infer<typeof ShippingAddressSchema>;

async function getPaymentToken() {
  const order = await createOrder();
  const billingData = order.shippingAddress as ShippingAddress;
  
  const authToken = await getPaymobAuthToken();
   console.log(`✅ Sending my internal order ID to Paymob: ${order.id}`);
  const paymobOrderId = await createPaymobOrder(authToken, order.total, order.id);
  const paymentToken = await getPaymobPaymentKey(authToken, order.total, paymobOrderId, billingData);
  
  return paymentToken;
}

export default async function PaymentPage() {
  try {
    const paymentToken = await getPaymentToken();
    const iframeId = process.env.PAYMOB_IFRAME_ID;

    return (
      <div>
        <h1 className="text-xl font-semibold mb-4">Complete Your Payment</h1>
        <PaymentForm paymentToken={paymentToken} iframeId={iframeId} />
      </div>
    );
  } catch (error) {
    console.error("Failed to prepare payment:", error);
    redirect('/cart?error=payment_setup_failed');
  }
}