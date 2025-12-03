// src/components/ui/badge.tsx
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { OrderStatus } from "@prisma/client";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold capitalize transition-colors focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2",
  {
    variants: {
      status: {
        PENDING: "border-transparent bg-secondary/10 text-secondary",
        CONFIRMED: "border-transparent bg-primary/10 text-primary",
        SHIPPED: "border-transparent bg-secondary/20 text-secondary",
        DELIVERED: "border-transparent bg-secondary/30 text-secondary",
        CANCELED: "border-transparent bg-muted text-muted-foreground",
        REFUNDED: "border-transparent bg-burgundy/10 text-burgundy",
        DRAFT: "border-transparent bg-muted text-muted-foreground",
      },
    },
    defaultVariants: {
      status: "PENDING",
    },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  status: OrderStatus;
}

function Badge({ className, status, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ status }), className)} {...props}>
      {children ? String(children).toLowerCase() : status.toLowerCase()}
    </div>
  );
}

export { Badge, badgeVariants };
