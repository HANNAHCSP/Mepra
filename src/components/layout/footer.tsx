// src/components/layout/footer.tsx
'use client'
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter Section */}
        <div className="mb-12 pb-8 border-b border-gray-700">
          {/* heading on its own row */}
          <h3 className="text-2xl font-light text-white italic text-center mb-6">
            Stay informed of the activities of Mepras Luxury Art
          </h3>

          {/* input + button inline */}
          <form
            className="mx-auto flex w-full max-w-md items-stretch"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="Sign up for our newsletter"
              aria-label="Email address"
              className="flex-1 px-4 py-2 bg-transparent border border-gray-600 rounded-l-md text-white placeholder-gray-400 focus:outline-none focus:border-white"
              required
            />
            <button
              type="submit"
              className="px-6 py-2 bg-transparent border border-gray-600 border-l-0 rounded-r-md text-white hover:bg-white hover:text-black transition-colors duration-200 flex items-center gap-2"
            >
              SUBSCRIBE
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </form>
        
</div>
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Customer Service */}
          <div>
            <h3 className="text-white font-semibold mb-4 uppercase tracking-wider">
              Customer Service
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/shipping" className="text-gray-300 hover:text-white transition-colors">
                  Shipping
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/locations"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Locations
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-gray-300 hover:text-white transition-colors">
                  Return policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-white transition-colors">
                  Terms and Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/disclaimer"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Disclaimer
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-white transition-colors">
                  Privacy Statement
                </Link>
              </li>
              <li>
                <Link
                  href="/accessibility"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Accessibility Statement
                </Link>
              </li>
            </ul>
          </div>

          {/* About Section */}
          <div>
            <h3 className="text-white font-semibold mb-4 uppercase tracking-wider">About Mepra</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/history" className="text-gray-300 hover:text-white transition-colors">
                  History
                </Link>
              </li>
              <li>
                <Link href="/design" className="text-gray-300 hover:text-white transition-colors">
                  Design
                </Link>
              </li>
              <li>
                <Link href="/awards" className="text-gray-300 hover:text-white transition-colors">
                  Awards
                </Link>
              </li>
              <li>
                <Link href="/catalog" className="text-gray-300 hover:text-white transition-colors">
                  Catalog
                </Link>
              </li>
              <li>
                <Link href="/press" className="text-gray-300 hover:text-white transition-colors">
                  Press
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-gray-300 hover:text-white transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="/whistleblowing"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Whistleblowing (Mepra SpA)
                </Link>
              </li>
              <li>
                <Link
                  href="/mepra-website"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Mepra.it website
                </Link>
              </li>
            </ul>
          </div>

          {/* Other Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4 uppercase tracking-wider">
              Other Categories
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/hotel-restaurant"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Hotel & restaurant
                </Link>
              </li>
              <li>
                <Link
                  href="/place-settings"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Place settings
                </Link>
              </li>
              <li>
                <Link href="/cookware" className="text-gray-300 hover:text-white transition-colors">
                  Cookware
                </Link>
              </li>
              <li>
                <Link
                  href="/serveware"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Serveware
                </Link>
              </li>
              <li>
                <Link
                  href="/coffee-tea"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Coffee and tea pots
                </Link>
              </li>
              <li>
                <Link
                  href="/ice-serving"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Ice Serving trays
                </Link>
              </li>
              <li>
                <Link
                  href="/gift-items"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Gift Items
                </Link>
              </li>
              <li>
                <Link href="/nota" className="text-gray-300 hover:text-white transition-colors">
                  Nota
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4 uppercase tracking-wider">Contact</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <p>E: info@mepra-store.com</p>
              <p>P: +31 85 303 26 59</p>
              <p>(Mo Fr 09:00 AM 5:30 PM CEST)</p>
            </div>

            {/* Social Media Icons */}
            <div className="flex space-x-3 mt-6">
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">YouTube</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Facebook</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Instagram</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987c6.62 0 11.987-5.367 11.987-11.987C24.004 5.367 18.637.001 12.017.001zM12.017 21.73c-5.363 0-9.743-4.38-9.743-9.743c0-5.363 4.38-9.743 9.743-9.743c5.363 0 9.743 4.38 9.743 9.743c0 5.363-4.38 9.743-9.743 9.743z" />
                  <path d="M17.955 6.05a1.124 1.124 0 11-2.248 0 1.124 1.124 0 012.248 0zM12.017 7.771c-2.336 0-4.231 1.896-4.231 4.231 0 2.336 1.896 4.231 4.231 4.231 2.336 0 4.231-1.896 4.231-4.231 0-2.335-1.896-4.231-4.231-4.231zm0 6.976c-1.513 0-2.745-1.232-2.745-2.745s1.232-2.745 2.745-2.745c1.513 0 2.745 1.232 2.745 2.745s-1.232 2.745-2.745 2.745z" />
                  <path d="M17.955 6.05a1.124 1.124 0 11-2.248 0 1.124 1.124 0 012.248 0zM12.017 7.771c-2.336 0-4.231 1.896-4.231 4.231 0 2.336 1.896 4.231 4.231 4.231 2.336 0 4.231-1.896 4.231-4.231 0-2.335-1.896-4.231-4.231-4.231zm0 6.976c-1.513 0-2.745-1.232-2.745-2.745s1.232-2.745 2.745-2.745c1.513 0 2.745 1.232 2.745 2.745s-1.232 2.745-2.745 2.745z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Payment Icons */}
        <div className="flex justify-end mb-8">
          <div className="flex space-x-2">
            {/* PayPal */}
            <div className="w-8 h-5 bg-blue-600 rounded flex items-center justify-center text-xs text-white font-bold">
              P
            </div>
            {/* Maestro */}
            <div className="w-8 h-5 bg-blue-500 rounded flex items-center justify-center text-xs text-white font-bold">
              M
            </div>
            {/* Mastercard */}
            <div className="w-8 h-5 bg-red-500 rounded flex items-center justify-center text-xs text-white font-bold">
              MC
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-gray-700">
          <div className="text-sm text-gray-400 space-y-2">
            <p className="font-medium">
              The Luxury Art Mepra.com is on behalf of Mepra S.p.A. operated by Ladura Trading B.V.
            </p>
            <p>Ladura Trading B.V. - Apeldoorn, The Netherlands. Chamber of Commerce: 61624764.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
