// src/app/(main)/products/[handle]/page.tsx
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { notFound } from "next/navigation";
import VariantSelector from "@/components/ui/products/variant-selector";
import { ProductVariantWithAttributes } from "@/types/product";
import { getCart } from "@/app/actions/cart";
import { Metadata, ResolvingMetadata } from "next";

// Generate dynamic metadata for the product page
export async function generateMetadata(
  { params }: { params: { handle: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const product = await prisma.product.findUnique({
    where: { handle: params.handle },
  });

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `${product.name} | Mepra`,
    description: product.description,
    openGraph: {
      title: `${product.name} | Mepra`,
      description: product.description,
      images: [product.imageUrl || "/placeholder.svg", ...previousImages],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: { handle: string };
}) {
  const [product, cart] = await Promise.all([
    prisma.product.findUnique({
      where: { handle: params.handle },
      include: {
        variants: {
          orderBy: {
            id: 'asc'
          }
        },
      },
    }),
    getCart(),
  ]);

  if (!product || product.variants.length === 0) {
    notFound();
  }
  
  return (
    <div className="bg-white">
      <div className="pt-6">
        <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:gap-x-8 lg:px-8">
          <div className="aspect-h-4 aspect-w-3 hidden overflow-hidden rounded-lg lg:block">
            <Image
              src={product.imageUrl || "/placeholder.svg"}
              alt={product.name}
              width={800}
              height={800}
              className="h-full w-full object-cover object-center"
            />
          </div>
        </div>
        <div className="mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pb-24 lg:pt-16">
          <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              {product.name}
            </h1>
          </div>
          <div className="mt-4 lg:row-span-3 lg:mt-0">
            <VariantSelector
              variants={product.variants as ProductVariantWithAttributes[]}
              cart={cart}
            />
          </div>
          <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pb-16 lg:pr-8 lg:pt-6">
            <div>
              <h3 className="sr-only">Description</h3>
              <div className="space-y-6">
                <p className="text-base text-gray-900">{product.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}