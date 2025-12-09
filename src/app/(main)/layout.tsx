import Navbar from "@/components/ui/navbar";
import Footer from "@/components/layout/footer";
import CustomerService from "@/components/layout/CustomerService";
import CartButton from "@/components/ui/cart/cart-button";
import WishlistNavButton from "@/components/ui/wishlist/wishlist-nav-button";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import { getStoreSettings } from "@/app/actions/settings"; // <--- Import

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  // Fetch settings dynamically
  const settings = await getStoreSettings();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar 
        cart={<CartButton />} 
        wishlist={<WishlistNavButton />} 
        announcement={settings.announcementBar} // <--- Pass it here
      />
      
      <Breadcrumbs />
      
      <main className="flex-grow">{children}</main>
      
      <CustomerService />
      <Footer />
    </div>
  );
}