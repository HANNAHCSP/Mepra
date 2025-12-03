// src/lib/email.ts
import { Resend } from "resend";
import { Order, OrderItem } from "@prisma/client";
import { OrderConfirmationEmail } from "@/components/ui/email/order-confirmation";
import { RefundStatusEmail } from "@/components/ui/email/refund-status";
import { render } from "@react-email/render";
import { ShippingAddressSchema } from "@/lib/zod-schemas";

const resend = new Resend(process.env.RESEND_API_KEY);

// Define a type that includes the items, as standard Prisma Order doesn't have them
type OrderWithItems = Order & {
  items: OrderItem[];
};

export async function sendOrderConfirmationEmail(order: OrderWithItems): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    console.warn("⚠️ RESEND_API_KEY is missing. Email simulation:");
    console.log(`To: ${order.customerEmail}`);
    console.log(`Subject: Order #${order.orderNumber} Confirmed`);
    return;
  }

  try {
    // 1. Safely parse the JSON from the database
    const rawAddress =
      typeof order.shippingAddress === "string"
        ? JSON.parse(order.shippingAddress)
        : order.shippingAddress;

    // 2. Validate it against your schema to get proper types (removes 'any')
    const parseResult = ShippingAddressSchema.safeParse(rawAddress);

    if (!parseResult.success) {
      console.error("Invalid shipping address format in order:", order.id);
      return;
    }

    const shippingAddress = parseResult.data;

    // Render the React template to HTML
    const emailHtml = await render(
      OrderConfirmationEmail({
        orderNumber: order.orderNumber,
        customerName: shippingAddress.firstName || "Customer",
        items: order.items.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        total: order.total,
        shippingAddress: {
          street: shippingAddress.address,
          city: shippingAddress.city,
          zipCode: shippingAddress.zipCode,
          country: shippingAddress.country,
        },
      })
    );

    // Send the email
    await resend.emails.send({
      from: "Mepra Store <onboarding@resend.dev>", // Use your verified domain in production
      to: order.customerEmail,
      subject: `Your Mepra Order #${order.orderNumber}`,
      html: emailHtml,
    });

    console.log(`✅ Confirmation email sent to ${order.customerEmail}`);
  } catch (error) {
    console.error("❌ Failed to send confirmation email:", error);
  }
}

export async function notifyStaffOfNewOrder(order: OrderWithItems): Promise<void> {
  if (!process.env.RESEND_API_KEY) return;

  try {
    // Simple text email for staff
    await resend.emails.send({
      from: "Mepra System <onboarding@resend.dev>",
      to: "admin@mepra-store.com", // Replace with your real admin email
      subject: `🔔 New Order: ${order.orderNumber}`,
      html: `<p>New order received for <strong>$${(order.total / 100).toFixed(2)}</strong>.</p><p>Check the <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/orders/${order.id}">Admin Dashboard</a> for details.</p>`,
    });
  } catch (error) {
    console.error("Failed to notify staff:", error);
  }
}

export async function sendRefundStatusEmail(data: {
  orderNumber: string;
  customerEmail: string;
  customerName: string;
  amount: number;
  status: string;
}): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    console.log(`[DEV EMAIL] Refund update to ${data.customerEmail}: Status ${data.status}`);
    return;
  }

  try {
    const emailHtml = await render(
      RefundStatusEmail({
        orderNumber: data.orderNumber,
        customerName: data.customerName,
        amount: data.amount,
        status: data.status,
      })
    );

    await resend.emails.send({
      from: "Mepra Store <onboarding@resend.dev>",
      to: data.customerEmail,
      subject: `Refund Update: Order #${data.orderNumber}`,
      html: emailHtml,
    });
  } catch (error) {
    console.error("Failed to send refund status email:", error);
  }
}
