// src/components/ui/checkout/thank-you-order-summary.tsx
import Image from "next/image";
import Link from "next/link";
import type { Order, OrderItem } from "@prisma/client";
import type { Product, ProductVariant } from "@prisma/client";
import { Package } from "lucide-react";

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
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Package className="h-5 w-5 text-secondary" />
        <h2 className="text-xl font-medium text-foreground">Order Summary</h2>
      </div>

      {/* Items List */}
      <ul
        role="list"
        className="divide-y divide-border border-y-2 border-border rounded-lg overflow-hidden"
      >
        {order.items.map((item) => (
          <li
            key={item.id}
            className="flex gap-4 p-4 bg-card hover:bg-accent/30 transition-colors duration-200"
          >
            <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border-2 border-border">
              <Image
                src={item.variant.product.imageUrl || "/placeholder.svg"}
                alt={item.variant.product.name}
                fill
                className="object-cover object-center"
                sizes="80px"
              />
            </div>
            <div className="flex flex-1 flex-col justify-between">
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  <Link
                    href={`/products/${item.variant.product.handle}`}
                    className="hover:text-primary transition-colors"
                  >
                    {item.name}
                  </Link>
                </h3>
                <p className="text-xs text-muted-foreground mt-1">Qty: {item.quantity}</p>
              </div>
              <div className="flex items-end justify-between text-sm">
                <p className="font-semibold text-primary">
                  ${((item.price * item.quantity) / 100).toFixed(2)}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Pricing Summary */}
      <dl className="space-y-3 text-sm border-2 border-border rounded-lg p-4 bg-card">
        <div className="flex items-center justify-between">
          <dt className="text-muted-foreground">Subtotal</dt>
          <dd className="font-medium text-foreground">${(subtotal / 100).toFixed(2)}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-muted-foreground">Shipping</dt>
          <dd className="font-medium text-foreground">Calculated</dd>
        </div>
        <div className="flex items-center justify-between border-t-2 border-border pt-3 text-base">
          <dt className="font-semibold text-foreground">Order Total</dt>
          <dd className="font-semibold text-primary text-xl">${(order.total / 100).toFixed(2)}</dd>
        </div>
      </dl>

      {/* Order Info */}
      <div className="bg-accent/50 border-2 border-border rounded-lg p-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Order Number:</span>
          <span className="font-semibold text-foreground">{order.orderNumber}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Order Date:</span>
          <span className="font-medium text-foreground">
            {new Date(order.createdAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Payment Status:</span>
          <span className="inline-flex items-center rounded-full bg-secondary/10 px-2 py-1 text-xs font-semibold text-secondary border border-secondary/20">
            {order.paymentStatus.replace("_", " ")}
          </span>
        </div>
      </div>

      {/* Help Section */}
      <div className="bg-primary/5 border-2 border-primary/10 rounded-lg p-4 text-center">
        <p className="text-sm font-medium text-foreground mb-2">Need Help?</p>
        <p className="text-xs text-muted-foreground mb-3">
          Our customer service team is here to assist you
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center justify-center rounded-md border-2 border-primary px-4 py-2 text-xs font-medium text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200 active:scale-95"
        >
          Contact Support
        </Link>
      </div>
    </div>
  );
}
