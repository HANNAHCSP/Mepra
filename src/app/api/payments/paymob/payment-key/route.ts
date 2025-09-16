// src/app/api/payments/paymob/payment-key/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { authToken, amountCents, orderId, billingData } = await req.json();
  const integrationId = process.env.PAYMOB_INTEGRATION_ID;

  try {
    const response = await fetch("https://accept.paymob.com/api/acceptance/payment_keys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        auth_token: authToken,
        amount_cents: amountCents,
        expiration: 3600,
        order_id: orderId,
        billing_data: {
          ...billingData,
          // These are required by Paymob
          street: billingData.street || "NA",
          building: billingData.building || "NA",
          floor: billingData.floor || "NA",
          apartment: billingData.apartment || "NA",
          country: billingData.country || "NA",
        },
        currency: "EGP",
        integration_id: integrationId,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to get payment key");
    }

    const data = await response.json();
    return NextResponse.json({ token: data.token });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}