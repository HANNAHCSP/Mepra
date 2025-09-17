// src/app/(main)/order-confirmation/[orderId]/page.tsx
import { getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import ThankYouClientPage from '@/components/ui/checkout/thank-you-client-page';
import ThankYouOrderSummary from '@/components/ui/checkout/thank-you-order-summary';
import { Lock } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getOrderData(orderId: string, token?: string | null) {
  const session = await getServerSession(authOptions);

  const queryOptions = {
    include: {
      items: {
        include: {
          variant: {
            include: {
              product: true,
            },
          },
        },
      },
    },
  };

  if (session?.user?.id) {
    return prisma.order.findFirst({
      where: { id: orderId, userId: session.user.id },
      ...queryOptions,
    });
  }

  if (token) {
    return prisma.order.findFirst({
      where: { id: orderId, accessToken: token },
      ...queryOptions,
    });
  }

  return null;
}

export default async function OrderConfirmationPage({
  params,
  searchParams,
}: {
  params: { orderId: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { orderId } = params;
  const token = typeof searchParams.token === 'string' ? searchParams.token : undefined;

  if (!orderId) {
    return notFound();
  }

  const order = await getOrderData(orderId, token);

  if (!order) {
    return notFound();
  }

  const isGuestOrder = !order.userId;

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 lg:grid lg:grid-cols-2">
      <main className="flex-grow px-4 pb-24 pt-8 sm:px-6 lg:col-start-1 lg:row-start-1 lg:bg-white lg:px-8 lg:pb-16 lg:pt-16">
        <div className="mx-auto max-w-lg">
          <ThankYouClientPage
            orderId={order.id}
            orderNumber={order.orderNumber}
            customerEmail={order.customerEmail}
            isGuestOrder={isGuestOrder}
          />
        </div>
      </main>

      <aside className="bg-gray-100 px-4 py-8 sm:px-6 sm:py-10 lg:col-start-2 lg:row-start-1 lg:px-8">
        <div className="mx-auto max-w-lg">
          <ThankYouOrderSummary order={order} />
          <div className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-500">
            <Lock className="h-4 w-4" />
            <span>Secure SSL checkout</span>
          </div>
        </div>
      </aside>
    </div>
  );
}