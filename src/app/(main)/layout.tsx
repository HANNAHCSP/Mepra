// src/app/(main)/layout.tsx
import Navbar from "@/components/ui/navbar";
import Footer from "@/components/layout/footer";
import CustomerService from "@/components/layout/CustomerService";
import CartButton from "@/components/ui/cart/cart-button";
import WishlistNavButton from "@/components/ui/wishlist/wishlist-nav-button"; // Import the new component
import Breadcrumbs from "@/components/ui/breadcrumbs";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar cart={<CartButton />} wishlist={<WishlistNavButton />} />
      <Breadcrumbs />
      <main className="flex-grow">{children}</main>
      <CustomerService />
      <Footer />
    </div>
  );
}