// src/lib/email.ts
import type { Order } from "@prisma/client";

/**
 * Sends an order confirmation email to the customer.
 * This is a placeholder function. In production, you would integrate
 * a real email service like Resend, SendGrid, or Nodemailer here.
 * @param order - The complete order object from your database.
 */
export async function sendOrderConfirmationEmail(order: Order): Promise<void> {
  console.log(`✅ Sending order confirmation email to: ${order.customerEmail}`);
  console.log(`Order Number: ${order.orderNumber}`);
  console.log(`Total: ${(order.total / 100).toFixed(2)} EGP`);
  
  // Example of what you would do with a real email service (e.g., Resend):
  /*
  import { Resend } from 'resend';
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    await resend.emails.send({
      from: 'Mepra Store <sales@yourdomain.com>',
      to: order.customerEmail,
      subject: `Your Mepra Order #${order.orderNumber} is Confirmed!`,
      // You can build a React component for your email body
      // react: <OrderConfirmationEmailTemplate order={order} />,
      html: `<h1>Thank you for your order!</h1><p>Your order #${order.orderNumber} has been confirmed.</p>`
    });
    console.log("Confirmation email sent successfully.");
  } catch (error) {
    console.error("Failed to send confirmation email:", error);
  }
  */
}

/**
 * Notifies staff about a new order.
 * This could be an email, a Slack message, or another internal notification.
 */
export async function notifyStaffOfNewOrder(order: Order): Promise<void> {
    console.log(`🔔 New Order Notification!`);
    console.log(`Order #${order.orderNumber} for ${(order.total / 100).toFixed(2)} EGP was just placed.`);
    
    // Example for a Slack notification
    /*
    if (process.env.SLACK_WEBHOOK_URL) {
        await fetch(process.env.SLACK_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text: `🎉 New Order! #${order.orderNumber} for ${(order.total / 100).toFixed(2)} EGP.`
            })
        });
    }
    */
}