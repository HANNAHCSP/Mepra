import { NextResponse, NextRequest } from 'next/server';
import { verifyPaymobResponseHMACRobust } from '@/lib/paymob';
import { finalizeOrder } from '@/app/actions/orders';

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  
  // Get the base URL from environment variables for reliable redirects
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
      
      // Construct the secure URL using the environment variable
      const thankYouUrl = new URL(`/checkout/thank-you`, appUrl);
      thankYouUrl.searchParams.set('orderId', finalOrder.id);
      
      if (!finalOrder.userId && finalOrder.accessToken) {
        thankYouUrl.searchParams.set('token', finalOrder.accessToken);
      }
      
      return NextResponse.redirect(thankYouUrl);
    } else {
      await finalizeOrder(orderId, transactionId, false);
      return NextResponse.redirect(new URL('/cart?error=payment_failed', appUrl));
    }
  } catch (error) {
    console.error('Error in response callback:', error);
    return NextResponse.redirect(new URL('/cart?error=processing_error', appUrl));
  }
}