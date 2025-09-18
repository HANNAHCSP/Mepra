// src/app/(main)/checkout/address/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AddressSelection from "@/components/ui/checkout/address-selection";
import type { Address } from "@prisma/client"; // Import the Address type

export default async function AddressPage() {
  const session = await getServerSession(authOptions);
  
  // Explicitly type the addresses variable as an array of Address objects.
  let addresses: Address[] = [];

  // If the user is logged in, fetch their saved addresses
  if (session?.user?.id) {
    addresses = await prisma.address.findMany({
      where: { userId: session.user.id },
      orderBy: { isDefault: 'desc' }
    });
  }

  return (
    <AddressSelection savedAddresses={addresses} userEmail={session?.user?.email} />
  );
}