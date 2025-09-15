// src/app/(main)/checkout/payment/page.tsx
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function PaymentPage() {
  return (
     <div>
        <nav aria-label="Breadcrumb">
            <ol role="list" className="flex items-center space-x-2 text-sm">
            <li>
                <Link href="/checkout/address" className="text-gray-500 hover:text-gray-700">Address</Link>
            </li>
            <li>
                <ChevronRight className="h-5 w-5 text-gray-300" />
            </li>
            <li>
                <Link href="/checkout/shipping" className="text-gray-500 hover:text-gray-700">Shipping</Link>
            </li>
             <li>
                <ChevronRight className="h-5 w-5 text-gray-300" />
            </li>
            <li>
                <span className="font-medium text-indigo-600">Payment</span>
            </li>
            </ol>
        </nav>
        <div className="mt-8 rounded-md border border-dashed border-gray-300 p-8 text-center">
             <p className="text-gray-500">Payment provider form (e.g., Stripe) will go here.</p>
        </div>
         <div className="mt-10 border-t border-gray-200 pt-6">
            <Link
             href="/checkout/thank-you"
             className="w-full rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex justify-center"
            >
             Pay now
            </Link>
      </div>
    </div>
  )
}