import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import AdminSearch from "@/components/ui/admin/admin-search";
import ExportButton from "@/components/ui/admin/export-button"; // <--- Import

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  const orders = await prisma.order.findMany({
    where: q
      ? {
          OR: [
            { orderNumber: { contains: q, mode: "insensitive" } },
            { customerEmail: { contains: q, mode: "insensitive" } },
            { user: { name: { contains: q, mode: "insensitive" } } },
          ],
        }
      : undefined,
    orderBy: { createdAt: "desc" },
    include: { user: true },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-light text-primary">Orders</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Track and fulfill customer orders ({orders.length} total)
          </p>
        </div>

        {/* Actions Row: Search + Export */}
        <div className="flex items-center gap-3">
          <AdminSearch placeholder="Order #, email, or name..." />
          <ExportButton />
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border/60 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase tracking-wider text-muted-foreground bg-accent/50 font-medium">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Payment</th>
                <th className="px-6 py-4 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-accent/30 transition-colors group">
                  <td className="px-6 py-4 font-medium text-foreground">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-primary hover:underline"
                    >
                      <span className="font-mono text-xs text-muted-foreground">#</span>
                      {order.orderNumber.split("-")[1] || order.orderNumber}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">
                        {order.user?.name || "Guest"}
                      </span>
                      <span className="text-xs text-muted-foreground">{order.customerEmail}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <Badge status={order.status}>{order.status}</Badge>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-secondary/10 text-secondary text-xs capitalize">
                      {order.paymentStatus.toLowerCase().replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-foreground">
                    ${(order.total / 100).toFixed(2)}
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    No orders found matching &quot;{q}&quot;.
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
