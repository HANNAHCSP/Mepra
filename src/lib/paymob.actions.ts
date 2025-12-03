// src/lib/paymob.actions.ts
'use server';

import { z } from 'zod';
import { ShippingAddressSchema } from './zod-schemas';
import { PaymobRefundResponse } from '@/types/paymob';

// Infer the TypeScript type directly from the Zod schema for type safety
type ShippingAddress = z.infer<typeof ShippingAddressSchema>;

// 1. Get Authentication Token
export async function getPaymobAuthToken(): Promise<string> {
  const apiKey = process.env.PAYMOB_API_KEY;
  if (!apiKey) throw new Error("Missing Paymob API Key");

  const response = await fetch("https://accept.paymob.com/api/auth/tokens", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ api_key: apiKey }),
    cache: 'no-store'
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Failed to authenticate with Paymob: ${errorBody}`);
  }

  const data = await response.json();
  return data.token;
}

// 2. Create Paymob Order
export async function createPaymobOrder(authToken: string, amountCents: number, merchantOrderId: string): Promise<number> {
  const response = await fetch("https://accept.paymob.com/api/ecommerce/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      auth_token: authToken,
      delivery_needed: "false",
      amount_cents: amountCents,
      currency: "EGP",
      merchant_order_id: merchantOrderId,
      items: [],
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Failed to create Paymob order: ${errorBody}`);
  }

  const data = await response.json();
  return data.id;
}

// 3. Get Final Payment Key (Corrected Version)
export async function getPaymobPaymentKey(
  authToken: string,
  amountCents: number,
  paymobOrderId: number,
  billingData: ShippingAddress // <-- NOW TYPE-SAFE
): Promise<string> {
  const integrationId = process.env.PAYMOB_INTEGRATION_ID;
  if (!integrationId) throw new Error("Missing Paymob Integration ID");

  const response = await fetch("https://accept.paymob.com/api/acceptance/payment_keys", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      auth_token: authToken,
      amount_cents: amountCents,
      expiration: 3600,
      order_id: paymobOrderId,
      billing_data: {
        email: billingData.email,
        first_name: billingData.firstName,
        last_name: billingData.lastName,
        phone_number: billingData.phone || "+201000000000",
        street: billingData.address || "NA",
        building: "NA",
        floor: "NA",
        apartment: billingData.apartment || "NA",
        city: billingData.city || "NA",
        country: "EG",
      },
      currency: "EGP",
      integration_id: parseInt(integrationId, 10),
    }),
  });

  if (!response.ok) {
    const errorBody = await response.json();
    console.error("Paymob Payment Key Error:", errorBody);
    throw new Error(`Failed to get payment key: ${errorBody.message || errorBody.detail || 'Unknown error'}`);
  }

  const data = await response.json();
  return data.token;
}


// 4. Create a Refund with Paymob (New Function)
export async function createPaymobRefund(
  authToken: string,
  transactionId: string,
  amountCents: number
): Promise<PaymobRefundResponse> { // <-- FIX: Changed 'any' to 'PaymobRefundResponse'
  const response = await fetch("https://accept.paymob.com/api/acceptance/void_refund/refund", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      auth_token: authToken,
      transaction_id: transactionId,
      amount_cents: amountCents,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.json();
    console.error("Paymob Refund Error:", errorBody);
    throw new Error(`Failed to create Paymob refund: ${errorBody.detail || 'Unknown error'}`);
  }

  // The 'data' constant is now automatically inferred as 'PaymobRefundResponse'
  const data = await response.json();
  return data;
}