// src/app/(main)/account/layout.tsx
import { ReactNode } from "react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
// import { usePathname } from 'next/navigation';
import LogoutButton from "@/components/ui/logout-button";
import { Package, MapPin, User, Home, LucideIcon } from "lucide-react";

// Client component for active state
function NavItem({ href, icon: Icon, label }: { href: string; icon: LucideIcon; label: string }) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-accent"
    >
      <Icon className="h-5 w-5 text-muted-foreground group-hover:text-secondary transition-colors" />
      <span className="text-foreground group-hover:text-secondary transition-colors">{label}</span>
    </Link>
  );
}

export default async function AccountLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/signin");
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="md:col-span-1">
          <div className="bg-card border-2 border-border rounded-lg p-4 mb-6">
            <div className="text-center pb-4 border-b border-border">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-3">
                <User className="w-8 h-8 text-primary" />
              </div>
              <h2 className="font-semibold text-lg text-foreground">{session.user.name}</h2>
              <p className="text-sm text-muted-foreground">{session.user.email}</p>
            </div>
          </div>

          <nav className="flex flex-col space-y-1 bg-card border-2 border-border rounded-lg p-2">
            <NavItem href="/account" icon={Home} label="Overview" />
            <NavItem href="/account/orders" icon={Package} label="Order History" />
            <NavItem href="/account/addresses" icon={MapPin} label="Addresses" />
            <NavItem href="/account/profile" icon={User} label="Profile" />
          </nav>

          <div className="mt-6 px-2">
            <LogoutButton variant="secondary" size="sm" className="w-full" />
          </div>
        </aside>
        <main className="md:col-span-3">{children}</main>
      </div>
    </div>
  );
}
