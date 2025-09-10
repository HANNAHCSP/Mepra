"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import UserMenu from "../ui/user-menu";

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900">
              Your App
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-gray-900 transition-colors">
              Home
            </Link>
            
            {session?.user?.role === "admin" && (
              <Link href="/admin" className="text-gray-700 hover:text-gray-900 transition-colors">
                Admin
              </Link>
            )}
          </div>

          {/* User Menu or Auth Links */}
          <div className="flex items-center">
            {status === "authenticated" && session?.user ? (
              <UserMenu />
            ) : status === "unauthenticated" ? (
              <div className="flex items-center space-x-4">
                <Link
                  href="/sign-in"
                  className="text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  href="/sign-up"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Sign up
                </Link>
              </div>
            ) : (
              <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}