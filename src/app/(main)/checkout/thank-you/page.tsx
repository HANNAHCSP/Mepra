import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ThankYouClientPage from '@/components/ui/checkout/thank-you-client-page';

// This line is essential. It forces Next.js to treat this page as dynamic.
export const dynamic = 'force-dynamic';

async function getOrderData(orderId: string, token?: string | null) {
  const session = await getServerSession(authOptions);
  
  if (session?.user?.id) {
    return prisma.order.findFirst({
      where: { id: orderId, userId: session.user.id },
      select: { id: true, orderNumber: true, userId: true, customerEmail: true }
    });
  }

  if (token) {
     return prisma.order.findFirst({
      where: { id: orderId, accessToken: token },
       select: { id: true, orderNumber: true, userId: true, customerEmail: true }
    });
  }

  return null;
}

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Await the searchParams before accessing properties
  const resolvedSearchParams = await searchParams;
  
  const orderId = typeof resolvedSearchParams.orderId === 'string' ? resolvedSearchParams.orderId : undefined;
  const token = typeof resolvedSearchParams.token === 'string' ? resolvedSearchParams.token : undefined;
  
  if (!orderId) {
    return notFound();
  }

  const order = await getOrderData(orderId, token);
  if (!order) {
    return notFound();
  }

  const isGuestOrder = !order.userId;

  return (
    <ThankYouClientPage
      orderId={order.id}
      orderNumber={order.orderNumber}
      customerEmail={order.customerEmail}
      isGuestOrder={isGuestOrder}
    />
  );
}