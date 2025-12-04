// src/app/(main)/account/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Package, MapPin, User, ChevronRight, CreditCard, LogOut } from "lucide-react";
import LogoutButton from "@/components/ui/logout-button";

export default async function AccountPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/signin");
  }

  const latestOrder = await prisma.order.findFirst({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  const dashboardItems = [
    {
      title: "Orders",
      description: "Track, return, or buy things again.",
      icon: Package,
      href: "/account/orders",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Addresses",
      description: "Manage shipping and billing addresses.",
      icon: MapPin,
      href: "/account/addresses",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Profile",
      description: "Edit your name, password, and login details.",
      icon: User,
      href: "/account/profile",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <div className="space-y-10">
      {/* Header Section */}
      <div className="border-b border-border pb-8">
        <h1 className="text-3xl font-light text-primary">
          Welcome back, <span className="font-medium">{session.user.name?.split(" ")[0]}</span>
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Manage your orders, update your personal details, and control your account settings from
          your dashboard.
        </p>
      </div>

      {/* Quick Links Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {dashboardItems.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className="group relative bg-card p-6 rounded-xl border border-border/60 shadow-sm hover:shadow-md hover:border-secondary/50 transition-all duration-300"
          >
            <div className="flex items-center gap-4 mb-4">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${item.bgColor}`}
              >
                <item.icon className={`w-6 h-6 ${item.color}`} />
              </div>
              <h3 className="text-lg font-medium text-foreground group-hover:text-primary transition-colors">
                {item.title}
              </h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
            <div className="flex items-center text-sm font-medium text-secondary group-hover:translate-x-1 transition-transform">
              View Details <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="bg-card rounded-xl border border-border/60 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border/60 bg-accent/20 flex items-center justify-between">
          <h3 className="font-medium text-foreground">Recent Activity</h3>
          <Link
            href="/account/orders"
            className="text-sm text-secondary hover:text-primary transition-colors"
          >
            View All
          </Link>
        </div>
        <div className="p-6">
          {latestOrder ? (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-lg bg-background border border-border">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Order #{latestOrder.orderNumber}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(latestOrder.createdAt).toLocaleDateString(undefined, {
                      dateStyle: "medium",
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide border ${
                    latestOrder.status === "DELIVERED"
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-secondary/10 text-secondary border-secondary/20"
                  }`}
                >
                  {latestOrder.status}
                </span>
                <p className="font-medium text-foreground">
                  ${(latestOrder.total / 100).toFixed(2)}
                </p>
                <Link
                  href={`/account/orders/${latestOrder.orderNumber}`}
                  className="text-sm font-medium text-secondary hover:underline"
                >
                  View
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">You haven&apos;t placed any orders yet.</p>
              <Link
                href="/products"
                className="text-primary font-medium hover:underline mt-2 inline-block"
              >
                Start Shopping
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
