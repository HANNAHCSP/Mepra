import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { z } from "zod";
import { ShippingAddressSchema } from "@/lib/zod-schemas";
import RefundPanel from "@/components/ui/admin/refund-panel";
import FulfillmentCard from "@/components/ui/admin/fulfillment-card";
import { ArrowLeft, Mail, MapPin, Phone, Printer } from "lucide-react"; // Import Printer
import { Button } from "@/components/ui/button"; // Import Button
import Link from "next/link";

type ShippingAddress = z.infer<typeof ShippingAddressSchema>;

export default async function AdminOrderDetailsPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const order = await prisma.order.findUnique({
    where: { id: orderId },
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
      user: true,
      payments: { orderBy: { createdAt: "desc" } },
      refunds: {
        include: { requestedByUser: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!order) notFound();

  const shippingAddress = order.shippingAddress as ShippingAddress;

  return (
    <div className="space-y-8">
      {/* Breadcrumb / Back / Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/orders" className="p-2 rounded-full hover:bg-accent transition-colors">
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </Link>
          <div>
            <h1 className="text-2xl font-light text-foreground flex items-center gap-3">
              Order #{order.orderNumber}
              <Badge status={order.status}>{order.status}</Badge>
            </h1>
            <p className="text-sm text-muted-foreground">
              Placed on{" "}
              {new Date(order.createdAt).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>

        {/* Invoice Button */}
        <Link href={`/orders/${order.id}/invoice`} target="_blank">
          <Button variant="outline" size="sm" className="gap-2">
            <Printer className="w-4 h-4" /> Invoice
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Order Items */}
          <div className="bg-card border border-border/60 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-border/60 bg-accent/20">
              <h2 className="font-medium text-foreground">Items Ordered</h2>
            </div>
            <ul className="divide-y divide-border/40">
              {order.items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center gap-6 p-6 hover:bg-accent/10 transition-colors"
                >
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-border">
                    <Image
                      src={item.variant.product.imageUrl ?? "/placeholder.svg"}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-grow">
                    <p className="font-medium text-lg text-primary">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      SKU: <span className="font-mono">{item.variant.sku ?? "N/A"}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      {item.quantity} x ${(item.price / 100).toFixed(2)}
                    </p>
                    <p className="font-medium text-foreground">
                      ${((item.price * item.quantity) / 100).toFixed(2)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="p-6 bg-accent/20 border-t border-border/60 flex justify-end">
              <div className="w-64 space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Subtotal</span>
                  <span>${(order.total / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold text-foreground pt-2 border-t border-border/40">
                  <span>Total Paid</span>
                  <span>${(order.total / 100).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <RefundPanel order={order} />
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* Fulfillment Section */}
          {(order.status === "CONFIRMED" ||
            order.status === "SHIPPED" ||
            order.status === "DELIVERED") && <FulfillmentCard order={order} />}

          {/* Customer Card */}
          <div className="bg-card border border-border/60 rounded-xl shadow-sm p-6 space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Customer
            </h3>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                {(order.user?.name ?? shippingAddress.firstName)[0]}
              </div>
              <div>
                <p className="font-medium text-foreground">
                  {order.user?.name ?? `${shippingAddress.firstName} ${shippingAddress.lastName}`}
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <Mail className="w-3 h-3" /> {order.customerEmail}
                </div>
                {shippingAddress.phone && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <Phone className="w-3 h-3" /> {shippingAddress.phone}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Delivery Card */}
          <div className="bg-card border border-border/60 rounded-xl shadow-sm p-6 space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Delivery
            </h3>
            <div className="flex gap-3">
              <MapPin className="w-5 h-5 text-secondary mt-0.5" />
              <address className="text-sm text-foreground not-italic leading-relaxed">
                {shippingAddress.address}
                <br />
                {shippingAddress.apartment && (
                  <>
                    {shippingAddress.apartment}
                    <br />
                  </>
                )}
                {shippingAddress.city}, {shippingAddress.zipCode}
                <br />
                {shippingAddress.country}
              </address>
            </div>
          </div>

          {/* Payment Card */}
          <div className="bg-card border border-border/60 rounded-xl shadow-sm p-6 space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Payment Status
            </h3>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground capitalize">
                {order.paymentStatus.toLowerCase().replace("_", " ")}
              </span>
              {order.paymentStatus === "CAPTURED" && (
                <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full border border-green-100">
                  Paid
                </span>
              )}
            </div>
            {order.payments[0] && (
              <div className="pt-3 border-t border-border/40 text-xs text-muted-foreground">
                <p>Via: {order.payments[0].provider}</p>
                <p className="font-mono mt-1 break-all">ID: {order.payments[0].providerRef}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
