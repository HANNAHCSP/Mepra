// src/components/ui/admin/real-time-orders.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Loader2, RefreshCw } from "lucide-react";
import type { Order, User } from "@prisma/client";

type OrderWithUser = Order & { user: { name: string | null } | null };

interface RealTimeOrdersProps {
  initialOrders: OrderWithUser[];
}

export default function RealTimeOrders({ initialOrders }: RealTimeOrdersProps) {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Poll for updates every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIsRefreshing(true);
      router.refresh();

      // Artificial delay to show the spinner briefly for UX feedback
      setTimeout(() => setIsRefreshing(false), 800);
    }, 10000);

    return () => clearInterval(interval);
  }, [router]);

  return (
    <div className="bg-card rounded-xl border border-border/60 shadow-sm overflow-hidden relative">
      {/* Real-time Indicator */}
      <div
        className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-secondary/0 via-secondary/50 to-secondary/0 opacity-0 transition-opacity duration-500"
        style={{ opacity: isRefreshing ? 1 : 0 }}
      />

      <div className="p-6 border-b border-border/60 bg-accent/30 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-medium text-foreground">Order Management</h3>
          <div className="flex items-center gap-2 px-2 py-1 bg-green-50 border border-green-100 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-[10px] font-semibold text-green-700 uppercase tracking-wider">
              Live
            </span>
          </div>
        </div>

        <div className="text-xs text-muted-foreground flex items-center gap-2">
          {isRefreshing && <Loader2 className="w-3 h-3 animate-spin text-secondary" />}
          <span>Updating automatically</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase tracking-wider text-muted-foreground bg-accent/50 font-medium">
            <tr>
              <th className="px-6 py-4">Order #</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Placed</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Total</th>
              <th className="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {initialOrders.map((order) => (
              <tr key={order.id} className="hover:bg-accent/30 transition-all duration-200 group">
                <td className="px-6 py-4 font-mono text-primary group-hover:text-secondary transition-colors">
                  {order.orderNumber}
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
                  {new Date(order.createdAt).toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <Badge status={order.status}>{order.status}</Badge>
                </td>
                <td className="px-6 py-4 text-right font-medium text-foreground">
                  ${(order.total / 100).toFixed(2)}
                </td>
                <td className="px-6 py-4 text-center">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="inline-flex items-center justify-center px-3 py-1.5 rounded-md border border-border text-xs font-medium text-muted-foreground hover:text-primary hover:border-secondary transition-all active:scale-95"
                  >
                    Manage
                  </Link>
                </td>
              </tr>
            ))}
            {initialOrders.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                  No orders found awaiting processing.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
