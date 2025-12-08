// src/components/layout/footer.tsx
"use client";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#1a1816] text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Customer Service */}
          <div>
            <h3 className="text-white font-medium text-sm mb-4 uppercase tracking-widest">
              Customer Service
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/shipping"
                  className="text-white/70 hover:text-secondary transition-colors duration-200"
                >
                  Shipping
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-white/70 hover:text-secondary transition-colors duration-200"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/locations"
                  className="text-white/70 hover:text-secondary transition-colors duration-200"
                >
                  Locations
                </Link>
              </li>
              <li>
                <Link
                  href="/returns"
                  className="text-white/70 hover:text-secondary transition-colors duration-200"
                >
                  Return policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-white/70 hover:text-secondary transition-colors duration-200"
                >
                  Terms and Conditions
                </Link>
              </li>

              <li>
                <Link
                  href="/privacy"
                  className="text-white/70 hover:text-secondary transition-colors duration-200"
                >
                  Privacy Statement
                </Link>
              </li>
              <li>
                <Link
                  href="/accessibility"
                  className="text-white/70 hover:text-secondary transition-colors duration-200"
                >
                  Accessibility Statement
                </Link>
              </li>
            </ul>
          </div>

          {/* About Section */}
          <div>
            <h3 className="text-white font-medium text-sm mb-4 uppercase tracking-widest">
              About Mepra
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/history"
                  className="text-white/70 hover:text-secondary transition-colors duration-200"
                >
                  History
                </Link>
              </li>

              <li>
                <Link
                  href="/awards"
                  className="text-white/70 hover:text-secondary transition-colors duration-200"
                >
                  Awards
                </Link>
              </li>

              <li>
                <Link
                  href="/mepra-website"
                  className="text-white/70 hover:text-secondary transition-colors duration-200"
                >
                  Mepra.it website
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-medium text-sm mb-4 uppercase tracking-widest">
              Contact
            </h3>
            <div className="space-y-2 text-sm text-white/70">
              <p>E: info@mepra-store.com</p>
              <p>P: +31 85 303 26 59</p>
              <p>(Mo Fr 09:00 AM 5:30 PM CEST)</p>
            </div>

            {/* Social Media Icons */}
            <div className="flex space-x-3 mt-6">
              <Link
                href="#"
                className="text-white/60 hover:text-secondary transition-colors duration-200"
              >
                <span className="sr-only">YouTube</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </Link>
              <Link
                href="#"
                className="text-white/60 hover:text-secondary transition-colors duration-200"
              >
                <span className="sr-only">Facebook</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </Link>
              <Link
                href="#"
                className="text-white/60 hover:text-secondary transition-colors duration-200"
              >
                <span className="sr-only">Twitter</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </Link>
              <Link
                href="#"
                className="text-white/60 hover:text-secondary transition-colors duration-200"
              >
                <span className="sr-only">Instagram</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987c6.62 0 11.987-5.367 11.987-11.987C24.004 5.367 18.637.001 12.017.001zM12.017 21.73c-5.363 0-9.743-4.38-9.743-9.743c0-5.363 4.38-9.743 9.743-9.743c5.363 0 9.743 4.38 9.743 9.743c0 5.363-4.38 9.743-9.743 9.743z" />
                  <path d="M17.955 6.05a1.124 1.124 0 11-2.248 0 1.124 1.124 0 012.248 0zM12.017 7.771c-2.336 0-4.231 1.896-4.231 4.231 0 2.336 1.896 4.231 4.231 4.231 2.336 0 4.231-1.896 4.231-4.231 0-2.335-1.896-4.231-4.231-4.231zm0 6.976c-1.513 0-2.745-1.232-2.745-2.745s1.232-2.745 2.745-2.745c1.513 0 2.745 1.232 2.745 2.745s-1.232 2.745-2.745 2.745z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-white/10">
          <div className="text-sm text-white/60 space-y-2">
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
