// src/app/(main)/account/orders/page.tsx
import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Package, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// Skeleton for loading state
function OrdersSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-card border-2 border-border rounded-lg p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-3">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-6 w-20" />
              </div>
              <Skeleton className="h-4 w-48" />
            </div>
            <div className="flex items-center gap-4">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-5 w-5 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Actual orders list component
async function OrdersList() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/signin");
  }

  const orders = await prisma.order.findMany({
    where: {
      userId: session.user.id,
      status: { not: "DRAFT" },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-border rounded-lg bg-accent/30">
        <Package className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-xl font-medium text-foreground mb-2">No orders yet</h3>
        <p className="text-muted-foreground mb-6 text-center max-w-sm">
          Start shopping to see your orders here
        </p>
        <Link
          href="/products"
          className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 hover:shadow-md transition-all duration-200 active:scale-[0.98]"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Link key={order.id} href={`/account/orders/${order.orderNumber}`} className="block group">
          <div className="bg-card border-2 border-border rounded-lg p-6 hover:shadow-md hover:border-secondary/50 transition-all duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                    Order #{order.orderNumber}
                  </h3>
                  <Badge status={order.status}>{order.status}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Placed on{" "}
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-2xl font-semibold text-primary">
                    ${(order.total / 100).toFixed(2)}
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-secondary transition-colors" />
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

// Main page component
export default function OrderHistoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-light tracking-tight text-foreground">Order History</h1>
        <p className="mt-2 text-muted-foreground">Track and manage your orders</p>
      </div>

      <Suspense fallback={<OrdersSkeleton />}>
        <OrdersList />
      </Suspense>
    </div>
  );
}
