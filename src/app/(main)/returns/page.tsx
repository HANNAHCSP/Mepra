import Link from "next/link";
import { RotateCcw, PackageCheck, CreditCard, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Return Policy | Mepra",
  description: "Information about Mepra's return policy, exchanges, and refunds.",
};

export default function ReturnsPage() {
  return (
    <div className="bg-background min-h-screen py-16">
      <div className="max-w-3xl mx-auto px-6 bg-white border border-border rounded-xl p-8 md:p-12 shadow-sm">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-light text-foreground mb-4">Return Policy</h1>
          <p className="text-muted-foreground">
            We want you to love your Mepra experience. If you are not completely satisfied, we are
            here to help.
          </p>
        </div>

        {/* Key Highlights Grid */}
        <div className="grid sm:grid-cols-3 gap-6 mb-12 not-prose">
          <div className="p-6 bg-gray-50 rounded-lg text-center border border-gray-100 flex flex-col items-center">
            <RotateCcw className="w-8 h-8 text-secondary mb-3" />
            <h4 className="font-medium text-foreground text-sm">30-Day Window</h4>
            <p className="text-xs text-muted-foreground mt-1">From delivery date</p>
          </div>
          <div className="p-6 bg-gray-50 rounded-lg text-center border border-gray-100 flex flex-col items-center">
            <PackageCheck className="w-8 h-8 text-secondary mb-3" />
            <h4 className="font-medium text-foreground text-sm">Easy Returns</h4>
            <p className="text-xs text-muted-foreground mt-1">Pre-paid labels available</p>
          </div>
          <div className="p-6 bg-gray-50 rounded-lg text-center border border-gray-100 flex flex-col items-center">
            <CreditCard className="w-8 h-8 text-secondary mb-3" />
            <h4 className="font-medium text-foreground text-sm">Fast Refunds</h4>
            <p className="text-xs text-muted-foreground mt-1">Processed in 5-7 days</p>
          </div>
        </div>

        <div className="prose prose-stone max-w-none text-muted-foreground">
          <h3 className="text-foreground font-medium text-xl mt-8 mb-4">Return Eligibility</h3>
          <p>
            To be eligible for a return, your item must be in the same condition that you received
            it: unworn or unused, with tags, and in its original packaging. You’ll also need the
            receipt or proof of purchase.
          </p>
          <p>
            Certain types of items cannot be returned, like custom products (such as special orders
            or personalized items). Please get in touch if you have questions or concerns about your
            specific item.
          </p>

          <h3 className="text-foreground font-medium text-xl mt-8 mb-4">
            How to Initiate a Return
          </h3>
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              Log in to your account and visit the{" "}
              <Link href="/account/orders" className="text-secondary hover:underline">
                Orders
              </Link>{" "}
              page.
            </li>
            <li>Select the order containing the item you wish to return.</li>
            <li>
              Click the &quot;Request Refund&quot; button if your order status is
              &quot;Delivered&quot;.
            </li>
            <li>Follow the instructions to print your shipping label.</li>
          </ol>

          <div className="bg-secondary/5 border border-secondary/20 p-4 rounded-lg flex gap-3 mt-6">
            <AlertCircle className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
            <div className="text-sm text-foreground">
              <strong>Note:</strong> Items sent back to us without first requesting a return will
              not be accepted.
            </div>
          </div>

          <h3 className="text-foreground font-medium text-xl mt-8 mb-4">Refunds</h3>
          <p>
            We will notify you once we’ve received and inspected your return, and let you know if
            the refund was approved or not. If approved, you’ll be automatically refunded on your
            original payment method within 10 business days. Please remember it can take some time
            for your bank or credit card company to process and post the refund too.
          </p>

          <h3 className="text-foreground font-medium text-xl mt-8 mb-4">Damages and Issues</h3>
          <p>
            Please inspect your order upon reception and contact us immediately if the item is
            defective, damaged or if you receive the wrong item, so that we can evaluate the issue
            and make it right.
          </p>
        </div>

        <div className="mt-10 pt-8 border-t border-border text-center">
          <p className="mb-4 text-sm text-muted-foreground">Have more questions?</p>
          <Button asChild variant="outline">
            <Link href="/contact">Contact Support</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
