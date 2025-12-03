// src/app/(main)/cart/page.tsx
import { getCart } from "@/app/actions/cart";
import Link from "next/link";
import CartItem from "@/components/ui/cart/cart-item";
import { CartItemWithProduct } from "@/types/cart";
import CheckoutButton from "@/components/ui/cart/checkout-button";
import { Alert } from "@/components/ui/alert";
import { Shield, Truck, RotateCcw } from "lucide-react";

export default async function CartPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const cart = await getCart();

  const subtotal =
    cart?.items.reduce((acc, item) => acc + item.quantity * item.variant.price, 0) ?? 0;

  const itemCount = cart?.items.reduce((acc, item) => acc + item.quantity, 0) ?? 0;

  // Handle Error Messages from Redirects
  const errorType = typeof searchParams.error === "string" ? searchParams.error : null;
  let errorMessage = null;

  if (errorType === "payment_failed") {
    errorMessage = "Your payment could not be processed. Please try again or use a different card.";
  } else if (errorType === "out_of_stock") {
    errorMessage = "Some items in your cart are no longer available.";
  } else if (errorType === "payment_setup_failed") {
    errorMessage =
      "We encountered an issue setting up the payment provider. Please try again later.";
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 className="text-4xl font-light tracking-tight text-foreground">Shopping Cart</h1>

        {/* Trust Signals Bar */}
        <div className="flex flex-wrap items-center justify-center gap-6 lg:gap-8 py-6 text-sm text-muted-foreground border-y border-border my-8">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-secondary flex-shrink-0" />
            <span className="font-medium">Secure Checkout</span>
          </div>
          <div className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-secondary flex-shrink-0" />
            <span className="font-medium">Free Shipping Over $100</span>
          </div>
          <div className="flex items-center gap-2">
            <RotateCcw className="h-5 w-5 text-secondary flex-shrink-0" />
            <span className="font-medium">30-Day Returns</span>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-6">
            <Alert variant="destructive" title="There was a problem" message={errorMessage} />
          </div>
        )}

        <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          <section aria-labelledby="cart-heading" className="lg:col-span-7">
            <h2 id="cart-heading" className="sr-only">
              Items in your shopping cart
            </h2>

            <ul
              role="list"
              className="divide-y divide-border border-b border-t border-border rounded-lg overflow-hidden"
            >
              {cart && cart.items.length > 0 ? (
                cart.items.map((item) => (
                  <CartItem key={item.id} item={item as CartItemWithProduct} />
                ))
              ) : (
                <li className="py-24 text-center bg-card">
                  <p className="text-muted-foreground text-lg mb-4">Your cart is empty.</p>
                  <Link
                    href="/products"
                    className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 hover:shadow-md transition-all duration-200 active:scale-[0.98]"
                  >
                    Start Shopping →
                  </Link>
                </li>
              )}
            </ul>
          </section>

          {/* Order summary */}
          {cart && cart.items.length > 0 && (
            <section
              aria-labelledby="summary-heading"
              className="mt-16 rounded-lg bg-card px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8 shadow-sm border-2 border-border sticky top-4"
            >
              <h2 id="summary-heading" className="text-xl font-medium text-foreground mb-6">
                Order Summary
              </h2>

              <dl className="space-y-4">
                <div className="flex items-center justify-between text-base">
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd className="font-semibold text-foreground">${(subtotal / 100).toFixed(2)}</dd>
                </div>
                <div className="flex items-center justify-between border-t border-border pt-4 text-lg">
                  <dt className="font-semibold text-foreground">Order total</dt>
                  <dd className="font-semibold text-primary text-2xl">
                    ${(subtotal / 100).toFixed(2)}
                  </dd>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Shipping and taxes calculated at checkout.
                </p>
              </dl>

              <div className="mt-6">
                <CheckoutButton itemCount={itemCount} />
              </div>
              <div className="mt-6 text-center text-sm">
                <p className="text-muted-foreground">
                  or{" "}
                  <Link
                    href="/products"
                    className="font-medium text-secondary hover:text-primary transition-colors"
                  >
                    Continue Shopping
                    <span aria-hidden="true"> →</span>
                  </Link>
                </p>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
