import { Resend } from "resend";
import { Order, OrderItem } from "@prisma/client";
import { render } from "@react-email/render";
import { ShippingAddressSchema } from "@/lib/zod-schemas";

// Import your email components
import { OrderConfirmationEmail } from "@/components/ui/email/order-confirmation";
import { RefundStatusEmail } from "@/components/ui/email/refund-status";
import { ResetPasswordEmail } from "@/components/ui/email/reset-password";
import { GuestUpgradeEmail } from "@/components/ui/email/guest-upgrade";
import { ContactSubmissionEmail } from "@/components/ui/email/contact-submission"; // Ensure this is imported

const resend = new Resend(process.env.RESEND_API_KEY);

type OrderWithItems = Order & {
  items: OrderItem[];
};

export async function sendOrderConfirmationEmail(order: OrderWithItems): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    console.warn("⚠️ RESEND_API_KEY is missing. Email simulation:");
    console.log(`To: ${order.customerEmail}`);
    return;
  }

  try {
    // Safely parse the shipping address
    const rawAddress =
      typeof order.shippingAddress === "string"
        ? JSON.parse(order.shippingAddress)
        : order.shippingAddress;

    const parseResult = ShippingAddressSchema.safeParse(rawAddress);

    if (!parseResult.success) {
      console.error("Invalid shipping address format in order:", order.id);
      return;
    }

    const shippingAddress = parseResult.data;

    const emailHtml = await render(
      <OrderConfirmationEmail
        orderNumber={order.orderNumber}
        customerName={shippingAddress.firstName || "Customer"}
        items={order.items.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        }))}
        total={order.total}
        shippingAddress={{
          street: shippingAddress.address,
          city: shippingAddress.city,
          zipCode: shippingAddress.zipCode,
          country: shippingAddress.country,
        }}
      />
    );

    await resend.emails.send({
      from: "Mepra Store <onboarding@resend.dev>",
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
    await resend.emails.send({
      from: "Mepra System <onboarding@resend.dev>",
      to: "hannahelhaddad3@gmail.com", // Updated Admin Email
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
      <RefundStatusEmail
        orderNumber={data.orderNumber}
        customerName={data.customerName}
        amount={data.amount}
        status={data.status}
      />
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

export async function sendPasswordResetEmail(email: string, token: string): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    console.log(
      `[DEV EMAIL] Password Reset Link: ${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`
    );
    return;
  }

  try {
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

    const emailHtml = await render(<ResetPasswordEmail resetLink={resetLink} />);

    await resend.emails.send({
      from: "Mepra Support <onboarding@resend.dev>",
      to: email,
      subject: "Reset your password",
      html: emailHtml,
    });

    console.log(`✅ Password reset email sent to ${email}`);
  } catch (error) {
    console.error("❌ Failed to send password reset email:", error);
    throw new Error("Failed to send email provider request");
  }
}

export async function sendGuestUpgradeEmail(
  email: string,
  token: string,
  orderNumber: string
): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    console.log(
      `[DEV EMAIL] Upgrade Link for ${email}: ${process.env.NEXT_PUBLIC_APP_URL}/upgrade-account?token=${token}`
    );
    return;
  }

  try {
    const upgradeLink = `${process.env.NEXT_PUBLIC_APP_URL}/upgrade-account?token=${token}`;

    const emailHtml = await render(
      <GuestUpgradeEmail upgradeLink={upgradeLink} orderNumber={orderNumber} />
    );

    await resend.emails.send({
      from: "Mepra Support <onboarding@resend.dev>",
      to: email,
      subject: `Action Required: Save Order #${orderNumber}`,
      html: emailHtml,
    });

    console.log(`✅ Upgrade email sent to ${email}`);
  } catch (error) {
    console.error("❌ Failed to send upgrade email:", error);
  }
}

// --- CONTACT EMAIL FUNCTION ---
export async function sendContactEmail(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    console.log(`[DEV EMAIL] Contact Form from ${data.email}: ${data.message}`);
    return;
  }

  try {
    const emailHtml = await render(
      <ContactSubmissionEmail
        name={data.name}
        email={data.email}
        subject={data.subject}
        message={data.message}
      />
    );

    await resend.emails.send({
      from: "Mepra System <onboarding@resend.dev>",
      to: "hannahelhaddad3@gmail.com", // Updated Admin Email
      replyTo: data.email,
      subject: `[Contact Form] ${data.subject}`,
      html: emailHtml,
    });

    console.log(`✅ Contact email forwarded to admin.`);
  } catch (error) {
    console.error("❌ Failed to forward contact email:", error);
    throw new Error("Failed to send message.");
  }
}
