// src/app/api/payments/paymob/auth/route.ts
import { NextResponse } from "next/server";

export async function POST() {
  const apiKey = process.env.PAYMOB_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "Missing Paymob API Key" }, { status: 500 });
  }

  try {
    const response = await fetch("https://accept.paymob.com/api/auth/tokens", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ api_key: apiKey }),
    });

    if (!response.ok) {
      throw new Error("Failed to authenticate with Paymob");
    }

    const data = await response.json();
    return NextResponse.json({ token: data.token });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}