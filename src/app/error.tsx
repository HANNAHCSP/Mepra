"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
      <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
        <AlertTriangle className="w-8 h-8 text-red-500" />
      </div>
      <h2 className="text-3xl font-light text-foreground mb-3">Something went wrong!</h2>
      <p className="text-muted-foreground max-w-md mb-8">
        We apologize for the inconvenience. An unexpected error has occurred.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => reset()} className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Try Again
        </Button>
        <Button variant="outline" onClick={() => (window.location.href = "/")}>
          Return Home
        </Button>
      </div>
    </div>
  );
}
