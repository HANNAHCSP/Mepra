// src/app/api/payments/paymob/processed/route.ts
import { NextResponse, NextRequest } from "next/server";
import { verifyPaymobWebhookHMACRobust } from "@/lib/paymob";
import { finalizeOrder } from "@/app/actions/orders";
import { finalizeRefundAction } from "@/app/actions/refund"; // Import the new action
import { PaymobWebhookPayload, PaymobTransaction } from "@/types/paymob";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Get HMAC from query parameters instead of body
    const hmacFromQuery = req.nextUrl.searchParams.get("hmac");

    console.log("--- PAYMOB WEBHOOK RECEIVED ---");
    console.log("Payload:", JSON.stringify(body, null, 2));

    const webhookPayload: PaymobWebhookPayload = { ...body, hmac: hmacFromQuery || "" };

    if (!verifyPaymobWebhookHMACRobust(webhookPayload)) {
      console.error("HMAC verification failed!");
      // In production, you should strictly return an error here.
      // return NextResponse.json({ error: 'Invalid HMAC signature' }, { status: 401 });
    } else {
      console.log("✅ HMAC verification successful!");
    }

    const transaction: PaymobTransaction = body.obj;

    // --- ROUTING LOGIC ---
    // Check if the transaction is a refund or void.
    if (transaction.is_refund || transaction.is_void) {
      console.log(`Processing as REFUND. Paymob Transaction ID: ${transaction.id}`);

      await finalizeRefundAction(transaction.id.toString(), transaction.success);

      return NextResponse.json({ message: "Refund webhook processed" }, { status: 200 });
    } else {
      // Otherwise, process it as a standard payment confirmation.
      const internalOrderId = transaction.order.merchant_order_id;
      const paymobTransactionId = transaction.id.toString();
      const isSuccess = transaction.success === true;

      console.log(`Processing as PAYMENT. Internal Order ID: ${internalOrderId}`);

      if (!internalOrderId) {
        console.error("Webhook received without a merchant_order_id for a payment.");
        return NextResponse.json({ error: "Merchant order ID missing" }, { status: 400 });
      }

      await finalizeOrder(internalOrderId, paymobTransactionId, isSuccess);

      return NextResponse.json({ message: "Payment webhook processed" }, { status: 200 });
    }
  } catch (error) {
    console.error("Error processing Paymob webhook:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
