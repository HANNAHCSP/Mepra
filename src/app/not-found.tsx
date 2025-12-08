import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    // Note: Root not-found does not automatically inherit layout,
    // but styling will work if globals.css is loaded.
    <div className="min-h-screen bg-[#f2f4f3] flex flex-col items-center justify-center px-4 text-center">
      <div className="space-y-6 max-w-md">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-[#a9927d]/10 rounded-full">
          <AlertCircle className="w-10 h-10 text-[#a9927d]" />
        </div>

        <h1 className="text-5xl font-light text-[#5e503f]">404</h1>
        <h2 className="text-2xl font-medium text-[#5e503f]">Page Not Found</h2>

        <p className="text-[#968775]">
          The page you are looking for might have been removed, had its name changed, or is
          temporarily unavailable.
        </p>

        <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center h-11 px-8 rounded-md bg-[#5e503f] text-[#f2f4f3] font-medium transition-colors hover:bg-[#5e503f]/90"
          >
            Return Home
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center justify-center h-11 px-8 rounded-md border-2 border-[#dcd6d0] bg-white text-[#5e503f] font-medium transition-colors hover:bg-[#f9f7f5]"
          >
            Browse Store
          </Link>
        </div>
      </div>
    </div>
  );
}
