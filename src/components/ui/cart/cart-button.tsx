import { getCart } from "@/app/actions/cart";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";

export default async function CartButton() {
  const cart = await getCart();
  const itemCount = cart?.items.reduce((acc, item) => acc + item.quantity, 0) ?? 0;

  return (
    <Link
      href="/cart"
      className="inline-flex items-center gap-2 text-gray-700 hover:text-amber-500"
    >
      <ShoppingBag size={16} />
      <span className="uppercase">Cart</span>
      <span className="ml-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-green-500 px-1 text-[10px] font-bold text-white">
        {itemCount}
      </span>
    </Link>
  );
}