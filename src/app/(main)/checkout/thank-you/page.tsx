// src/app/(main)/checkout/thank-you/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import UpgradeAccountCard from "@/components/ui/checkout/upgrade-account-card";

async function getOrder(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });
  return order;
}

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: { orderId: string };
}) {
  const { orderId } = searchParams;
  if (!orderId) {
    return notFound();
  }

  const order = await getOrder(orderId);
  if (!order) {
    return notFound();
  }

  // A guest order is one that doesn't have a userId
  const isGuestOrder = !order.userId;

  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold text-gray-900">Thank you for your order!</h1>
      <p className="mt-2 text-gray-600">
        Your order #{order.orderNumber} has been placed and a confirmation has been sent to your email.
      </p>
      
      {/* Conditionally render the upgrade card for guest users */}
      {isGuestOrder && (
        <UpgradeAccountCard orderId={order.id} customerEmail={order.customerEmail} />
      )}
      
      <div className="mt-8">
        <Link 
          href="/products" 
          className="text-indigo-600 hover:text-indigo-500 font-medium"
        >
          Continue Shopping &rarr;
        </Link>
      </div>
    </div>
  );
}