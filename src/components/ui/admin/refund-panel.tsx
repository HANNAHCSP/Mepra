// src/components/ui/admin/refund-panel.tsx
'use client';

import { useTransition } from 'react';
import { toast } from 'sonner';
import { processRefundAction } from '@/app/actions/refund';
import { Button } from '@/components/ui/button';
import { RefundStatusBadge } from '@/components/ui/refund-status-badge';
import type { Order, Refund, User } from '@prisma/client';

type RefundWithUser = Refund & { requestedByUser: User | null };
type OrderWithRefunds = Order & { refunds: RefundWithUser[] };

interface RefundPanelProps {
  order: OrderWithRefunds;
}

export default function RefundPanel({ order }: RefundPanelProps) {
  const [isPending, startTransition] = useTransition();

  const handleProcess = (refundId: string, action: 'approve' | 'deny') => {
    startTransition(async () => {
      try {
        await processRefundAction(refundId, action);
        toast.success(`Refund request has been ${action}d.`);
      } catch (error: Error | unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to process refund.';
        toast.error(errorMessage);
      }
    });
  };

  const pendingRefunds = order.refunds.filter(r => r.status === 'REQUESTED');
  const processedRefunds = order.refunds.filter(r => r.status !== 'REQUESTED');

  return (
    <div className="bg-white border rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold p-4 border-b">Refunds</h2>
      
      {pendingRefunds.length > 0 && (
        <div className="p-4 bg-yellow-50 border-b">
          <h3 className="font-medium text-yellow-800">Pending Requests</h3>
          <ul className="mt-2 space-y-3">
            {pendingRefunds.map(refund => (
              <li key={refund.id} className="p-3 bg-white rounded-md border">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-gray-800">${(refund.amountCents / 100).toFixed(2)}</p>
                      <p className="text-sm text-gray-600">Reason: {refund.reason || 'N/A'}</p>
                      <p className="text-xs text-gray-500 pt-1">
                        Req by {refund.requestedByUser?.name || 'Customer'} on {new Date(refund.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Button size="sm" variant="destructive" onClick={() => handleProcess(refund.id, 'deny')} disabled={isPending}>Deny</Button>
                      <Button size="sm" onClick={() => handleProcess(refund.id, 'approve')} disabled={isPending}>Approve</Button>
                    </div>
                  </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {processedRefunds.length > 0 && (
        <div className="p-4">
          <h3 className="font-medium text-gray-700">History</h3>
          <ul className="mt-2 space-y-2 text-sm">
            {processedRefunds.map(refund => (
              <li key={refund.id} className="flex justify-between items-center text-gray-700">
                <span>{new Date(refund.updatedAt).toLocaleDateString()}</span>
                <span>${(refund.amountCents / 100).toFixed(2)}</span>
                <RefundStatusBadge status={refund.status} />
              </li>
            ))}
          </ul>
        </div>
      )}

      {order.refunds.length === 0 && (
        <p className="p-4 text-sm text-gray-500">No refunds for this order.</p>
      )}
    </div>
  );
}