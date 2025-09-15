// src/app/(main)/checkout/thank-you/page.tsx
import Link from "next/link";

export default function ThankYouPage() {
  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold text-gray-900">Thank you for your order!</h1>
      <p className="mt-2 text-gray-600">
        Your order #12345 has been placed and a confirmation has been sent to your email.
      </p>
      
      {/* We will add the "Upgrade Account" card here later */}
      
      <div className="mt-8">
        <Link 
          href="/products" 
          className="text-indigo-600 hover:text-indigo-500 font-medium"
        >
          Continue Shopping &rarr;
        </Link>
      </div>
    </div>
  );
}