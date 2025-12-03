// src/components/ui/loading-button.tsx
import * as React from "react";
import { Loader2 } from "lucide-react";
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LoadingButtonProps extends ButtonProps {
  loading?: boolean;
  loadingText?: string;
}

export function LoadingButton({
  children,
  loading,
  loadingText,
  disabled,
  className,
  ...props
}: LoadingButtonProps) {
  return (
    <Button disabled={disabled || loading} className={cn(className)} {...props}>
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {loadingText || children}
        </>
      ) : (
        children
      )}
    </Button>
  );
}
