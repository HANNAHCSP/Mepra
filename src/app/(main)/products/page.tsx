import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Products | Luxury Italian Tableware",
  description: "Browse our complete collection of handcrafted Italian flatware, cookware, and serveware. Premium quality since 1947.",
  openGraph: {
    title: "All Products | Mepra",
    description: "Browse our complete collection of handcrafted Italian tableware",
    type: "website",
  },
};

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    where: { isArchived: false },
    include: {
      variants: {
        orderBy: {
          price: "asc",
        },
        take: 1,
      },
    },
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="bg-white border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-light tracking-tight text-foreground">
              Our Collection
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover timeless elegance in every piece. Handcrafted in Italy since 1947.
            </p>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {products.length} {products.length === 1 ? 'product' : 'products'}
          </p>
          <Link
            href="/search"
            className="text-sm font-medium text-secondary hover:text-primary transition-colors"
          >
            Advanced Filters →
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-24">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-muted rounded-full mb-4">
              <span className="text-2xl">🏺</span>
            </div>
            <h2 className="text-xl font-medium text-foreground mb-2">No products yet</h2>
            <p className="text-muted-foreground">Check back soon for our latest collection</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {products.map((product) => (
              <div key={product.id} className="group">
                {/* Product Image */}
                <Link href={`/products/${product.handle}`} className="block">
                  <div className="aspect-[3/4] w-full overflow-hidden rounded-xl bg-white border border-border relative">
                    <Image
                      src={product.imageUrl || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover object-center transition-all duration-500 group-hover:scale-110"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-300" />
                  </div>
                </Link>

                {/* Product Info */}
                <div className="mt-4 space-y-2">
                  <Link href={`/products/${product.handle}`}>
                    <h3 className="text-base font-medium text-foreground group-hover:text-secondary transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                  </Link>
                  {product.variants[0] && (
                    <p className="text-lg font-semibold text-primary">
                      ${(product.variants[0].price / 100).toFixed(2)}
                    </p>
                  )}
                </div>

                {/* Quick Add to Cart */}
                <div className="mt-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <Link
                    href={`/products/${product.handle}`}
                    className="block w-full text-center px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm hover:shadow-md"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-secondary/10 to-transparent py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-light text-foreground mb-4">
            Can&apos;t find what you&apos;re looking for?
          </h2>
          <p className="text-muted-foreground mb-6">
            Use our advanced search and filters to find the perfect piece
          </p>
          <Link
            href="/search"
            className="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-all shadow-sm hover:shadow-md"
          >
            Advanced Search
          </Link>
        </div>
      </div>
    </div>
  );
}