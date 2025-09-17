import Navbar from "@/components/ui/navbar";
import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow bg-gray-50">
        <div className="max-w-7xl mx-auto p-6 flex gap-8">
          <aside className="w-1/5">
            <nav className="flex flex-col space-y-2">
              <Link href="/admin" className="px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-100">
                Dashboard
              </Link>
              <Link href="/admin/orders" className="px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-100 bg-white border">
                Orders
              </Link>
              {/* Future links for Products, Customers, etc. can go here */}
            </nav>
          </aside>
          <main className="w-4/5">{children}</main>
        </div>
      </div>
    </div>
  );
}