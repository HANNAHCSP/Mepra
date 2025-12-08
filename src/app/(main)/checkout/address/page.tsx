import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AddressSelection from "@/components/ui/checkout/address-selection";
import type { Address } from "@prisma/client";

export default async function AddressPage() {
  const session = await getServerSession(authOptions);

  // 1. Initialize as empty array
  let addresses: Address[] = [];

  // 2. Fetch addresses ONLY if user is logged in
  if (session?.user?.id) {
    addresses = await prisma.address.findMany({
      where: { userId: session.user.id },
      orderBy: { isDefault: "desc" },
    });
  }

  // 3. Pass the fetched 'addresses' array to the component
  return <AddressSelection savedAddresses={addresses} userEmail={session?.user?.email} />;
}
