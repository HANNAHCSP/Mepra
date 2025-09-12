import Navbar from "@/components/ui/navbar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow bg-gray-50">{children}</main>
      {/* No CustomerService or Footer components */}
    </div>
  );
}