// src/lib/paymob.ts
import crypto from 'crypto';
import { PaymobWebhookPayload } from '@/types/paymob';

/**
 * Verifies the HMAC for the server-to-server "processed" webhook.
 * This function handles the JSON object from the webhook body.
 */
export function verifyPaymobWebhookHMAC(payload: PaymobWebhookPayload): boolean {
  const hmacSecret = process.env.PAYMOB_HMAC_SECRET;
  if (!hmacSecret) {
    console.error("Paymob HMAC secret is not set.");
    return false;
  }

  const { obj: t, hmac: receivedHmac } = payload;

  // IMPORTANT: The order of fields is critical and varies by Paymob region/version
  // This is the most common order for webhook HMAC verification:
  const concatenatedString = 
      `${t.amount_cents}${t.created_at}${t.currency}${t.error_occured}${t.has_parent_transaction}${t.id}${t.integration_id}${t.is_3d_secure}${t.is_auth}${t.is_capture}${t.is_refunded}${t.is_standalone_payment}${t.is_voided}${t.order.id}${t.owner}${t.pending}${t.source_data.pan}${t.source_data.sub_type}${t.source_data.type}${t.success}`;

  const calculatedHmac = crypto
    .createHmac('sha512', hmacSecret)
    .update(concatenatedString)
    .digest('hex');
    
  console.log('HMAC Debug Info:');
  console.log('Concatenated string:', concatenatedString);
  console.log('Calculated HMAC:', calculatedHmac);
  console.log('Received HMAC:', receivedHmac);
  console.log('HMAC Match:', calculatedHmac === receivedHmac);
    
  return calculatedHmac === receivedHmac;
}

/**
 * Alternative HMAC verification with different field order
 * Try this if the above doesn't work
 */
export function verifyPaymobWebhookHMACAlternative(payload: PaymobWebhookPayload): boolean {
  const hmacSecret = process.env.PAYMOB_HMAC_SECRET;
  if (!hmacSecret) {
    console.error("Paymob HMAC secret is not set.");
    return false;
  }

  const { obj: t, hmac: receivedHmac } = payload;

  // Alternative order based on different Paymob documentation versions
  const concatenatedString = 
      `${t.amount_cents}${t.created_at}${t.currency}${t.error_occured}${t.has_parent_transaction}${t.id}${t.integration_id}${t.is_3d_secure}${t.is_auth}${t.is_capture}${t.is_refunded}${t.is_standalone_payment}${t.is_voided}${t.order}${t.owner}${t.pending}${t.source_data.pan}${t.source_data.sub_type}${t.source_data.type}${t.success}`;

  const calculatedHmac = crypto
    .createHmac('sha512', hmacSecret)
    .update(concatenatedString)
    .digest('hex');
    
  return calculatedHmac === receivedHmac;
}

/**
 * Third alternative - some implementations use order.id as string, others as number
 */
export function verifyPaymobWebhookHMACAlternative2(payload: PaymobWebhookPayload): boolean {
  const hmacSecret = process.env.PAYMOB_HMAC_SECRET;
  if (!hmacSecret) {
    console.error("Paymob HMAC secret is not set.");
    return false;
  }

  const { obj: t, hmac: receivedHmac } = payload;

  // Some implementations might need string conversion or different handling
  const concatenatedString = 
      `${t.amount_cents}${t.created_at}${t.currency}${String(t.error_occured).toLowerCase()}${String(t.has_parent_transaction).toLowerCase()}${t.id}${t.integration_id}${String(t.is_3d_secure).toLowerCase()}${String(t.is_auth).toLowerCase()}${String(t.is_capture).toLowerCase()}${String(t.is_refunded).toLowerCase()}${String(t.is_standalone_payment).toLowerCase()}${String(t.is_voided).toLowerCase()}${t.order.id}${t.owner}${String(t.pending).toLowerCase()}${t.source_data.pan}${t.source_data.sub_type}${t.source_data.type}${String(t.success).toLowerCase()}`;

  const calculatedHmac = crypto
    .createHmac('sha512', hmacSecret)
    .update(concatenatedString)
    .digest('hex');
    
  return calculatedHmac === receivedHmac;
}

