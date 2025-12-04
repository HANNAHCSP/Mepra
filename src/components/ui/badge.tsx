// src/components/ui/badge.tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { OrderStatus } from "@prisma/client";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        // Standard UI Variants
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",

        // Order Status Variants (Mapped as valid variants)
        PENDING: "border-secondary/20 bg-secondary/10 text-secondary hover:bg-secondary/20",
        CONFIRMED: "border-primary/20 bg-primary/5 text-primary hover:bg-primary/10",
        SHIPPED: "border-[#D4C5B8] bg-[#D4C5B8]/20 text-[#6B5E4F]",
        DELIVERED: "border-green-800/10 bg-green-50 text-green-900",
        CANCELED: "border-muted-foreground/20 bg-muted/50 text-muted-foreground",
        REFUNDED: "border-burgundy/20 bg-burgundy/5 text-burgundy",
        RETURN_REQUESTED: "border-amber-500/20 bg-amber-50 text-amber-700",
        DRAFT: "border-transparent bg-muted text-muted-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  status?: OrderStatus; // Optional helper prop for backward compatibility
}

function Badge({ className, variant, status, children, ...props }: BadgeProps) {
  // If 'status' is passed, we treat it as the 'variant'.
  // Otherwise, we use the standard 'variant' prop.
  const finalVariant = status ? (status as VariantProps<typeof badgeVariants>['variant']) : variant;

  return (
    <div className={cn(badgeVariants({ variant: finalVariant }), className)} {...props}>
      {children ? children : status ? String(status).toLowerCase().replace("_", " ") : null}
    </div>
  );
}

export { Badge, badgeVariants };
