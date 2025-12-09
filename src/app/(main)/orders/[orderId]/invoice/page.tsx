import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { z } from "zod";
import { ShippingAddressSchema } from "@/lib/zod-schemas";
import { getStoreSettings } from "@/app/actions/settings";
import InvoiceActions from "@/components/ui/invoice-actions";

type ShippingAddress = z.infer<typeof ShippingAddressSchema>;

export default async function InvoicePage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const session = await getServerSession(authOptions);

  // 1. Fetch Data
  const [order, settings] = await Promise.all([
    prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            variant: { include: { product: true } },
          },
        },
        user: true,
      },
    }),
    getStoreSettings(),
  ]);

  if (!order) notFound();

  // 2. Security Check (Admin OR Owner)
  const isAdmin = session?.user?.role === "admin";
  const isOwner = session?.user?.id === order.userId;

  // Allow access if Admin or Owner.
  if (!isAdmin && !isOwner) {
    redirect("/signin");
  }

  const address = order.shippingAddress as ShippingAddress;

  // Calculate Subtotal and Shipping for display
  const productsTotal = order.items.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const shippingCost = order.total - productsTotal; // Inferred shipping cost

  return (
    <div className="min-h-screen bg-gray-100 p-8 print:p-0 print:bg-white text-black">
      <div className="max-w-3xl mx-auto bg-white shadow-lg p-10 print:shadow-none">
        
        {/* Actions (Hidden when printing) */}
        <InvoiceActions />

        {/* Header */}
        <div className="flex justify-between items-start border-b border-gray-200 pb-8 mb-8">
          <div>
            <h1 className="text-4xl font-light text-gray-900 tracking-tight">INVOICE</h1>
            <p className="text-gray-500 mt-1">#{order.orderNumber}</p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold text-gray-900">{settings.storeName}</h2>
            <p className="text-sm text-gray-500 mt-1">
              {settings.supportEmail}
              <br />
              {settings.supportPhone}
            </p>
          </div>
        </div>

        {/* Dates & Info */}
        <div className="grid grid-cols-2 gap-8 mb-12">
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Billed To</h3>
            <p className="text-gray-800 font-medium">
              {address.firstName} {address.lastName}
            </p>
            <p className="text-gray-600 text-sm mt-1">
              {address.address}
              <br />
              {address.city}, {address.zipCode}
              <br />
              {address.country}
            </p>
          </div>
          <div className="text-right">
             <div className="mb-4">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Date Issued</h3>
                <p className="text-gray-800">{format(order.createdAt, "MMMM dd, yyyy")}</p>
             </div>
             <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Order Status</h3>
                <p className="text-gray-800 capitalize">{order.status.toLowerCase()}</p>
             </div>
          </div>
        </div>

        {/* Items Table */}
        <table className="w-full mb-12">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Item</th>
              <th className="text-right py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Quantity</th>
              <th className="text-right py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Price</th>
              <th className="text-right py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Total</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm">
            {order.items.map((item) => (
              <tr key={item.id} className="border-b border-gray-100">
                <td className="py-4">
                  <span className="font-medium text-gray-900">{item.name}</span>
                  <div className="text-xs text-gray-500 mt-0.5">SKU: {item.variant.sku || "N/A"}</div>
                </td>
                <td className="text-right py-4">{item.quantity}</td>
                <td className="text-right py-4">${(item.price / 100).toFixed(2)}</td>
                <td className="text-right py-4 font-medium">${((item.price * item.quantity) / 100).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-64 space-y-3">
             <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>${(productsTotal / 100).toFixed(2)}</span>
             </div>
             
             <div className="flex justify-between text-sm text-gray-600">
                <span>Shipping</span>
                <span>${(shippingCost / 100).toFixed(2)}</span>
             </div>

             <div className="flex justify-between text-lg font-bold text-gray-900 border-t border-gray-200 pt-3">
                <span>Total</span>
                <span>${(order.total / 100).toFixed(2)}</span>
             </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-gray-200 text-center text-xs text-gray-400">
          <p>Thank you for your business.</p>
          <p className="mt-1">For any questions, please contact {settings.supportEmail}</p>
        </div>

      </div>
    </div>
  );
}