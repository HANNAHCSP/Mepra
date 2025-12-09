import Navbar from "@/components/ui/navbar";
import Footer from "@/components/layout/footer";
import CustomerService from "@/components/layout/CustomerService";
import CartButton from "@/components/ui/cart/cart-button";
import WishlistNavButton from "@/components/ui/wishlist/wishlist-nav-button";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import { getStoreSettings } from "@/app/actions/settings"; // <--- You might need to export this or use prisma directly
import { prisma } from "@/lib/prisma"; // Direct prisma access is fine in layout
import { cookies } from "next/headers";
import { CartProvider } from "@/context/cart-context"; // <--- Import Provider

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const settings = await getStoreSettings();

  // 1. Fetch Cart Count Server-Side
  const cartId = (await cookies()).get("cartId")?.value;
  let cartItemCount = 0;

  if (cartId) {
    const cart = await prisma.cart.findUnique({
      where: { id: cartId },
      include: { items: true },
    });
    // Sum up quantities
    cartItemCount = cart?.items.reduce((acc, item) => acc + item.quantity, 0) || 0;
  }

  return (
    <CartProvider initialCount={cartItemCount}>
      {" "}
      {/* <--- Wrap Everything */}
      <div className="flex flex-col min-h-screen">
        <Navbar
          cart={<CartButton />}
          wishlist={<WishlistNavButton />}
          announcement={settings.announcementBar}
        />

        <Breadcrumbs />

        <main className="flex-grow">{children}</main>

        <CustomerService />
        <Footer />
      </div>
    </CartProvider>
  );
}
