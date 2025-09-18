// src/app/(main)/products/[handle]/page.tsx
import Image from "next/image";
import { notFound } from "next/navigation";
import { Metadata, ResolvingMetadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getCart } from "@/app/actions/cart";
import { ProductVariantWithAttributes } from "@/types/product";
import VariantSelector from "@/components/ui/products/variant-selector";
import WishlistButton from "@/components/ui/wishlist/wishlist-button";

export async function generateMetadata(
  { params }: { params: { handle: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const product = await prisma.product.findUnique({
    where: { handle: params.handle },
  });

  if (!product) {
    return { title: "Product Not Found" };
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
  const session = await getServerSession(authOptions);

  const [product, cart, wishlist] = await Promise.all([
    prisma.product.findUnique({
      where: { handle: params.handle },
      include: {
        variants: {
          orderBy: { id: 'asc' }
        },
      },
    }),
    getCart(),
    session?.user?.id ? prisma.wishlist.findUnique({
      where: { userId: session.user.id },
      select: { items: { select: { productId: true } } },
    }) : Promise.resolve(null),
  ]);

  if (!product || product.variants.length === 0) {
    notFound();
  }

  const isWished = !!wishlist?.items.some(item => item.productId === product.id);

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
            <div className="mt-6">
               <WishlistButton productId={product.id} initialIsWished={isWished} />
            </div>
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