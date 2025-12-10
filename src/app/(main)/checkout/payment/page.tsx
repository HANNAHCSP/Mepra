import { redirect } from "next/navigation";
import { z } from "zod";
import { createOrder } from "@/app/actions/orders";
import { getPaymobAuthToken, createPaymobOrder, getPaymobPaymentKey } from "@/lib/paymob.actions";
import { ShippingAddressSchema } from "@/lib/zod-schemas";
import PaymentMethods from "@/components/ui/checkout/payment-methods";

type ShippingAddress = z.infer<typeof ShippingAddressSchema>;

export default async function PaymentPage() {
  try {
    // 1. Create/Get Order (This locks in the total + shipping)
    // NOTE: In a real prod app, you might want to check if an order already exists for this session
    // to avoid creating duplicates on refresh, but for now createOrder handles the basic flow.
    const order = await createOrder();
    const billingData = order.shippingAddress as ShippingAddress;

    // 2. Prepare Paymob (We do this eagerly so the card option is ready immediately)
    // If the user chooses COD, we just ignore these tokens.
    const authToken = await getPaymobAuthToken();
    const paymobOrderId = await createPaymobOrder(authToken, order.total, order.id);
    const paymentToken = await getPaymobPaymentKey(
      authToken,
      order.total,
      paymobOrderId,
      billingData
    );

    const iframeId = process.env.PAYMOB_IFRAME_ID;

    // 3. Render the Selection UI
    return (
      <div>
        <h1 className="text-xl font-medium text-foreground mb-6">Payment Method</h1>
        <PaymentMethods
          paymentToken={paymentToken}
          iframeId={iframeId}
          orderId={order.id}
          orderTotal={order.total}
        />
      </div>
    );
  } catch (error) {
    console.error("Failed to prepare payment:", error);
    redirect("/cart?error=payment_setup_failed");
  }
}
