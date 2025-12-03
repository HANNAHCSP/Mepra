// src/app/(main)/checkout/loading.tsx
import { Skeleton } from "@/components/ui/skeleton";

export default function CheckoutLoading() {
  return (
    <div className="flex min-h-screen flex-col bg-background lg:grid lg:grid-cols-2">
      <main className="flex-grow px-4 pb-24 pt-8 sm:px-6 lg:col-start-1 lg:row-start-1 lg:bg-white lg:px-8 lg:pb-16 lg:pt-16">
        <div className="mx-auto max-w-lg space-y-6">
          <Skeleton className="h-8 w-32 mb-8" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full mt-8" />
        </div>
      </main>

      <aside className="bg-muted/30 px-4 py-8 sm:px-6 sm:py-10 lg:col-start-2 lg:row-start-1 lg:px-8 border-l border-border">
        <div className="mx-auto max-w-lg space-y-6">
          <Skeleton className="h-6 w-40 mb-6" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="h-24 w-24 rounded-md" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))}
          </div>
          <Skeleton className="h-px w-full my-6" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
        </div>
      </aside>
    </div>
  );
}