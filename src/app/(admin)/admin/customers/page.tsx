import { prisma } from "@/lib/prisma";
import { Mail, Calendar } from "lucide-react";
import Link from "next/link";

export default async function AdminCustomersPage() {
  // Fetch users with their order count and total spend
  const users = await prisma.user.findMany({
    where: { role: "user" },
    include: {
      _count: {
        select: { orders: true },
      },
      orders: {
        where: { status: { not: "DRAFT" } },
        select: { total: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-light text-primary">Clientele</h1>
        <p className="text-muted-foreground mt-1">Manage and view registered customer accounts.</p>
      </div>

      <div className="bg-card rounded-xl border border-border/60 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase tracking-wider text-muted-foreground bg-accent/30 font-medium">
              <tr>
                <th className="px-6 py-4">Customer Name</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4 text-center">Orders</th>
                <th className="px-6 py-4 text-right">Lifetime Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {users.map((user) => {
                const totalSpent = user.orders.reduce((acc, order) => acc + order.total, 0);

                return (
                  <tr key={user.id} className="hover:bg-accent/30 transition-colors group">
                    <td className="px-6 py-4 font-medium text-foreground">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary text-xs font-bold">
                          {user.name?.charAt(0).toUpperCase() || "U"}
                        </div>
                        {/* Link to Customer Details Page */}
                        <Link
                          href={`/admin/customers/${user.id}`}
                          className="hover:text-primary hover:underline transition-all"
                        >
                          {user.name || "No Name Provided"}
                        </Link>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="w-3 h-3" />
                        {user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3" />
                        {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary/10 text-secondary border border-secondary/20">
                        {user._count.orders}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-foreground">
                      ${(totalSpent / 100).toFixed(2)}
                    </td>
                  </tr>
                );
              })}
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    No registered customers found.
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
