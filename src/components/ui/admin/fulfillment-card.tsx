"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { fulfillOrderAction } from "@/app/actions/admin-order";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Truck, CheckCircle, Package } from "lucide-react";
import { Order } from "@prisma/client";

interface FulfillmentCardProps {
  order: Order;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full gap-2">
      {pending ? "Processing..." : "Mark as Shipped"}
      {!pending && <Truck className="w-4 h-4" />}
    </Button>
  );
}

export default function FulfillmentCard({ order }: FulfillmentCardProps) {
  const [state, formAction] = useActionState(fulfillOrderAction, {
    success: false,
    message: "",
  });

  // If already shipped, show read-only view
  if (order.status === "SHIPPED" || order.status === "DELIVERED") {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-3 text-green-800 border-b border-green-200 pb-4">
          <CheckCircle className="w-6 h-6" />
          <h3 className="font-medium text-lg">Order Fulfilled</h3>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-green-600 uppercase text-xs font-bold tracking-wider">Carrier</p>
            <p className="text-green-900 font-medium">{order.carrier || "N/A"}</p>
          </div>
          <div>
            <p className="text-green-600 uppercase text-xs font-bold tracking-wider">Tracking #</p>
            <p className="text-green-900 font-medium font-mono">{order.trackingNumber || "N/A"}</p>
          </div>
          <div className="col-span-2">
            <p className="text-green-600 uppercase text-xs font-bold tracking-wider">
              Shipped Date
            </p>
            <p className="text-green-900">
              {order.shippedAt ? new Date(order.shippedAt).toLocaleDateString() : "N/A"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm p-6 space-y-4">
      <div className="flex items-center gap-3 border-b border-border pb-4 mb-4">
        <Package className="w-5 h-5 text-primary" />
        <h3 className="font-medium text-lg text-foreground">Fulfillment</h3>
      </div>

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="orderId" value={order.id} />

        <div className="space-y-2">
          <label className="text-sm font-medium">Carrier</label>
          <div className="relative">
            <select
              name="carrier"
              className="flex h-12 w-full rounded-md border-2 border-input bg-white px-4 py-3 text-sm text-foreground focus-visible:outline-none focus-visible:border-secondary focus-visible:ring-4 focus-visible:ring-secondary/10"
              required
              defaultValue="DHL"
            >
              <option value="DHL">DHL</option>
              <option value="FedEx">FedEx</option>
              <option value="Aramex">Aramex</option>
              <option value="Bosta">Bosta</option>
              <option value="Mylerz">Mylerz</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Tracking Number</label>
          <Input name="trackingNumber" placeholder="e.g. 1234567890" required />
        </div>

        {state.message && (
          <p className={`text-sm ${state.success ? "text-green-600" : "text-red-600"}`}>
            {state.message}
          </p>
        )}

        <SubmitButton />
      </form>
    </div>
  );
}
