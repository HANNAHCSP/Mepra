import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Mail, MapPin, Package, Calendar, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default async function AdminCustomerDetailsPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      addresses: true,
      orders: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user) notFound();

  // Calculate Lifetime Stats
  const totalSpent = user.orders.reduce((acc, order) => acc + order.total, 0);
  const completedOrders = user.orders.filter((o) => o.status === "DELIVERED").length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/customers"
          className="p-2 rounded-full hover:bg-accent transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </Link>
        <div>
          <h1 className="text-2xl font-light text-foreground">{user.name}</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="w-3 h-3" /> {user.email}
            <span className="mx-1">•</span>
            <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card p-6 rounded-xl border border-border/60 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">Lifetime Value</span>
          </div>
          <p className="text-2xl font-semibold text-foreground">${(totalSpent / 100).toFixed(2)}</p>
        </div>

        <div className="bg-card p-6 rounded-xl border border-border/60 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-secondary/10 rounded-lg text-secondary">
              <Package className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">Total Orders</span>
          </div>
          <p className="text-2xl font-semibold text-foreground">{user.orders.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Orders */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-lg font-medium text-foreground">Order History</h2>

          <div className="bg-card border border-border/60 rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-accent/30 text-muted-foreground font-medium border-b border-border/60">
                  <tr>
                    <th className="px-6 py-3">Order #</th>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {user.orders.map((order) => (
                    <tr key={order.id} className="hover:bg-accent/10 transition-colors group">
                      <td className="px-6 py-4 font-medium">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="text-primary hover:underline"
                        >
                          {order.orderNumber}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <Badge status={order.status}>{order.status}</Badge>
                      </td>
                      <td className="px-6 py-4 text-right font-medium">
                        ${(order.total / 100).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                  {user.orders.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                        No orders placed yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Addresses */}
        <div className="space-y-6">
          <h2 className="text-lg font-medium text-foreground">Saved Addresses</h2>

          {user.addresses.length > 0 ? (
            <div className="space-y-4">
              {user.addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="bg-card p-4 rounded-xl border border-border/60 shadow-sm relative"
                >
                  {addr.isDefault && (
                    <span className="absolute top-4 right-4 text-[10px] uppercase font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-100">
                      Default
                    </span>
                  )}
                  <div className="flex gap-3 text-sm text-foreground">
                    <MapPin className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                    <div className="leading-relaxed">
                      <p>{addr.street}</p>
                      <p>
                        {addr.city}, {addr.state} {addr.zipCode}
                      </p>
                      <p className="text-muted-foreground mt-1">{addr.country}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-muted/20 p-6 rounded-xl border border-border/40 text-center text-sm text-muted-foreground">
              No addresses saved.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
