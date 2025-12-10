import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AddressSelection from "@/components/ui/checkout/address-selection";
import type { Address } from "@prisma/client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping Address - Mepra",
  description: "Select or add your shipping address for checkout",
};

export default async function AddressPage() {
  const session = await getServerSession(authOptions);

  let addresses: Address[] = [];

  if (session?.user?.id) {
    try {
      addresses = await prisma.address.findMany({
        where: { userId: session.user.id },
        orderBy: { isDefault: "desc" },
      });
    } catch (error) {
      console.error("Failed to fetch user addresses:", error);
      // Addresses remain empty array - component will handle gracefully
    }
  }

  return <AddressSelection savedAddresses={addresses} userEmail={session?.user?.email ?? null} />;
}
