import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

export default async function OrderHistoryPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/signin');
  }

  const orders = await prisma.order.findMany({
    where: {
      userId: session.user.id,
      status: { not: 'DRAFT' },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Order History</h1>
      {orders.length === 0 ? (
        <p className="text-gray-500">You haven&apos;t placed any orders yet.</p>
      ) : (
        <div className="border rounded-lg">
          <ul className="divide-y">
            {orders.map((order) => (
              <li key={order.id} className="p-4 hover:bg-gray-50">
                {/* --- THIS IS THE FIX --- */}
                {/* The Link href must match the folder structure: /account/orders/[orderNumber] */}
                <Link href={`/account/orders/${order.orderNumber}`}>
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="font-medium">Order #{order.orderNumber}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        ${(order.total / 100).toFixed(2)}
                      </p>
                      <Badge status={order.status}>{order.status}</Badge>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}