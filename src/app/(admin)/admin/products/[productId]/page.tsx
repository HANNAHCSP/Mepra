import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/ui/admin/product-form";
import DeleteProductButton from "@/components/ui/admin/delete-product-button"; // <--- Import
import { ArrowLeft } from "lucide-react";

interface PageProps {
  params: Promise<{ productId: string }>;
}

export default async function EditProductPage({ params }: PageProps) {
  const { productId } = await params;

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { variants: true },
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header with Navigation and Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/products"
            className="p-2 rounded-full hover:bg-accent transition-colors border border-border"
          >
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </Link>
          <div>
            <h1 className="text-2xl font-light text-foreground">Edit Product</h1>
            <p className="text-sm text-muted-foreground">
              Update details for <span className="font-semibold text-primary">{product.name}</span>
            </p>
          </div>
        </div>

        {/* Delete Action in Header */}
        <div className="flex items-center gap-2">
          <DeleteProductButton productId={product.id} />
        </div>
      </div>

      <ProductForm initialData={product} />
    </div>
  );
}
