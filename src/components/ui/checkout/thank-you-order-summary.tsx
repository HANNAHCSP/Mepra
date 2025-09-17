// src/components/ui/checkout/thank-you-order-summary.tsx
import Image from 'next/image';
import Link from 'next/link';
import type { Order, OrderItem } from '@prisma/client';
import type { Product, ProductVariant } from '@prisma/client';

// Define a more specific type for the order object passed to this component
type OrderItemWithDetails = OrderItem & {
  variant: ProductVariant & {
    product: Product;
  };
};

type OrderWithDetails = Order & {
  items: OrderItemWithDetails[];
};


export default function ThankYouOrderSummary({ order }: { order: OrderWithDetails }) {
  const subtotal = order.items.reduce((acc, item) => acc + item.quantity * item.price, 0);

  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900">Order summary</h2>

      <ul role="list" className="mt-6 divide-y divide-gray-200 border-b border-t border-gray-200">
        {order.items.map((item) => (
          <li key={item.id} className="flex space-x-4 py-6">
            <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
              <Image
                src={item.variant.product.imageUrl || "/placeholder.svg"}
                alt={item.variant.product.name}
                fill
                className="object-cover object-center"
                sizes="96px"
              />
            </div>
            <div className="flex flex-1 flex-col justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  <Link href={`/products/${item.variant.product.handle}`}>
                    {item.name}
                  </Link>
                </h3>
              </div>
              <div className="flex items-end justify-between text-sm">
                <p className="text-gray-500">Qty {item.quantity}</p>
                <p className="font-medium text-gray-900">
                  ${((item.price * item.quantity) / 100).toFixed(2)}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <dl className="mt-6 space-y-2 text-sm text-gray-600">
        <div className="flex items-center justify-between">
          <dt>Subtotal</dt>
          <dd className="font-medium text-gray-900">${(subtotal / 100).toFixed(2)}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt>Shipping</dt>
          <dd className="font-medium text-gray-900">TBD</dd>
        </div>
        <div className="flex items-center justify-between border-t border-gray-200 pt-4 text-base font-medium text-gray-900">
          <dt>Order total</dt>
          <dd>${(order.total / 100).toFixed(2)}</dd>
        </div>
      </dl>
    </div>
  );
}