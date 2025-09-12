//src/app/layout.tsx
import AuthSessionProvider from "@/components/providers/session-provider";
import "./globals.css";
import Navbar from "@/components/ui/navbar";
import Footer from "@/components/layout/footer";
import CustomerService from "@/components/layout/CustomerService";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <AuthSessionProvider>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <CustomerService />
          <Footer />
        </AuthSessionProvider>
      </body>
    </html>
  );
}
