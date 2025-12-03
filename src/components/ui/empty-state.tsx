// src/components/ui/empty-state.tsx
import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4 border-2 border-dashed border-border rounded-lg bg-accent/30">
      <div className="bg-muted/50 p-4 rounded-full mb-4">
        <Icon className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-medium text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground text-center max-w-sm mb-6">{description}</p>
      {actionLabel && (actionHref || onAction) && (
        <>
          {actionHref ? (
            <Link
              href={actionHref}
              className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 hover:shadow-md transition-all duration-200 active:scale-[0.98]"
            >
              {actionLabel}
            </Link>
          ) : (
            <Button onClick={onAction} size="lg">
              {actionLabel}
            </Button>
          )}
        </>
      )}
    </div>
  );
}