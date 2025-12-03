// src/app/(admin)/admin/orders/page.tsx
import { prisma } from "@/lib/prisma";
import RealTimeOrders from "@/components/ui/admin/real-time-orders";

export default async function AdminOrdersPage() {
  // Fetch initial data
  const orders = await prisma.order.findMany({
    where: { status: { not: "DRAFT" } },
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-light text-primary">All Orders</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage and track all customer orders in real-time.
          </p>
        </div>
      </div>

      <RealTimeOrders initialOrders={orders} />
    </div>
  );
}
