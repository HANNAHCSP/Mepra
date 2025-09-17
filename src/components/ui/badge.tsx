import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { OrderStatus } from '@prisma/client';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      status: {
        PENDING: 'border-transparent bg-yellow-100 text-yellow-800',
        CONFIRMED: 'border-transparent bg-blue-100 text-blue-800',
        SHIPPED: 'border-transparent bg-green-100 text-green-800',
        DELIVERED: 'border-transparent bg-emerald-100 text-emerald-800',
        CANCELED: 'border-transparent bg-gray-100 text-gray-800',
        REFUNDED: 'border-transparent bg-purple-100 text-purple-800',
        DRAFT: 'border-transparent bg-gray-100 text-gray-500',
      },
    },
    defaultVariants: {
      status: 'PENDING',
    },
  }
);

// We define a more specific props interface
export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  status: OrderStatus; // Use the precise enum from Prisma
}

function Badge({ className, status, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ status }), className)} {...props}>
      {/* Render children (the text) and convert to lowercase for display */}
      {children ? String(children).toLowerCase() : status.toLowerCase()}
    </div>
  );
}

export { Badge, badgeVariants };