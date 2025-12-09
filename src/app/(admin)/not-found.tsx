import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function AdminNotFound() {
  return (
    <div className="h-[80vh] flex flex-col items-center justify-center text-center space-y-6">
      <h1 className="text-6xl font-light text-muted-foreground/30">404</h1>
      <div>
        <h2 className="text-2xl font-medium text-foreground">Page Not Found</h2>
        <p className="text-muted-foreground mt-1">This admin route does not exist.</p>
      </div>
      <Link href="/admin">
        <Button variant="outline" className="gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Button>
      </Link>
    </div>
  );
}
