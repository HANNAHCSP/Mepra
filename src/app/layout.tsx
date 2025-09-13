import AuthSessionProvider from "@/components/providers/session-provider";
import { Toaster } from 'sonner'; // Import the Toaster component
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthSessionProvider>
          {children}
        </AuthSessionProvider>
        {/* Add the Toaster here. It will handle rendering all notifications. */}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
