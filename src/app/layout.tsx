import AuthSessionProvider from "@/components/providers/session-provider";
import "./globals.css";
import Navbar from "@/components/ui/navbar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthSessionProvider>
          <Navbar />
          {children}
          </AuthSessionProvider>
      </body>
    </html>
  );
}
