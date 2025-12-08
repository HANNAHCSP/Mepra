import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Plus, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import DeleteProductButton from "@/components/ui/admin/delete-product-button";
import UnarchiveProductButton from "@/components/ui/admin/unarchive-product-button"; // <--- Import

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { variants: true },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-light text-primary">Products</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your catalog ({products.length} items)
          </p>
        </div>
        <Link href="/admin/products/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" /> Add Product
          </Button>
        </Link>
      </div>

      <div className="bg-card rounded-xl border border-border/60 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase tracking-wider text-muted-foreground bg-accent/50 font-medium">
              <tr>
                <th className="px-6 py-4">Image</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-accent/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="relative h-10 w-10 rounded border border-border overflow-hidden bg-white">
                      <Image
                        src={product.imageUrl || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-foreground">
                    {product.name}
                    {/* Updated Badge with Burgundy color */}
                    {product.isArchived && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-burgundy/10 text-burgundy border border-burgundy/20">
                        Archived
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-secondary/10 text-secondary text-xs">
                      {product.category || "Uncategorized"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    ${((product.variants[0]?.price || 0) / 100).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {product.variants[0]?.stock || 0}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {/* Show Unarchive OR Edit based on status */}
                      {product.isArchived ? (
                        <UnarchiveProductButton productId={product.id} />
                      ) : (
                        <Link href={`/admin/products/${product.id}`}>
                          <button
                            className="text-muted-foreground hover:text-blue-600 transition-colors p-2"
                            title="Edit Product"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </Link>
                      )}

                      {/* Delete is always available (it either archives or hard deletes) */}
                      <DeleteProductButton productId={product.id} />
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    No products found. Click &quot;Add Product&quot; to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
