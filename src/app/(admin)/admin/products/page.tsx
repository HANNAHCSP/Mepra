import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Plus, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import DeleteProductButton from "@/components/ui/admin/delete-product-button";
import UnarchiveProductButton from "@/components/ui/admin/unarchive-product-button";
import AdminSearch from "@/components/ui/admin/admin-search"; // <--- Import

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  const products = await prisma.product.findMany({
    where: q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { category: { contains: q, mode: "insensitive" } },
          ],
        }
      : undefined,
    orderBy: { createdAt: "desc" },
    include: { variants: true },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-light text-primary">Products</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your catalog ({products.length} items)
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search Bar */}
          <AdminSearch placeholder="Search products..." />

          <Link href="/admin/products/new">
            <Button className="gap-2">
              <Plus className="w-4 h-4" /> Add
            </Button>
          </Link>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border/60 shadow-sm overflow-hidden">
        {/* ... Table code remains exactly the same ... */}
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

                      <DeleteProductButton productId={product.id} />
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    No products found matching &quot;{q}&quot;.
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
