import Image from "next/image";
import Link from "next/link";
import { Prisma } from "@prisma/client";
import { ProductVariantWithAttributes } from "@/types/product";
import CartItemActions from "@/components/ui/cart/cart-item-actions";

type CartItemWithProduct = Prisma.CartItemGetPayload<{
  include: { variant: { include: { product: true } } };
}>;

export default function CartItem({ item }: { item: CartItemWithProduct }) {
  const { variant } = item;
  const { product } = variant;
  const variantWithAttributes = variant as ProductVariantWithAttributes;

  return (
    <li className="flex py-6 sm:py-10">
      <div className="flex-shrink-0">
        <Image
          src={product.imageUrl ?? "/placeholder.svg"}
          alt={product.name}
          width={96}
          height={96}
          className="h-24 w-24 rounded-md object-cover object-center sm:h-48 sm:w-48"
        />
      </div>

      <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
        <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
          <div>
            <div className="flex justify-between">
              <h3 className="text-sm">
                <Link
                  href={`/products/${product.handle}`}
                  className="font-medium text-gray-700 hover:text-gray-800"
                >
                  {product.name}
                </Link>
              </h3>
            </div>
            <div className="mt-1 flex text-sm">
              {variantWithAttributes.attributes?.size && (
                <p className="text-gray-500">Size: {variantWithAttributes.attributes.size}</p>
              )}
            </div>
            <p className="mt-1 text-sm font-medium text-gray-900">
              ${(variant.price / 100).toFixed(2)}
            </p>
          </div>

          <div className="mt-4 sm:mt-0 sm:pr-9">
            <CartItemActions item={item} />
          </div>
        </div>
      </div>
    </li>
  );
}
