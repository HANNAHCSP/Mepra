import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import LogoutButton from "@/components/ui/logout-button";
import { Badge } from "@/components/ui/badge";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  // Defense-in-depth: if somehow reached, re-check.
  if (!session || session.user.role !== "admin") {
    redirect("/");
  }

  // Fetch users and recent orders in parallel
  const [users, recentOrders] = await Promise.all([
    prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.order.findMany({
      where: { status: { not: 'DRAFT' } },
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: { user: { select: { name: true } } },
    }),
  ]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <LogoutButton variant="danger" size="md">
          Sign Out
        </LogoutButton>
      </div>

      <p className="mt-2 text-gray-600">
        Welcome, {session.user.name ?? "admin"}.
      </p>

      {/* Recent Orders Section */}
      <section>
        <h2 className="text-xl font-medium mb-3">Recent Orders</h2>
        <div className="overflow-x-auto rounded border border-gray-200 bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-700">Order #</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">Customer</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">Date</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">Status</th>
                <th className="px-4 py-2 text-right font-medium text-gray-700">Total</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-t">
                  <td className="px-4 py-2 font-medium text-blue-600 hover:underline">
                    {/* Link to a future order details page */}
                    {order.orderNumber}
                  </td>
                  <td className="px-4 py-2">{order.user?.name ?? order.customerEmail}</td>
                  <td className="px-4 py-2">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-2">
                    <Badge status={order.status}>{order.status}</Badge>
                  </td>
                  <td className="px-4 py-2 text-right font-medium">
                    ${(order.total / 100).toFixed(2)}
                  </td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td className="px-4 py-4 text-center text-gray-500" colSpan={5}>
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* All Users Section */}
      <section>
        <h2 className="text-xl font-medium mb-3">All Users</h2>
        <div className="overflow-x-auto rounded border border-gray-200 bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-700">Name</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">Email</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">Role</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">Created</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t">
                  <td className="px-4 py-2">{u.name}</td>
                  <td className="px-4 py-2">{u.email}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`inline-flex items-center rounded px-2 py-0.5 text-xs ${
                        u.role === "admin"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    {new Date(u.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td className="px-4 py-4 text-center text-gray-500" colSpan={4}>
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}