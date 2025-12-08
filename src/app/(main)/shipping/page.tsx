import Link from "next/link";
import { Truck, Globe, Clock } from "lucide-react";

export const metadata = {
  title: "Shipping Policy | Mepra",
};

export default function ShippingPage() {
  return (
    <div className="bg-background min-h-screen py-16">
      <div className="max-w-3xl mx-auto px-6 bg-white border border-border rounded-xl p-8 md:p-12 shadow-sm">
        <h1 className="text-3xl font-light text-foreground mb-8">Shipping Information</h1>

        <div className="prose prose-stone max-w-none text-muted-foreground">
          <p className="lead text-lg">
            Mepra provides worldwide shipping for all our collections. We take great care in
            packaging your items to ensure they arrive in perfect condition.
          </p>

          <div className="grid sm:grid-cols-3 gap-6 my-10 not-prose">
            <div className="p-4 bg-gray-50 rounded-lg text-center border border-gray-100">
              <Truck className="w-6 h-6 mx-auto text-secondary mb-2" />
              <h4 className="font-medium text-foreground text-sm">Free Shipping</h4>
              <p className="text-xs mt-1">On orders over $100</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg text-center border border-gray-100">
              <Globe className="w-6 h-6 mx-auto text-secondary mb-2" />
              <h4 className="font-medium text-foreground text-sm">Global Delivery</h4>
              <p className="text-xs mt-1">We ship to 50+ countries</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg text-center border border-gray-100">
              <Clock className="w-6 h-6 mx-auto text-secondary mb-2" />
              <h4 className="font-medium text-foreground text-sm">Fast Dispatch</h4>
              <p className="text-xs mt-1">Within 24-48 hours</p>
            </div>
          </div>

          <h3 className="text-foreground font-medium text-xl mt-8 mb-4">Delivery Times</h3>
          <ul className="space-y-2 list-disc pl-5">
            <li>
              <strong>Europe:</strong> 2-4 business days
            </li>
            <li>
              <strong>North America:</strong> 3-6 business days
            </li>
            <li>
              <strong>Asia & Pacific:</strong> 5-8 business days
            </li>
            <li>
              <strong>Rest of World:</strong> 7-10 business days
            </li>
          </ul>

          <h3 className="text-foreground font-medium text-xl mt-8 mb-4">Customs & Duties</h3>
          <p>
            For orders shipped outside of the European Union, you may be subject to import duties
            and taxes which are levied once the package reaches your country. Mepra is not
            responsible for these charges.
          </p>

          <h3 className="text-foreground font-medium text-xl mt-8 mb-4">Order Tracking</h3>
          <p>
            Once your order has been dispatched, you will receive a confirmation email containing a
            tracking number. You can also view your order status in your{" "}
            <Link href="/account/orders" className="text-secondary hover:underline">
              Account Dashboard
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
