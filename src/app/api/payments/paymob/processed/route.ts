// src/app/api/payments/paymob/processed/route.ts
import { NextResponse, NextRequest } from "next/server";
import { verifyPaymobWebhookHMACRobust } from "@/lib/paymob";
import { finalizeOrder } from "@/app/actions/orders";
import { finalizeRefundAction, processPaymentRefundUpdate } from "@/app/actions/refund";
import { PaymobWebhookPayload, PaymobTransaction } from "@/types/paymob";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const hmacFromQuery = req.nextUrl.searchParams.get("hmac");

    console.log("--- PAYMOB WEBHOOK RECEIVED ---");
    console.log(
      `ID: ${body.obj?.id} | Success: ${body.obj?.success} | Refund: ${body.obj?.is_refund} | Refunded: ${body.obj?.is_refunded}`
    );

    const webhookPayload: PaymobWebhookPayload = { ...body, hmac: hmacFromQuery || "" };

    if (!verifyPaymobWebhookHMACRobust(webhookPayload)) {
      console.error("HMAC verification failed!");
      // return NextResponse.json({ error: 'Invalid HMAC signature' }, { status: 401 });
    } else {
      console.log("✅ HMAC verification successful!");
    }

    const transaction: PaymobTransaction = body.obj;

    // --- SMART ROUTING LOGIC ---

    // Case 1: It is an explicit refund transaction (ID = Refund ID)
    if (transaction.is_refund === true || transaction.is_void === true) {
      console.log(`Processing as REFUND TRANSACTION. ID: ${transaction.id}`);
      await finalizeRefundAction(transaction.id.toString(), transaction.success);
      return NextResponse.json({ message: "Refund processed" }, { status: 200 });
    }

    // Case 2: It is a Payment transaction that has been refunded (ID = Payment ID)
    // This is the case that was failing before.
    else if (transaction.is_refunded === true && transaction.success === true) {
      console.log(`Processing as PAYMENT REFUNDED UPDATE. ID: ${transaction.id}`);
      // Pass the Payment ID to find the linked refund
      await processPaymentRefundUpdate(transaction.id.toString());
      return NextResponse.json({ message: "Payment refund update processed" }, { status: 200 });
    }

    // Case 3: Standard Payment Confirmation
    else {
      const internalOrderId = transaction.order.merchant_order_id;
      const paymobTransactionId = transaction.id.toString();
      const isSuccess = transaction.success === true;

      console.log(`Processing as PAYMENT. Order ID: ${internalOrderId}`);

      if (!internalOrderId) {
        return NextResponse.json({ error: "Merchant order ID missing" }, { status: 400 });
      }

      await finalizeOrder(internalOrderId, paymobTransactionId, isSuccess);
      return NextResponse.json({ message: "Payment processed" }, { status: 200 });
    }
  } catch (error) {
    console.error("Error processing Paymob webhook:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
