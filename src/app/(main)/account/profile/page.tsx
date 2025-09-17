// src/app/(main)/account/profile/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProfileForm from "@/components/ui/account/profile-form";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect('/signin');
  }

  // Fetch the latest user data from the database
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true },
  });

  if (!user) {
    // This case should be rare if a session exists, but it's good practice
    redirect('/signin');
  }

  return (
    <div className="space-y-6">
       <div>
        <h1 className="text-2xl font-bold">My Profile</h1>
        <p className="text-gray-500 mt-1">Manage your personal details and password.</p>
      </div>
      <ProfileForm user={user} />
    </div>
  );
}