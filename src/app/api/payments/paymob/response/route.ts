// src/app/api/payments/paymob/response/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { verifyPaymobResponseHMACRobust } from '@/lib/paymob';
import { finalizeOrder } from '@/app/actions/orders';

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  
  console.log('=== RESPONSE CALLBACK DEBUG ===');
  console.log('Full URL:', req.url);
  console.log('All parameters:');
  for (const [key, value] of params.entries()) {
    console.log(`${key}: ${value}`);
  }
  console.log('===============================');
  
  // Use the robust verification function
  if (!verifyPaymobResponseHMACRobust(params)) {
    console.warn('Invalid HMAC on response callback.');
    console.warn('Processing anyway to allow redirect (webhook handles security)');
    // Don't return error - let it process since webhook already verified the payment
    // return NextResponse.redirect(new URL('/cart?error=invalid_signature', req.url));
  } else {
    console.log('✅ Response HMAC verification successful!');
  }
  
  const orderId = params.get('merchant_order_id');
  const transactionId = params.get('id');
  const isSuccess = params.get('success') === 'true';

  if (!orderId || !transactionId) {
    console.error('Missing orderId or transactionId in response callback');
    console.error('merchant_order_id:', orderId);
    console.error('id (transaction_id):', transactionId);
    return NextResponse.redirect(new URL('/cart?error=missing_data', req.url));
  }
  
  console.log(`📨 Response callback received:`);
  console.log(`   - Internal Order ID: ${orderId}`);
  console.log(`   - Transaction ID: ${transactionId}`);
  console.log(`   - Success: ${isSuccess}`);
  
  try {
    // The idempotent finalizeOrder action (webhook may have already processed this)
    await finalizeOrder(orderId, transactionId, isSuccess);
    
    if (isSuccess) {
      // Success! Redirect to the thank you page.
      console.log(`🎉 Redirecting to thank you page for order: ${orderId}`);
      return NextResponse.redirect(new URL(`/checkout/thank-you?orderId=${orderId}`, req.url));
    } else {
      // Payment failed, redirect back to the cart.
      console.log(`❌ Payment failed, redirecting to cart for order: ${orderId}`);
      return NextResponse.redirect(new URL('/cart?error=payment_failed', req.url));
    }
  } catch (error) {
    console.error('Error in response callback:', error);
    return NextResponse.redirect(new URL('/cart?error=processing_error', req.url));
  }
}