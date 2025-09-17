// src/app/(admin)/admin/orders/page.tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    where: { status: { not: 'DRAFT' } },
    orderBy: { createdAt: 'desc' },
    include: { user: { select: { name: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">All Orders</h1>
        {/* A place for future actions like "Export Orders" */}
      </div>

      <div className="overflow-x-auto rounded border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-700">Order #</th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">Customer</th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">Date</th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">Status</th>
              <th className="px-4 py-3 text-right font-medium text-gray-700">Total</th>
              <th className="px-4 py-3 text-right font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-blue-600 hover:underline">
                  <Link href={`/admin/orders/${order.id}`}>
                    {order.orderNumber}
                  </Link>
                </td>
                <td className="px-4 py-3">{order.user?.name ?? order.customerEmail}</td>
                <td className="px-4 py-3">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <Badge status={order.status}>{order.status}</Badge>
                </td>
                <td className="px-4 py-3 text-right font-medium">
                  ${(order.total / 100).toFixed(2)}
                </td>
                <td className="px-4 py-3 text-right">
                   <Link href={`/admin/orders/${order.id}`} className="text-sm font-medium text-blue-600 hover:underline">
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td className="px-4 py-4 text-center text-gray-500" colSpan={6}>
                  No orders have been placed yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}