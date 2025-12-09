"use client";

import { Printer, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function InvoiceActions() {
  return (
    <div className="flex justify-end gap-3 mb-8 print:hidden">
      <Button variant="outline" onClick={() => window.close()} className="gap-2">
        <X className="w-4 h-4" /> Close
      </Button>
      <Button onClick={() => window.print()} className="gap-2">
        <Printer className="w-4 h-4" /> Print / Save as PDF
      </Button>
    </div>
  );
}
