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
import { Award, Shield, Truck, ChevronRight } from "lucide-react";
import Link from "next/link";

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
    <div className="bg-background min-h-screen">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <Link href="/products" className="text-muted-foreground hover:text-foreground transition-colors">
              Products
            </Link>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <span className="text-foreground font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product Section */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-2xl bg-white border border-border shadow-lg">
              <Image
                src={product.imageUrl || "/placeholder.svg"}
                alt={product.name}
                width={800}
                height={800}
                className="h-full w-full object-cover object-center"
                priority
              />
            </div>
            
            {/* Thumbnail Gallery (placeholder for future multi-image support) */}
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="aspect-square rounded-lg overflow-hidden bg-muted border border-border opacity-50 cursor-not-allowed"
                >
                  <Image
                    src={product.imageUrl || "/placeholder.svg"}
                    alt={`${product.name} view ${i}`}
                    width={200}
                    height={200}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            {/* Title and Price */}
            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl font-light text-foreground">
                {product.name}
              </h1>
              
              {/* Trust Badges */}
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-secondary/10 text-secondary border border-secondary/20">
                  <Award className="h-3 w-3 mr-1" />
                  Italian Crafted
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                  <Shield className="h-3 w-3 mr-1" />
                  Lifetime Warranty
                </span>
              </div>
            </div>

            {/* Variant Selector */}
            <div className="border-t border-b border-border py-8">
              <VariantSelector
                variants={product.variants as ProductVariantWithAttributes[]}
                cart={cart}
              />
            </div>

            {/* Wishlist Button */}
            <WishlistButton productId={product.id} initialIsWished={isWished} />

            {/* Description */}
            <div className="prose prose-sm max-w-none">
              <h2 className="text-lg font-medium text-foreground mb-3">Description</h2>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4 bg-muted/30 rounded-xl p-6">
              <h3 className="font-medium text-foreground mb-4">Why Choose This Product</h3>
              <div className="space-y-3">
                {[
                  { icon: Shield, text: "Lifetime warranty coverage" },
                  { icon: Award, text: "Handcrafted in Italy" },
                  { icon: Truck, text: "Free worldwide shipping" },
                ].map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <feature.icon className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Info Tabs (Placeholder) */}
      <div className="bg-white border-t border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="space-y-3">
              <div className="w-12 h-12 bg-secondary/10 rounded-full mx-auto flex items-center justify-center">
                <Shield className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="font-medium text-foreground">Secure Shopping</h3>
              <p className="text-sm text-muted-foreground">
                Your payment information is processed securely
              </p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 bg-secondary/10 rounded-full mx-auto flex items-center justify-center">
                <Truck className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="font-medium text-foreground">Fast Delivery</h3>
              <p className="text-sm text-muted-foreground">
                Carefully packaged and shipped within 2-3 business days
              </p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 bg-secondary/10 rounded-full mx-auto flex items-center justify-center">
                <Award className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="font-medium text-foreground">Quality Guarantee</h3>
              <p className="text-sm text-muted-foreground">
                Each piece meets our strict quality standards
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}