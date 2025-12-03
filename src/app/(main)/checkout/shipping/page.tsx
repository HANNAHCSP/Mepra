import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ShippingAddressSchema } from "@/lib/zod-schemas";
import { getShippingOptions } from "@/lib/shipping-rates";
import ShippingForm from "@/components/ui/checkout/shipping-form"; // Import new component

export default async function ShippingPage() {
  const cookieStore = await cookies();
  const addressCookie = cookieStore.get("shippingAddress")?.value;

  // Default to 'standard' if no cookie is set yet
  const currentMethod = cookieStore.get("shippingMethod")?.value || "standard";

  if (!addressCookie) {
    redirect("/checkout/address");
  }

  const parsedAddress = ShippingAddressSchema.safeParse(JSON.parse(addressCookie));

  if (!parsedAddress.success) {
    redirect("/checkout/address");
  }

  const { email, firstName, lastName, address, apartment, city, state, zipCode, country } =
    parsedAddress.data;

  // Dynamically calculate options based on State
  const shippingOptions = getShippingOptions(state);

  return (
    <div>
      <nav aria-label="Breadcrumb">
        <ol role="list" className="flex items-center space-x-2 text-sm">
          <li>
            <Link href="/checkout/address" className="text-muted-foreground hover:text-foreground">
              Address
            </Link>
          </li>
          <li>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </li>
          <li>
            <span className="font-medium text-primary">Shipping</span>
          </li>
          <li>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </li>
          <li>
            <span className="text-muted-foreground">Payment</span>
          </li>
        </ol>
      </nav>

      <div className="mt-8">
        <div className="rounded-lg border border-border bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-base font-medium text-foreground">Ship To</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {firstName} {lastName} <br />
                {address}, {apartment ? `${apartment}, ` : ""} <br />
                {city}, {state} {zipCode} <br />
                {country}
              </p>
            </div>
            <Link
              href="/checkout/address"
              className="text-sm font-medium text-secondary hover:text-primary"
            >
              Change
            </Link>
          </div>
          <div className="mt-4 border-t border-border pt-4">
            <h3 className="text-base font-medium text-foreground">Contact</h3>
            <p className="mt-1 text-sm text-muted-foreground">{email}</p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-medium text-foreground">Shipping method</h2>
        {/* Render Client Component */}
        <ShippingForm options={shippingOptions} currentMethod={currentMethod} />
      </div>
    </div>
  );
}
