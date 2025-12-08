import Link from "next/link";
import ProductForm from "@/components/ui/admin/product-form";
import { ArrowLeft } from "lucide-react";

export default function NewProductPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/products" className="p-2 rounded-full hover:bg-accent transition-colors">
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </Link>
        <div>
          <h1 className="text-2xl font-light text-foreground">Add New Product</h1>
          <p className="text-sm text-muted-foreground">Create a new item in your catalog.</p>
        </div>
      </div>

      <ProductForm />
    </div>
  );
}
