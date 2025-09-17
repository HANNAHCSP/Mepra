// src/app/api/payments/paymob/response/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { verifyPaymobResponseHMACRobust } from '@/lib/paymob';
import { finalizeOrder } from '@/app/actions/orders';

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!appUrl) {
    console.error("FATAL: NEXT_PUBLIC_APP_URL environment variable is not set.");
    return NextResponse.redirect(new URL('/cart?error=configuration_error', 'http://localhost:3000'));
  }

  if (!verifyPaymobResponseHMACRobust(params)) {
    console.warn('Invalid HMAC on response callback. Redirecting with error.');
    return NextResponse.redirect(new URL('/cart?error=invalid_signature', appUrl));
  }

  const orderId = params.get('merchant_order_id');
  const transactionId = params.get('id');
  const isSuccess = params.get('success') === 'true';

  if (!orderId || !transactionId) {
    return NextResponse.redirect(new URL('/cart?error=missing_data', appUrl));
  }
  
  try {
    if (isSuccess) {
      const finalOrder = await finalizeOrder(orderId, transactionId, true);
      
      if (!finalOrder) {
        throw new Error("Order could not be finalized or found after payment.");
      }
      
      // Redirect to the new order confirmation page
      const confirmationUrl = new URL(`/order-confirmation/${finalOrder.id}`, appUrl);
      
      if (!finalOrder.userId && finalOrder.accessToken) {
        confirmationUrl.searchParams.set('token', finalOrder.accessToken);
      }
      
      return NextResponse.redirect(confirmationUrl);
    } else {
      await finalizeOrder(orderId, transactionId, false);
      return NextResponse.redirect(new URL('/cart?error=payment_failed', appUrl));
    }
  } catch (error) {
    console.error('Error in response callback:', error);
    return NextResponse.redirect(new URL('/cart?error=processing_error', appUrl));
  }
}