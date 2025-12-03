import { searchProducts } from "@/app/actions/product";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { SearchFilters } from "@/components/ui/search/search-filters";
import { SearchBox } from "@/components/ui/search/search-box";
import { PackageSearch } from "lucide-react";

export async function generateMetadata(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<Metadata> {
  const searchParams = await props.searchParams;
  const query = typeof searchParams.q === "string" ? searchParams.q : undefined;

  return {
    title: query ? `Search: ${query} | Mepra` : "Search Products | Mepra",
    description: `Browse our collection for ${query || "products"}.`,
    robots: { index: true, follow: true },
  };
}

export default async function SearchPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;

  const query = typeof searchParams.q === "string" ? searchParams.q : undefined;
  const minPrice = typeof searchParams.min === "string" ? searchParams.min : undefined;
  const maxPrice = typeof searchParams.max === "string" ? searchParams.max : undefined;
  const sort = typeof searchParams.sort === "string" ? searchParams.sort : "newest";

  const products = await searchProducts({ query, minPrice, maxPrice, sort });

  return (
    // Background is now the variable (Off-White)
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="flex flex-col gap-6 border-b border-border pb-8 mb-8">
          <h1 className="text-3xl font-light tracking-tight text-foreground">
            {query ? (
              <>
                Results for{" "}
                <span className="font-semibold italic text-primary">&quot;{query}&quot;</span>
              </>
            ) : (
              "All Products"
            )}
          </h1>
          <div className="w-full max-w-xl">
            <SearchBox />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-x-12 gap-y-10">
          <aside className="lg:col-span-1">
            <SearchFilters />
          </aside>

          <div className="lg:col-span-3">
            {products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 px-4 text-center border-2 border-dashed border-border rounded-lg bg-card/50">
                <div className="bg-muted p-4 rounded-full shadow-sm mb-4">
                  <PackageSearch className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground">No products found</h3>
                <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
                  We couldn&apos;t find anything matching your criteria. Try different keywords or
                  remove some filters.
                </p>
                <div className="mt-6">
                  <Link
                    href="/search"
                    // Primary button style
                    className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    Clear all filters
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
                {products.map((product) => (
                  <Link key={product.id} href={`/products/${product.handle}`} className="group">
                    {/* Card background is white to stand out from off-white page */}
                    <div className="aspect-[3/4] w-full overflow-hidden rounded-lg bg-white border border-border relative">
                      <Image
                        src={product.imageUrl || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      />
                    </div>
                    <div className="mt-4 flex justify-between items-start">
                      <div>
                        {/* Hover text becomes Gold/Secondary */}
                        <h3 className="text-sm font-medium text-foreground group-hover:text-secondary transition-colors">
                          {product.name}
                        </h3>
                        <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                          {product.description}
                        </p>
                      </div>
                      {product.variants[0] && (
                        <p className="text-sm font-medium text-primary ml-4">
                          ${(product.variants[0].price / 100).toFixed(2)}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
