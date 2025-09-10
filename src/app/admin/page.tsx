// app/admin/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma"; // optional if you want to query
//import SignOutButton from "@/components/signout-button"; // optional if you built it

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  // Defense-in-depth: if somehow reached, re-check.
  if (!session || session.user.role !== "admin") {
    redirect("/");
  }

  // (Optional) Example query: load users to prove it's admin-only
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        {/* Optional sign out button */}
        {/*
        <SignOutButton />
        */}
      </div>

      <p className="mt-2 text-gray-600">
        Welcome, {session.user.name ?? "admin"}.
      </p>

      <section className="mt-8">
        <h2 className="text-lg font-medium mb-3">All Users</h2>
        <div className="overflow-x-auto rounded border border-gray-200">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left font-medium text-gray-700">Name</th>
                <th className="px-3 py-2 text-left font-medium text-gray-700">Email</th>
                <th className="px-3 py-2 text-left font-medium text-gray-700">Role</th>
                <th className="px-3 py-2 text-left font-medium text-gray-700">Created</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t">
                  <td className="px-3 py-2">{u.name}</td>
                  <td className="px-3 py-2">{u.email}</td>
                  <td className="px-3 py-2">
                    <span
                      className={`inline-flex items-center rounded px-2 py-0.5 text-xs ${
                        u.role === "admin"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    {new Date(u.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td className="px-3 py-4 text-gray-500" colSpan={4}>
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
