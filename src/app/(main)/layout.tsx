import Navbar from "@/components/ui/navbar";
import Footer from "@/components/layout/footer";
import CustomerService from "@/components/layout/CustomerService";
import CartButton from "@/components/ui/cart/cart-button"; // Import the server component

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar cart={<CartButton />} /> {/* Pass the component as a prop */}
      <main className="flex-grow">{children}</main>
      <CustomerService />
      <Footer />
    </div>
  );
}