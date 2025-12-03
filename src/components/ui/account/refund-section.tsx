// src/components/ui/account/refund-section.tsx
'use client';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';
import { requestRefundAction } from '@/app/actions/refund';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RefundStatusBadge } from '@/components/ui/refund-status-badge';
import type { Order, Payment, Refund } from '@prisma/client';
import { PaymentStatus } from '@prisma/client';

type OrderWithRefunds = Order & { 
  payments: (Payment & { refunds: Refund[] })[];
  refunds: Refund[];
};

interface RefundSectionProps {
  order: OrderWithRefunds;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto mt-2">
      {pending ? 'Submitting...' : 'Request Refund'}
    </Button>
  );
}

export default function RefundSection({ order }: RefundSectionProps) {
  const [state, formAction] = useActionState(requestRefundAction, {
    success: false,
    message: '',
  });

  useEffect(() => {
    if (state.message) {
      void (state.success ? toast.success(state.message) : toast.error(state.message));
    }
  }, [state]);

  const capturedPayment = order.payments.find(p => p.status === PaymentStatus.CAPTURED);
  const totalRefunded = capturedPayment?.refunds
      .filter(r => r.status === 'SUCCEEDED')
      .reduce((sum, r) => sum + r.amountCents, 0) ?? 0;
  const refundableBalance = (capturedPayment?.amount ?? 0) - totalRefunded;

  const canRequestRefund = order.paymentStatus === PaymentStatus.CAPTURED && refundableBalance > 0;

  return (
    <div className="p-6 border rounded-lg bg-white shadow-sm mt-8">
      <h3 className="text-lg font-semibold text-gray-800">Refunds</h3>
      
      {order.refunds.length > 0 ? (
        <ul className="mt-4 space-y-3">
          {order.refunds.map(refund => (
            <li key={refund.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
              <div>
                <p className="font-medium text-gray-700">
                  ${(refund.amountCents / 100).toFixed(2)}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(refund.createdAt).toLocaleDateString()}
                </p>
              </div>
              <RefundStatusBadge status={refund.status} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm text-gray-500">No refunds have been requested for this order.</p>
      )}

      {canRequestRefund && (
        <div className="mt-6 border-t pt-4">
            <p className="text-sm font-medium text-gray-700">
                Refundable Balance: <span className="font-bold">${(refundableBalance / 100).toFixed(2)}</span>
            </p>
            <form action={formAction} className="mt-4 space-y-4 max-w-sm">
                <input type="hidden" name="orderId" value={order.id} />
                <div>
                    <label htmlFor="amountCents" className="block text-sm font-medium">Amount (in cents)</label>
                    <Input 
                        id="amountCents"
                        name="amountCents"
                        type="number"
                        max={refundableBalance}
                        defaultValue={refundableBalance}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="reason" className="block text-sm font-medium">Reason (optional)</label>
                    <Input id="reason" name="reason" type="text" placeholder="e.g., Damaged item" />
                </div>
                <SubmitButton />
            </form>
        </div>
      )}
    </div>
  );
}