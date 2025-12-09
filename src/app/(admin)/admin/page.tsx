import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, Users, CreditCard, ShoppingBag, LucideIcon } from "lucide-react";
import { getSalesData } from "@/lib/analytics"; // <--- Import logic
import RevenueChart from "@/components/ui/admin/revenue-chart"; // <--- Import component

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    redirect("/");
  }

  // Fetch Data Parallelly
  const [usersCount, recentOrders, totalRevenue, chartData] = await Promise.all([
    prisma.user.count({ where: { role: "user" } }),
    prisma.order.findMany({
      where: { status: { not: "DRAFT" } },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { user: { select: { name: true } } },
    }),
    prisma.order.aggregate({
      where: {
        status: { not: "DRAFT" },
        paymentStatus: { in: ["CAPTURED", "AUTHORIZED"] }, // Only count paid
      },
      _sum: { total: true },
    }),
    getSalesData(7), // <--- Fetch chart data (Last 7 days)
  ]);

  const revenue = totalRevenue._sum.total ? totalRevenue._sum.total / 100 : 0;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-light text-primary">Overview</h2>
        <p className="text-muted-foreground mt-1">Welcome back, {session.user.name}.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Total Revenue"
          value={`$${revenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
          icon={CreditCard}
          trend="Lifetime"
        />
        <StatsCard
          title="Active Orders"
          value={recentOrders.length.toString()} // Note: Ideally fetch actual count of active orders, not just length of recent array
          icon={ShoppingBag}
          trend="Recent Activity"
        />
        <StatsCard
          title="Registered Clients"
          value={usersCount.toString()}
          icon={Users}
          trend="Total Users"
        />
      </div>

      {/* Analytics Chart */}
      <RevenueChart data={chartData} />

      {/* Recent Orders Table */}
      <div className="bg-card rounded-xl border border-border/60 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border/60 flex justify-between items-center bg-accent/30">
          <h3 className="text-lg font-medium text-foreground">Recent Activity</h3>
          <Link
            href="/admin/orders"
            className="text-sm text-secondary hover:text-primary transition-colors flex items-center gap-1"
          >
            View All <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase tracking-wider text-muted-foreground bg-accent/50 font-medium">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-accent/30 transition-colors group">
                  <td className="px-6 py-4 font-medium text-foreground">
                    <span className="font-mono text-xs text-muted-foreground">#</span>
                    {order.orderNumber.split("-")[1] || order.orderNumber}
                  </td>
                  <td className="px-6 py-4 text-foreground/80">
                    {order.user?.name ?? order.customerEmail}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <Badge status={order.status}>{order.status}</Badge>
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-foreground">
                    ${(order.total / 100).toFixed(2)}
                  </td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
}: {
  title: string;
  value: string;
  icon: LucideIcon;
  trend: string;
}) {
  return (
    <div className="bg-card p-6 rounded-xl border border-border/60 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center justify-between mb-4">
        <span className="p-2 bg-secondary/10 rounded-lg text-secondary border border-secondary/20">
          <Icon className="w-5 h-5" />
        </span>
        <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-100">
          {trend}
        </span>
      </div>
      <div>
        <p className="text-sm text-muted-foreground font-medium uppercase tracking-wide">{title}</p>
        <h3 className="text-3xl font-light text-primary mt-1">{value}</h3>
      </div>
    </div>
  );
}
