import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Search } from "lucide-react";
import Navbar from "@/components/ui/navbar";
import Footer from "@/components/layout/footer";
import CartButton from "@/components/ui/cart/cart-button";
import WishlistNavButton from "@/components/ui/wishlist/wishlist-nav-button";
import { getStoreSettings } from "@/app/actions/settings";

export default async function NotFound() {
  // We fetch settings so the Navbar still shows the correct Announcement
  const settings = await getStoreSettings();

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Header (So user isn't trapped) */}
      <Navbar
        cart={<CartButton />}
        wishlist={<WishlistNavButton />}
        announcement={settings.announcementBar}
      />

      {/* 2. Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center text-center px-4 py-20 bg-stone-50">
        <div className="space-y-6 max-w-lg">
          {/* Aesthetic 404 Visual */}
          <div className="text-9xl font-light text-stone-200 select-none">404</div>

          <h1 className="text-3xl font-light text-foreground -mt-10 relative z-10">
            Page Not Found
          </h1>

          <p className="text-muted-foreground leading-relaxed">
            We apologize, but the piece you are looking for does not exist or has been moved. Please
            allow us to guide you back to our collection.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/">
              <Button size="lg" className="min-w-[160px]">
                Return Home
              </Button>
            </Link>

            <Link href="/search">
              <Button variant="outline" size="lg" className="min-w-[160px] gap-2">
                <Search className="w-4 h-4" />
                Search Catalog
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* 3. Footer */}
      <Footer />
    </div>
  );
}
