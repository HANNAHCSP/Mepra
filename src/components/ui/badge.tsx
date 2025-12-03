// src/components/ui/badge.tsx
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { OrderStatus } from "@prisma/client";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-wide transition-all duration-300",
  {
    variants: {
      status: {
        PENDING: "border-secondary/20 bg-secondary/10 text-secondary hover:bg-secondary/20",
        CONFIRMED: "border-primary/20 bg-primary/5 text-primary hover:bg-primary/10",
        SHIPPED: "border-[#D4C5B8] bg-[#D4C5B8]/20 text-[#6B5E4F]",
        DELIVERED: "border-green-800/10 bg-green-50 text-green-900", // Keep accessible green but muted
        CANCELED: "border-muted-foreground/20 bg-muted/50 text-muted-foreground",
        REFUNDED: "border-burgundy/20 bg-burgundy/5 text-burgundy",
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
