// src/app/(admin)/layout.tsx
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  Users,
  Settings,
  LogOut,
  Bell,
  ShoppingBag,
  MessageSquare,
} from "lucide-react";
import LogoutButton from "@/components/ui/logout-button";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background font-sans text-foreground selection:bg-secondary/20">
      {/* --- LUXURY SIDEBAR --- */}
      <aside className="w-72 bg-[#0A0908] text-white flex flex-col fixed inset-y-0 z-50 border-r border-[#49111C]/20 shadow-2xl">
        <div className="h-24 flex items-center justify-center border-b border-white/5">
          <div className="text-center">
            <h1 className="text-xl font-light tracking-[0.2em] text-white">MEPRA</h1>
            <p className="text-[10px] uppercase tracking-[0.3em] text-secondary mt-1">
              Admin Suite
            </p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2">
          <NavLink href="/admin" icon={LayoutDashboard} label="Dashboard" />
          <NavLink href="/admin/orders" icon={Package} label="Orders" />
          <NavLink href="/admin/products" icon={ShoppingBag} label="Products" />
          <NavLink href="/admin/customers" icon={Users} label="Clientele" />
          <NavLink href="/admin/reviews" icon={MessageSquare} label="Reviews" />
          <NavLink href="/admin/settings" icon={Settings} label="Settings" />
          {/* Add more links as needed */}
        </nav>

        <div className="p-6 border-t border-white/5 bg-white/5 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary border border-secondary/30">
              AD
            </div>
            <div>
              <p className="text-sm font-medium text-white">Administrator</p>
              <p className="text-xs text-white/50">Mepra Store</p>
            </div>
          </div>
          <LogoutButton
            variant="secondary"
            size="sm"
            className="w-full bg-[#49111C] hover:bg-[#5E1825] text-white border-none shadow-lg tracking-wider font-light"
          >
            Sign Out
          </LogoutButton>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 ml-72 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-24 bg-card/80 backdrop-blur-md sticky top-0 z-40 border-b border-border flex items-center justify-between px-8">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              System Operational
            </p>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 text-foreground/70 hover:text-secondary transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-burgundy rounded-full border border-white"></span>
            </button>
            <div className="h-8 w-px bg-border"></div>
            <Link
              href="/"
              target="_blank"
              className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              View Storefront →
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8 overflow-y-auto bg-background/50">
          <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

// Helper Component for Navigation Links
function NavLink({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 px-4 py-3.5 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 transition-all duration-200 border border-transparent hover:border-white/10"
    >
      <Icon className="w-5 h-5 text-secondary/70 group-hover:text-secondary transition-colors" />
      <span className="tracking-wide">{label}</span>
    </Link>
  );
}
