"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Resend } from "resend";
import ShippingUpdateEmail from "@/components/ui/email/shipping-update";

const resend = new Resend(process.env.RESEND_API_KEY);

const FulfillmentSchema = z.object({
  orderId: z.string(),
  carrier: z.string().min(1, "Carrier is required"),
  trackingNumber: z.string().min(1, "Tracking number is required"),
});

export async function fulfillOrderAction(
  prevState: { success?: boolean; message?: string },
  formData: FormData
) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin") {
    return { success: false, message: "Unauthorized" };
  }

  const parsed = FulfillmentSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return { success: false, message: "Invalid data" };
  }

  const { orderId, carrier, trackingNumber } = parsed.data;

  try {
    // 1. Update Order in DB
    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "SHIPPED",
        carrier,
        trackingNumber,
        shippedAt: new Date(),
      },
      include: { user: true }, // To get name if available
    });

    // 2. Determine Customer Name (Fallback logic similar to other emails)
    let customerName = "Customer";
    if (order.user?.name) {
      customerName = order.user.name;
    } else {
      // Try to parse from shipping address JSON if needed
      const addr = order.shippingAddress as Record<string, unknown>;
      if (typeof addr === "object" && addr !== null && "firstName" in addr) {
        customerName = addr.firstName as string;
      }
    }

    // 3. Send Email
    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: "Mepra Updates <onboarding@resend.dev>",
        to: order.customerEmail,
        subject: `Order #${order.orderNumber} Shipped`,
        react: ShippingUpdateEmail({
          orderNumber: order.orderNumber,
          customerName,
          carrier,
          trackingNumber,
          // You could generate a real link based on carrier here if you wanted
          trackingUrl: `https://www.google.com/search?q=${carrier}+tracking+${trackingNumber}`,
        }),
      });
    }

    revalidatePath(`/admin/orders/${orderId}`);
    return { success: true, message: "Order marked as shipped & email sent." };
  } catch (error) {
    console.error("Fulfillment Error:", error);
    return { success: false, message: "Failed to fulfill order." };
  }
}
