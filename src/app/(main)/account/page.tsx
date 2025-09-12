// src/app/(main)/account/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/ui/logout-button";

export default async function AccountPage() {
  const session = await getServerSession(authOptions);

  // Redirect if not authenticated
  if (!session?.user) {
    redirect("/signin");
  }

  // Redirect admins to admin dashboard
  if (session.user.role === "admin") {
    redirect("/admin");
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-light text-gray-900">My Account</h1>
        <LogoutButton variant="danger" size="sm">
          Sign Out
        </LogoutButton>
      </div>

      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <h2 className="text-xl font-medium text-gray-900 mb-4">Welcome back!</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <p className="text-gray-900">{session.user.name || 'Not provided'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <p className="text-gray-900">{session.user.email}</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Order History</h3>
          <p className="text-gray-600 text-sm mb-4">View your past orders and track current ones</p>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View Orders →
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Wishlist</h3>
          <p className="text-gray-600 text-sm mb-4">Items you've saved for later</p>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View Wishlist →
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Profile Settings</h3>
          <p className="text-gray-600 text-sm mb-4">Update your personal information</p>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            Edit Profile →
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-medium text-gray-900 mb-4">Recent Activity</h2>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No recent activity</h3>
          <p className="text-gray-600 text-sm">Start shopping to see your activity here</p>
          <button className="mt-4 bg-black text-white px-6 py-2 text-sm hover:bg-gray-800 transition-colors">
            Browse Products
          </button>
        </div>
      </div>
    </div>
  );
}                   