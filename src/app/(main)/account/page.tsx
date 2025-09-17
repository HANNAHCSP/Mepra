// src/app/(main)/account/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Package, MapPin } from "lucide-react";

export default async function AccountPage() {
  const session = await getServerSession(authOptions);

  // This check is now also handled by the layout, but it's good practice
  // for defense-in-depth.
  if (!session?.user) {
    redirect("/signin");
  }

  const latestOrder = await prisma.order.findFirst({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">
        Welcome, {session.user.name || "User"}!
      </h1>
      <p className="mt-2 text-sm text-gray-600">
        From your account dashboard, you can view your recent orders, manage your
        shipping addresses, and edit your password and account details.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <div className="rounded-md border bg-gray-50 p-4">
          <h3 className="flex items-center gap-2 font-semibold text-gray-800">
            <Package className="h-5 w-5 text-gray-500" />
            Recent Order
          </h3>
          {latestOrder ? (
            <div className="mt-2 text-sm text-gray-600">
              <p>
                Order{" "}
                <Link href={`/account/orders/${latestOrder.id}`} className="font-medium text-indigo-600 hover:underline">
                  #{latestOrder.orderNumber}
                </Link>
              </p>
              <p>
                Status: <span className="font-medium">{latestOrder.status}</span>
              </p>
              <p>
                Total: ${(latestOrder.total / 100).toFixed(2)}
              </p>
            </div>
          ) : (
            <p className="mt-2 text-sm text-gray-500">You have no recent orders.</p>
          )}
          <Link href="/account/orders" className="mt-4 inline-block text-sm font-medium text-indigo-600 hover:underline">
            View all orders &rarr;
          </Link>
        </div>

        <div className="rounded-md border bg-gray-50 p-4">
          <h3 className="flex items-center gap-2 font-semibold text-gray-800">
            <MapPin className="h-5 w-5 text-gray-500" />
            Account Details
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            Manage your saved addresses and update your personal information.
          </p>
          <Link href="/account/addresses" className="mt-4 inline-block text-sm font-medium text-indigo-600 hover:underline">
            Manage addresses &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}