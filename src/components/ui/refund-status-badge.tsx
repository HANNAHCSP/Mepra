// src/components/ui/refund-status-badge.tsx
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { RefundStatus } from '@prisma/client';

const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold capitalize',
  {
    variants: {
      status: {
        REQUESTED: 'border-transparent bg-yellow-100 text-yellow-800',
        PROCESSING: 'border-transparent bg-blue-100 text-blue-800',
        SUCCEEDED: 'border-transparent bg-green-100 text-green-800',
        FAILED: 'border-transparent bg-red-100 text-red-800',
      },
    },
  }
);

interface RefundStatusBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  status: RefundStatus;
}

export function RefundStatusBadge({ className, status, ...props }: RefundStatusBadgeProps) {
  return (
    <div className={cn(badgeVariants({ status }), className)} {...props}>
      {status.toLowerCase()}
    </div>
  );
}