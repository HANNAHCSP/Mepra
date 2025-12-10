import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { z } from "zod";
import { ShippingAddressSchema } from "@/lib/zod-schemas";
import RefundPanel from "@/components/ui/admin/refund-panel";
import FulfillmentCard from "@/components/ui/admin/fulfillment-card";
import MarkPaidButton from "@/components/ui/admin/mark-paid-button";
import { ArrowLeft, Mail, MapPin, Phone, Printer, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type ShippingAddress = z.infer<typeof ShippingAddressSchema>;

export default async function AdminOrderDetailsPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;

  // Fetch order with all necessary relations for logic
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
        include: {
          requestedByUser: true,
          payment: true, // <--- Critical for Refund Panel logic
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!order) notFound();

  // Safe parse address
  let shippingAddress: ShippingAddress;
  try {
    shippingAddress = ShippingAddressSchema.parse(order.shippingAddress);
  } catch (e) {
    // Fallback for old/invalid data
    shippingAddress = {
      firstName: "Unknown",
      lastName: "User",
      email: order.customerEmail,
      address: "Address unavailable",
      city: "",
      state: "",
      country: "",
      zipCode: "",
    };
  }

  // Determine Payment Method Name for Display
  const paymentMethod =
    order.payments.length > 0
      ? order.payments[0].provider === "CASH_ON_DELIVERY"
        ? "Cash on Delivery"
        : "Credit Card (Paymob)"
      : "Unpaid";

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/orders"
            className="p-2 rounded-full hover:bg-accent transition-colors border border-border"
          >
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-light text-foreground">Order #{order.orderNumber}</h1>
              <Badge status={order.status}>{order.status}</Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
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

        <Link href={`/orders/${order.id}/invoice`} target="_blank">
          <Button variant="outline" size="sm" className="gap-2">
            <Printer className="w-4 h-4" /> Print Invoice
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN: Order Details & Refunds */}
        <div className="lg:col-span-2 space-y-8">
          {/* Order Items Table */}
          <div className="bg-card border border-border/60 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-border/60 bg-muted/20">
              <h2 className="font-medium text-foreground">Items Ordered</h2>
            </div>
            <ul className="divide-y divide-border/40">
              {order.items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-start gap-6 p-6 hover:bg-muted/5 transition-colors"
                >
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-border bg-white">
                    <Image
                      src={item.variant.product.imageUrl ?? "/placeholder.svg"}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-grow">
                    <p className="font-medium text-base text-foreground">{item.name}</p>
                    <div className="flex flex-wrap gap-4 mt-1 text-sm text-muted-foreground">
                      <p>
                        SKU:{" "}
                        <span className="font-mono text-foreground">
                          {item.variant.sku ?? "N/A"}
                        </span>
                      </p>
                      {/* Add size here if you added customization later */}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground mb-1">
                      {item.quantity} x ${(item.price / 100).toFixed(2)}
                    </p>
                    <p className="font-medium text-foreground">
                      ${((item.price * item.quantity) / 100).toFixed(2)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="p-6 bg-muted/20 border-t border-border/60 flex justify-end">
              <div className="w-64 space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Subtotal</span>
                  <span>${(order.total / 100).toFixed(2)}</span>
                </div>
                {/* Add shipping cost line here if you stored it separately */}
                <div className="flex justify-between text-lg font-medium text-foreground pt-3 border-t border-border/40 mt-1">
                  <span>Total Paid</span>
                  <span>${(order.total / 100).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Refund Panel (Logic handled inside component) */}
          <RefundPanel order={order} />
        </div>

        {/* RIGHT COLUMN: Sidebar Info */}
        <div className="space-y-6">
          {/* Fulfillment Action */}
          {(order.status === "CONFIRMED" || order.status === "SHIPPED") && (
            <FulfillmentCard order={order} />
          )}

          {/* Payment Status Card */}
          <div className="bg-card border border-border/60 rounded-xl shadow-sm p-6 space-y-5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Payment Details
            </h3>

            <div className="flex justify-between items-center pb-4 border-b border-border/40">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary/10 rounded-md text-secondary">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{paymentMethod}</p>
                  <p className="text-xs text-muted-foreground capitalize">
                    Status: {order.paymentStatus.toLowerCase().replace("_", " ")}
                  </p>
                </div>
              </div>
              {order.paymentStatus === "CAPTURED" ? (
                <span className="px-2.5 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                  Paid
                </span>
              ) : (
                <span className="px-2.5 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                  Pending
                </span>
              )}
            </div>

            {/* Mark as Paid Action (Only for Pending COD) */}
            {order.paymentStatus === "PENDING" &&
              order.payments.some((p) => p.provider === "CASH_ON_DELIVERY") && (
                <MarkPaidButton orderId={order.id} />
              )}

            {/* Technical Details */}
            {order.payments[0] && (
              <div className="text-xs text-muted-foreground space-y-1 pt-2">
                <p>Provider: {order.payments[0].provider}</p>
                <p className="font-mono break-all">Ref: {order.payments[0].providerRef || "N/A"}</p>
              </div>
            )}
          </div>

          {/* Customer Card */}
          <div className="bg-card border border-border/60 rounded-xl shadow-sm p-6 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Customer
            </h3>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                {(order.user?.name ?? shippingAddress.firstName)[0]}
              </div>
              <div>
                <p className="font-medium text-foreground text-sm">
                  {order.user?.name ?? `${shippingAddress.firstName} ${shippingAddress.lastName}`}
                </p>
                <div className="space-y-1 mt-1">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Mail className="w-3 h-3" /> {order.customerEmail}
                  </div>
                  {shippingAddress.phone && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Phone className="w-3 h-3" /> {shippingAddress.phone}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Address Card */}
          <div className="bg-card border border-border/60 rounded-xl shadow-sm p-6 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Shipping Address
            </h3>
            <div className="flex gap-3">
              <MapPin className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
              <address className="text-sm text-foreground not-italic leading-relaxed">
                {shippingAddress.address}
                <br />
                {shippingAddress.apartment && (
                  <>
                    {shippingAddress.apartment}
                    <br />
                  </>
                )}
                {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}
                <br />
                {shippingAddress.country}
              </address>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
