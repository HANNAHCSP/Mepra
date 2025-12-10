import { notFound } from "next/navigation";
import { Metadata, ResolvingMetadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getCart } from "@/app/actions/cart";
import { getRelatedProducts } from "@/app/actions/product";
import { ProductVariantWithAttributes } from "@/types/product";
import VariantSelector from "@/components/ui/products/variant-selector";
import WishlistButton from "@/components/ui/wishlist/wishlist-button";
import ReviewsSection from "@/components/ui/products/reviews-section";
import ProductCard from "@/components/ui/products/product-card";
import ProductGallery from "@/components/ui/products/product-gallery";
import { Award, Shield, Truck } from "lucide-react";

type Props = {
  params: Promise<{ handle: string }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { handle } = await params;
  const product = await prisma.product.findUnique({
    where: { handle },
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
      images: [
        ...(product.images.length > 0 ? product.images : [product.imageUrl || "/placeholder.svg"]),
        ...previousImages,
      ],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { handle } = await params;
  const session = await getServerSession(authOptions);

  const [product, cart, wishlist] = await Promise.all([
    prisma.product.findUnique({
      where: { handle },
      include: {
        variants: {
          orderBy: { id: "asc" },
        },
        reviews: {
          orderBy: { createdAt: "desc" },
          include: {
            user: { select: { name: true } },
          },
        },
      },
    }),
    getCart(),
    session?.user?.id
      ? prisma.wishlist.findUnique({
          where: { userId: session.user.id },
          select: { items: { select: { productId: true } } },
        })
      : Promise.resolve(null),
  ]);

  if (!product || product.variants.length === 0) {
    notFound();
  }

  // Fetch related products (Dynamic)
  const realRelatedProducts = await getRelatedProducts(product.id);
  const isWished = !!wishlist?.items.some((item) => item.productId === product.id);
  const galleryImages =
    product.images.length > 0 ? product.images : [product.imageUrl || "/placeholder.svg"];

  // --- SEO: JSON-LD Data Construction ---
  const defaultVariant = product.variants[0];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: galleryImages,
    sku: defaultVariant.sku || product.id,
    brand: {
      "@type": "Brand",
      name: "Mepra",
    },
    offers: {
      "@type": "Offer",
      url: `${process.env.NEXT_PUBLIC_APP_URL}/products/${product.handle}`,
      priceCurrency: "EGP",
      price: (defaultVariant.price / 100).toFixed(2),
      availability:
        defaultVariant.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
    ...(product.reviews.length > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: (
          product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length
        ).toFixed(1),
        reviewCount: product.reviews.length,
      },
    }),
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Inject Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Column: Image Gallery */}
          <div className="h-fit sticky top-24">
            <ProductGallery images={galleryImages} name={product.name} />
          </div>

          {/* Right Column: Product Info */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl font-light text-foreground">{product.name}</h1>
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

            <div className="border-t border-b border-border py-8">
              <VariantSelector
                variants={product.variants as ProductVariantWithAttributes[]}
                cart={cart}
              />
            </div>

            <WishlistButton productId={product.id} initialIsWished={isWished} />

            <div className="prose prose-sm max-w-none">
              <h2 className="text-lg font-medium text-foreground mb-3">Description</h2>
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            </div>

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

        {/* Reviews Section */}
        <div className="mt-24 max-w-4xl border-t border-border pt-16">
          <ReviewsSection productId={product.id} reviews={product.reviews} />
        </div>

        {/* Related Products Section */}
        {realRelatedProducts.length > 0 && (
          <div className="mt-24 pt-16 border-t border-border">
            <h2 className="text-3xl font-light text-foreground mb-12 text-center">
              You Might Also Like
            </h2>
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
              {realRelatedProducts.map((related) => (
                <ProductCard
                  key={related.id}
                  id={related.id}
                  name={related.name}
                  handle={related.handle}
                  imageUrl={related.imageUrl}
                  price={related.variants[0]?.price ?? 0}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
