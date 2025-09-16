// src/app/api/payments/paymob/order/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { authToken, amountCents, merchantOrderId, items } = await req.json();

  try {
    const response = await fetch("https://accept.paymob.com/api/ecommerce/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        auth_token: authToken,
        delivery_needed: "false",
        amount_cents: amountCents,
        currency: "EGP",
        merchant_order_id: merchantOrderId,
        items,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create Paymob order");
    }

    const data = await response.json();
    return NextResponse.json({ id: data.id });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}