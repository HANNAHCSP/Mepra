// src/app/(admin)/admin/orders/[orderId]/page.tsx
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { z } from 'zod';
import { ShippingAddressSchema } from '@/lib/zod-schemas';

// This allows us to safely parse the JSON from the database
type ShippingAddress = z.infer<typeof ShippingAddressSchema>;

export default async function AdminOrderDetailsPage({ params }: { params: { orderId: string } }) {
  const order = await prisma.order.findUnique({
    where: { id: params.orderId },
    include: {
      items: {
        include: {
          variant: {
            include: {
              product: true,
            },
          },
        },
      },
      user: true, // Include the user details if they exist
      payments: { // Include payment details
        orderBy: {
          createdAt: 'desc'
        }
      }
    },
  });

  if (!order) {
    notFound();
  }

  const shippingAddress = order.shippingAddress as ShippingAddress;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-2xl font-bold">Order #{order.orderNumber}</h1>
            <p className="text-sm text-gray-500">
              Placed on {new Date(order.createdAt).toLocaleString()}
            </p>
        </div>
        <Badge status={order.status}>{order.status}</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content (Items List) */}
        <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold p-4 border-b">Items Ordered</h2>
                <ul className="divide-y">
                {order.items.map((item) => (
                    <li key={item.id} className="flex items-center gap-4 p-4">
                    <Image
                        src={item.variant.product.imageUrl ?? '/placeholder.svg'}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="h-16 w-16 rounded-md object-cover border"
                    />
                    <div className="flex-grow">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">SKU: {item.variant.sku ?? 'N/A'}</p>
                        <p className="text-sm text-gray-500">
                        {item.quantity} x ${(item.price / 100).toFixed(2)}
                        </p>
                    </div>
                    <p className="text-sm font-medium">
                        ${(item.price * item.quantity / 100).toFixed(2)}
                    </p>
                    </li>
                ))}
                </ul>
            </div>
        </div>

        {/* Sidebar (Details) */}
        <div className="space-y-6">
            <div className="bg-white border rounded-lg shadow-sm p-4">
                <h2 className="text-lg font-semibold mb-4">Customer Details</h2>
                <div className="text-sm text-gray-700 space-y-1">
                    <p className="font-medium">{order.user?.name ?? `${shippingAddress.firstName} ${shippingAddress.lastName}`}</p>
                    <p>{order.customerEmail}</p>
                    {shippingAddress.phone && <p>{shippingAddress.phone}</p>}
                </div>
            </div>

             <div className="bg-white border rounded-lg shadow-sm p-4">
                <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>
                <div className="text-sm text-gray-700 space-y-1">
                    <p>{shippingAddress.address}</p>
                    {shippingAddress.apartment && <p>{shippingAddress.apartment}</p>}
                    <p>{`${shippingAddress.city}, ${shippingAddress.zipCode}`}</p>
                    <p>{shippingAddress.country}</p>
                </div>
            </div>

            <div className="bg-white border rounded-lg shadow-sm p-4">
                <h2 className="text-lg font-semibold mb-4">Payment Information</h2>
                <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <dt className="text-gray-600">Payment Status</dt>
                        <dd className="font-medium capitalize">{order.paymentStatus.toLowerCase()}</dd>
                    </div>
                     {order.payments[0] && (
                        <>
                        <div className="flex justify-between">
                            <dt className="text-gray-600">Provider</dt>
                            <dd className="capitalize">{order.payments[0].provider}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-gray-600">Transaction ID</dt>
                            <dd>{order.payments[0].providerRef}</dd>
                        </div>
                        </>
                    )}
                    <div className="flex justify-between font-bold text-base pt-2 border-t">
                        <dt>Total Paid</dt>
                        <dd>${(order.total / 100).toFixed(2)}</dd>
                    </div>
                </dl>
            </div>
        </div>
      </div>
    </div>
  );
}