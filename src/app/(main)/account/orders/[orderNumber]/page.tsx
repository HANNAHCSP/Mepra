import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { z } from "zod";
import { ShippingAddressSchema } from "@/lib/zod-schemas";
import RefundSection from "@/components/ui/account/refund-section"; // Updated import

type ShippingAddress = z.infer<typeof ShippingAddressSchema>;

export default async function OrderDetailsPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/signin");
  }
  const { orderNumber } = await params;
  // Use `findFirst` to query by a non-unique field securely.
  const order = await prisma.order.findFirst({
    where: {
      orderNumber: orderNumber, // Now correctly matches the folder name
      userId: session.user.id, // Ensures the user owns this order
    },
    include: {
      items: {
        include: {
          variant: { include: { product: true } },
        },
      },
      payments: {
        include: {
          refunds: true,
        },
      },
      refunds: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!order) {
    notFound();
  }

  const shippingAddress = order.shippingAddress as ShippingAddress;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Order Details</h1>
        <p className="text-gray-500">
          Order #{order.orderNumber} placed on {new Date(order.createdAt).toLocaleDateString()}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Shipping Address</h2>
          <div className="text-sm text-gray-600">
            <p>{`${shippingAddress.firstName} ${shippingAddress.lastName}`}</p>
            <p>{shippingAddress.address}</p>
            {shippingAddress.apartment && <p>{shippingAddress.apartment}</p>}
            <p>{`${shippingAddress.city}, ${shippingAddress.zipCode}`}</p>
            <p>{shippingAddress.country}</p>
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Order Summary</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-600">Status</dt>
              <dd>
                <Badge status={order.status}>{order.status}</Badge>
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">Payment Status</dt>
              <dd className="capitalize">{order.paymentStatus.replace(/_/g, " ").toLowerCase()}</dd>
            </div>
            <div className="flex justify-between font-medium">
              <dt>Total</dt>
              <dd>${(order.total / 100).toFixed(2)}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold">Items in this Order</h2>
        <ul className="mt-4 divide-y border rounded-lg">
          {order.items.map((item) => (
            <li key={item.id} className="flex items-center gap-4 p-4">
              <Image
                src={item.variant.product.imageUrl ?? "/placeholder.svg"}
                alt={item.name}
                width={64}
                height={64}
                className="h-16 w-16 rounded-md object-cover"
              />
              <div className="flex-grow">
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
              </div>
              <p className="text-sm font-medium">${(item.price / 100).toFixed(2)}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Render the unified refund section */}
      <RefundSection order={order} />
    </div>
  );
}
