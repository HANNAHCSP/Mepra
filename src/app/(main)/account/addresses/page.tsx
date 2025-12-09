import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AddressCard } from "@/components/ui/account/address-card";
import { AddressModal } from "@/components/ui/account/address-modal"; // <--- Import
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function AddressesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/signin");
  }

  const addresses = await prisma.address.findMany({
    where: { userId: session.user.id },
    orderBy: { isDefault: "desc" },
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-light text-foreground">Addresses</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage your saved shipping locations.
          </p>
        </div>
        <AddressModal /> {/* <--- The "Add New" button is default trigger */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {addresses.length > 0 ? (
          addresses.map((address) => <AddressCard key={address.id} address={address} />)
        ) : (
          <div className="col-span-full py-12 text-center border-2 border-dashed border-border rounded-xl bg-accent/30">
            <p className="text-muted-foreground mb-4">You have no saved addresses.</p>
            <AddressModal
              trigger={
                <Button variant="secondary">
                  <Plus className="w-4 h-4 mr-2" /> Add First Address
                </Button>
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}
