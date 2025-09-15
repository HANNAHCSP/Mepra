// src/app/(main)/checkout/shipping/page.tsx
import Link from "next/link";
import { ChevronRight, Home, Truck } from "lucide-react";
import { cookies } from 'next/headers';
import { redirect } from "next/navigation";
import { ShippingAddressSchema } from "@/lib/zod-schemas";

export default async function ShippingPage() {
  const cookieStore = await cookies();
  const addressCookie = cookieStore.get('shippingAddress')?.value;

  if (!addressCookie) {
    redirect('/checkout/address');
  }

  const parsedAddress = ShippingAddressSchema.safeParse(JSON.parse(addressCookie));

  if (!parsedAddress.success) {
     redirect('/checkout/address');
  }
  
  const { email, firstName, lastName, address, apartment, city, zipCode, country } = parsedAddress.data;

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
                <span className="font-medium text-indigo-600">Shipping</span>
            </li>
             <li>
                <ChevronRight className="h-5 w-5 text-gray-300" />
            </li>
            <li>
                <span className="text-gray-500">Payment</span>
            </li>
            </ol>
        </nav>

        <div className="mt-8">
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="text-base font-medium text-gray-700">Ship To</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            {firstName} {lastName} <br />
                            {address}, {apartment ? `${apartment}, ` : ''} <br/>
                            {city}, {zipCode} <br/>
                            {country}
                        </p>
                    </div>
                     <Link href="/checkout/address" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">Change</Link>
                </div>
                 <div className="mt-4 border-t border-gray-200 pt-4">
                     <h3 className="text-base font-medium text-gray-700">Contact</h3>
                     <p className="mt-1 text-sm text-gray-500">{email}</p>
                 </div>
            </div>
        </div>

        <div className="mt-8">
             <h2 className="text-lg font-medium text-gray-900">Shipping method</h2>
             <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between rounded-lg border border-indigo-600 bg-indigo-50 p-4">
                    <div className="flex items-center">
                        <Truck className="mr-4 h-6 w-6 text-indigo-600" />
                        <div>
                            <p className="font-medium text-indigo-900">Standard Shipping</p>
                            <p className="text-sm text-indigo-700">4-10 business days</p>
                        </div>
                    </div>
                    <p className="text-sm font-medium text-indigo-900">$5.00</p>
                </div>
                 <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4">
                     <div className="flex items-center">
                        <Home className="mr-4 h-6 w-6 text-gray-600" />
                        <div>
                            <p className="font-medium text-gray-900">In-Store Pickup</p>
                            <p className="text-sm text-gray-500">Pick up from our store</p>
                        </div>
                    </div>
                    <p className="text-sm font-medium text-gray-900">Free</p>
                 </div>
             </div>
        </div>
        
         <div className="mt-10 border-t border-gray-200 pt-6">
            <Link
             href="/checkout/payment"
             className="w-full rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex justify-center"
            >
             Continue to Payment
            </Link>
      </div>
    </div>
  )
}