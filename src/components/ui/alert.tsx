import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { AlertTriangle, CheckCircle, XCircle, Info } from "lucide-react";

import { cn } from "@/lib/utils";

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
        success: "border-green-200 bg-green-50 text-green-900 [&>svg]:text-green-600",
        warning: "border-amber-200 bg-amber-50 text-amber-900 [&>svg]:text-amber-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  icon?: React.ReactNode;
  title?: string;
  message?: string;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, icon, title, message, children, ...props }, ref) => {
    // Auto-select icon based on variant if not provided
    let IconComponent = icon;
    if (!IconComponent) {
      if (variant === "destructive") IconComponent = <XCircle className="h-4 w-4" />;
      else if (variant === "success") IconComponent = <CheckCircle className="h-4 w-4" />;
      else if (variant === "warning") IconComponent = <AlertTriangle className="h-4 w-4" />;
      else IconComponent = <Info className="h-4 w-4" />;
    }

    return (
      <div ref={ref} role="alert" className={cn(alertVariants({ variant }), className)} {...props}>
        {IconComponent}
        {title && <h5 className="mb-1 font-medium leading-none tracking-tight">{title}</h5>}
        <div className="text-sm [&_p]:leading-relaxed">{message || children}</div>
      </div>
    );
  }
);
Alert.displayName = "Alert";

export { Alert, alertVariants };
