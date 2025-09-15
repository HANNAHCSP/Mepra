// src/app/(main)/cart/page.tsx
import { getCart } from "@/app/actions/cart";
import Link from "next/link";
import CartItem from "@/components/ui/cart/cart-item";
import { CartItemWithProduct } from "@/types/cart";
import CheckoutButton from "@/components/ui/cart/checkout-button";

export default async function CartPage() {
  const cart = await getCart();
  const subtotal =
    cart?.items.reduce(
      (acc, item) => acc + item.quantity * item.variant.price,
      0
    ) ?? 0;

  // Calculate total number of items
  const itemCount = cart?.items.reduce((acc, item) => acc + item.quantity, 0) ?? 0;

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Shopping Cart
        </h1>
        <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          <section aria-labelledby="cart-heading" className="lg:col-span-7">
            <h2 id="cart-heading" className="sr-only">
              Items in your shopping cart
            </h2>

            <ul
              role="list"
              className="divide-y divide-gray-200 border-b border-t border-gray-200"
            >
              {cart && cart.items.length > 0 ? (
                cart.items.map((item) => (
                  <CartItem key={item.id} item={item as CartItemWithProduct} />
                ))
              ) : (
                <li className="py-6 text-center text-gray-500">
                  Your cart is empty.
                </li>
              )}
            </ul>
          </section>

          {/* Order summary */}
          <section
            aria-labelledby="summary-heading"
            className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
          >
            <h2
              id="summary-heading"
              className="text-lg font-medium text-gray-900"
            >
              Order summary
            </h2>

            <dl className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <dt className="text-sm text-gray-600">Subtotal</dt>
                <dd className="text-sm font-medium text-gray-900">
                  ${(subtotal / 100).toFixed(2)}
                </dd>
              </div>
            </dl>

            <div className="mt-6">
              {/* Pass the itemCount to the button */}
              <CheckoutButton itemCount={itemCount} />
            </div>
            <div className="mt-6 text-center text-sm">
                <p>
                  or{' '}
                  <Link href="/products" className="font-medium text-indigo-600 hover:text-indigo-500">
                    Continue Shopping
                    <span aria-hidden="true"> &rarr;</span>
                  </Link>
                </p>
              </div>
          </section>
        </div>
      </div>
    </div>
  );
}