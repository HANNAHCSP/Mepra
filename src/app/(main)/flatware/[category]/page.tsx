import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ui/products/product-card";
import { ChevronRight } from "lucide-react";
import { Prisma } from "@prisma/client";

type ProductWithVariant = Prisma.ProductGetPayload<{
  include: {
    variants: {
      orderBy: { price: "asc" };
      take: 1;
    };
  };
}>;

const categoryMap: Record<string, { title: string; desc: string }> = {
  "cutlery-sets": { title: "Cutlery Sets", desc: "Complete services for 6, 12, or more guests." },
  "daily-use": { title: "Daily Use Sets", desc: "Durable elegance for your everyday meals." },
  spoons: { title: "Spoons", desc: "Table spoons, dessert spoons, coffee spoons, and more." },
  forks: { title: "Forks", desc: "Dinner forks, salad forks, and serving forks." },
  knives: { title: "Knives", desc: "Steak knives, table knives, and butter knives." },
  servings: { title: "Serving Pieces", desc: "Ladles, cake servers, and serving sets." },
};

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const data = categoryMap[category];
  if (!data) return { title: "Category Not Found" };

  return {
    title: `${data.title} | Mepra Flatware`,
    description: `Shop our collection of Italian ${data.title.toLowerCase()}.`,
  };
}

export default async function FlatwareCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const data = categoryMap[category];

  if (!data) {
    notFound();
  }

  // Fetch Products
  let products: ProductWithVariant[] = await prisma.product.findMany({
    take: 50,
    include: {
      variants: {
        orderBy: { price: "asc" },
        take: 1,
      },
    },
  });

  // Fallback Data if DB is empty
  if (products.length === 0) {
    products = Array.from({ length: 12 }).map((_, i) => {
      const dummyVariant: ProductWithVariant["variants"][0] = {
        id: `var-${i}`,
        productId: `dummy-${i}`,
        sku: `SKU-${i}`,
        price: 12500 + i * 5000,
        stock: 10,
        attributes: null,
      };

      return {
        id: `dummy-${i}`,
        name: `Mepra ${data.title} - Model ${i + 1}`,
        handle: `placeholder-product-${i}`,
        description: "Authentic Italian craftsmanship with 18/10 stainless steel.",
        imageUrl: "/placeholder.svg",
        createdAt: new Date(),
        updatedAt: new Date(),
        variants: [dummyVariant],
      };
    });
  }

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/flatware" className="hover:text-foreground transition-colors">
              Flatware
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground font-medium">{data.title}</span>
          </nav>

          <div className="max-w-2xl">
            <h1 className="text-4xl font-light text-foreground mb-3">{data.title}</h1>
            <p className="text-muted-foreground leading-relaxed">{data.desc}</p>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              handle={product.handle}
              imageUrl={product.imageUrl}
              price={product.variants[0]?.price ?? 0}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
