import Link from "next/link";
import Image from "next/image";
import { getCart } from "@/app/actions/cart";
import { Lock } from "lucide-react";
import { cookies } from "next/headers";
import { ShippingAddressSchema } from "@/lib/zod-schemas";
import { getShippingOptions } from "@/lib/shipping-rates";

export default async function CheckoutLayout({ children }: { children: React.ReactNode }) {
  const cart = await getCart();
  const subtotal =
    cart?.items.reduce((acc, item) => acc + item.quantity * item.variant.price, 0) ?? 0;

  // --- NEW LOGIC: Calculate Shipping ---
  const cookieStore = await cookies();
  const addressCookie = cookieStore.get("shippingAddress")?.value;
  const methodCookie = cookieStore.get("shippingMethod")?.value || "standard";

  let shippingCost = 0;
  let shippingLabel = "Calculated at next step";

  if (addressCookie) {
    try {
      const parsed = ShippingAddressSchema.safeParse(JSON.parse(addressCookie));
      if (parsed.success) {
        const state = parsed.data.state;
        const options = getShippingOptions(state);
        const selected = options.find((opt) => opt.id === methodCookie) || options[0];

        if (selected) {
          shippingCost = selected.priceCents;
          shippingLabel = `$${(shippingCost / 100).toFixed(2)}`;
        }
      }
    } catch (e) {
      // Ignore parse errors, default to 0
    }
  }
  // -------------------------------------

  const total = subtotal + shippingCost;

  return (
    <div className="flex min-h-screen flex-col bg-background lg:grid lg:grid-cols-2">
      {/* Main content */}
      <main className="flex-grow px-4 pb-24 pt-8 sm:px-6 lg:col-start-1 lg:row-start-1 lg:bg-white lg:px-8 lg:pb-16 lg:pt-16">
        <div className="mx-auto max-w-lg">
          <Link
            href="/"
            className="mb-8 inline-block text-xl font-bold tracking-tight text-foreground"
          >
            MEPRA
          </Link>
          {children}
        </div>
      </main>

      {/* Order summary */}
      <aside className="bg-muted/30 px-4 py-8 sm:px-6 sm:py-10 lg:col-start-2 lg:row-start-1 lg:px-8 border-l border-border">
        <div className="mx-auto max-w-lg">
          <h2 className="text-lg font-medium text-foreground">Order summary</h2>

          <ul role="list" className="mt-6 divide-y divide-border border-b border-t border-border">
            {cart?.items.map((item) => (
              <li key={item.id} className="flex space-x-4 py-6">
                <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-border bg-white">
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
                    <h3 className="text-sm font-medium text-foreground">
                      <Link
                        href={`/products/${item.variant.product.handle}`}
                        className="hover:underline"
                      >
                        {item.variant.product.name}
                      </Link>
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {/* Optional: Add size display if available */}
                      {/* Size: {item.variant.attributes?.size} */}
                    </p>
                  </div>
                  <div className="flex items-end justify-between text-sm">
                    <p className="text-muted-foreground">Qty {item.quantity}</p>
                    <p className="font-medium text-foreground">
                      ${((item.variant.price * item.quantity) / 100).toFixed(2)}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <dl className="mt-6 space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center justify-between">
              <dt>Subtotal</dt>
              <dd className="font-medium text-foreground">${(subtotal / 100).toFixed(2)}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt>Shipping</dt>
              <dd className="font-medium text-foreground">{shippingLabel}</dd>
            </div>
            <div className="flex items-center justify-between border-t border-border pt-4 text-base font-medium text-foreground">
              <dt>Order total</dt>
              <dd>${(total / 100).toFixed(2)}</dd>
            </div>
          </dl>

          <div className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Lock className="h-4 w-4" />
            <span>Secure SSL checkout</span>
          </div>
        </div>
      </aside>
    </div>
  );
}
