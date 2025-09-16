// src/components/ui/checkout/upgrade-account-card.tsx
'use client';

import { useState, useTransition } from "react";
import { Lock, Mail } from "lucide-react";
import { toast } from "sonner";
// We will create this server action next
import { issueUpgradeInviteAction } from "@/app/actions/orders"; 

interface UpgradeAccountCardProps {
  orderId: string;
  customerEmail: string;
}

export default function UpgradeAccountCard({ orderId, customerEmail }: UpgradeAccountCardProps) {
  const [isPending, startTransition] = useTransition();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(async () => {
      // This is no longer placeholder logic
      const result = await issueUpgradeInviteAction(orderId, customerEmail);
      if (result.success) {
        toast.success("Check your email for a link to create your account!");
        setIsSubmitted(true);
      } else {
        toast.error(result.error || "Something went wrong. Please try again.");
      }
    });
  };

  if (isSubmitted) {
    return (
      <div className="mt-8 rounded-lg border bg-gray-50 p-6 text-center">
        <Mail className="mx-auto h-12 w-12 text-green-500" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">
          Magic Link Sent!
        </h3>
        <p className="mt-1 text-sm text-gray-600">
          A link to create your account has been sent to{" "}
          <span className="font-semibold">{customerEmail}</span>.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 rounded-lg border bg-white p-6 shadow-sm">
      <h3 className="text-lg font-medium text-gray-900">
        Create an account for more perks
      </h3>
      <ul className="mt-4 list-inside list-disc space-y-2 text-sm text-gray-600">
        <li>Track your order status and shipment</li>
        <li>Save addresses for faster checkouts</li>
        <li>View your order history</li>
        <li>Manage returns easily</li>
      </ul>
      <form onSubmit={handleSubmit} className="mt-6">
        <div className="flex items-center">
          <Lock className="mr-2 h-4 w-4 text-gray-400" />
          <p className="flex-1 rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-600">
            {customerEmail}
          </p>
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="mt-4 w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50"
        >
          {isPending ? "Sending..." : "Create Account with Magic Link"}
        </button>
      </form>
    </div>
  );
}