/**
 * Enhanced verification function that tries multiple methods
 */
export function verifyPaymobWebhookHMACRobust(payload: PaymobWebhookPayload): boolean {
  // Try the main method first
  if (verifyPaymobWebhookHMAC(payload)) {
    console.log('HMAC verified with primary method');
    return true;
  }
  
  // Try alternative method 1
  if (verifyPaymobWebhookHMACAlternative(payload)) {
    console.log('HMAC verified with alternative method 1');
    return true;
  }
  
  // Try alternative method 2
  if (verifyPaymobWebhookHMACAlternative2(payload)) {
    console.log('HMAC verified with alternative method 2');
    return true;
  }
  
  console.error('All HMAC verification methods failed');
  return false;
}

/**
 * Verifies the HMAC for the client-side "response" redirect from URL parameters.
 * Based on the actual parameter names and order from Paymob response.
 */
export function verifyPaymobResponseHMAC(params: URLSearchParams): boolean {
  const hmacSecret = process.env.PAYMOB_HMAC_SECRET;
  const receivedHmac = params.get('hmac');

  if (!hmacSecret || !receivedHmac) {
    console.log('Missing HMAC secret or received HMAC');
    return false;
  }

  // Based on your actual response URL, the correct order seems to be:
  const hmacKeys = [
    'amount_cents', 'created_at', 'currency', 'error_occured', 'has_parent_transaction',
    'id', 'integration_id', 'is_3d_secure', 'is_auth', 'is_capture', 'is_refunded',
    'is_standalone_payment', 'is_voided', 'order', 'owner', 'pending', 'source_data.pan',
    'source_data.sub_type', 'source_data.type', 'success'
  ];

  const concatenatedString = hmacKeys.map(key => {
    const value = params.get(key);
    return value || '';
  }).join('');

  const calculatedHmac = crypto
    .createHmac('sha512', hmacSecret)
    .update(concatenatedString)
    .digest('hex');

  console.log('Response HMAC Debug:');
  console.log('Concatenated string:', concatenatedString);
  console.log('Calculated HMAC:', calculatedHmac);
  console.log('Received HMAC:', receivedHmac);

  return calculatedHmac === receivedHmac;
}

/**
 * Alternative response HMAC verification - tries different approach
 */
export function verifyPaymobResponseHMACAlternative(params: URLSearchParams): boolean {
  const hmacSecret = process.env.PAYMOB_HMAC_SECRET;
  const receivedHmac = params.get('hmac');

  if (!hmacSecret || !receivedHmac) {
    return false;
  }

  // Try the exact same order as webhook but with response parameter names
  const concatenatedString = 
    `${params.get('amount_cents')}${params.get('created_at')}${params.get('currency')}${params.get('error_occured')}${params.get('has_parent_transaction')}${params.get('id')}${params.get('integration_id')}${params.get('is_3d_secure')}${params.get('is_auth')}${params.get('is_capture')}${params.get('is_refunded')}${params.get('is_standalone_payment')}${params.get('is_voided')}${params.get('order')}${params.get('owner')}${params.get('pending')}${params.get('source_data.pan')}${params.get('source_data.sub_type')}${params.get('source_data.type')}${params.get('success')}`;

  const calculatedHmac = crypto
    .createHmac('sha512', hmacSecret)
    .update(concatenatedString)
    .digest('hex');

  return calculatedHmac === receivedHmac;
}

/**
 * Robust response HMAC verification that tries multiple methods
 */
export function verifyPaymobResponseHMACRobust(params: URLSearchParams): boolean {
  // Try the main method first
  if (verifyPaymobResponseHMAC(params)) {
    console.log('Response HMAC verified with primary method');
    return true;
  }
  
  // Try alternative method
  if (verifyPaymobResponseHMACAlternative(params)) {
    console.log('Response HMAC verified with alternative method');
    return true;
  }
  
  console.error('All response HMAC verification methods failed');
  return false;
}