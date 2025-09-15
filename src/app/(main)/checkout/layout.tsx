// src/app/(main)/checkout/layout.tsx
import Link from "next/link";
import Image from "next/image";
import { getCart } from "@/app/actions/cart";
import { Lock } from "lucide-react";

export default async function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cart = await getCart();
  const subtotal = cart?.items.reduce((acc, item) => acc + item.quantity * item.variant.price, 0) ?? 0;

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 lg:grid lg:grid-cols-2">
      {/* Main content */}
      <main className="flex-grow px-4 pb-24 pt-8 sm:px-6 lg:col-start-1 lg:row-start-1 lg:bg-white lg:px-8 lg:pb-16 lg:pt-16">
        <div className="mx-auto max-w-lg">
          <Link href="/" className="mb-8 inline-block text-xl font-bold tracking-tight">
            MEPRA
          </Link>
          {children}
        </div>
      </main>

      {/* Order summary */}
      <aside className="bg-gray-100 px-4 py-8 sm:px-6 sm:py-10 lg:col-start-2 lg:row-start-1 lg:px-8">
        <div className="mx-auto max-w-lg">
          <h2 className="text-lg font-medium text-gray-900">Order summary</h2>

          <ul role="list" className="mt-6 divide-y divide-gray-200 border-b border-t border-gray-200">
            {cart?.items.map((item) => (
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
                        {item.variant.product.name}
                      </Link>
                    </h3>
                  </div>
                  <div className="flex items-end justify-between text-sm">
                    <p className="text-gray-500">Qty {item.quantity}</p>
                    <p className="font-medium text-gray-900">
                      ${((item.variant.price * item.quantity) / 100).toFixed(2)}
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
              <dd>${(subtotal / 100).toFixed(2)}</dd>
            </div>
          </dl>

          <div className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-500">
            <Lock className="h-4 w-4" />
            <span>Secure SSL checkout</span>
          </div>
        </div>
      </aside>
    </div>
  );
}