'use client';

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  const gotours = () => {
    router.push("/admin/EcoTours");
  }

  if (status === "loading") {
    return <div className="p-8">Loading...</div>;
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Welcome, {session.user?.name}!</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Email:</p>
              <p className="font-semibold">{session.user?.email}</p>
            </div>
            <div>
              <p className="text-gray-600">User ID:</p>
              <p className="font-semibold">{session.user?.id}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded shadow p-6">
            <h3 className="text-lg font-semibold mb-2">Tours</h3>
            <p className="text-gray-600">Manage eco-tour listings</p>
            <button onClick={gotours} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              View Tours
            </button>
          </div>

          <div className="bg-white rounded shadow p-6">
            <h3 className="text-lg font-semibold mb-2">Bookings</h3>
            <p className="text-gray-600">View customer bookings</p>
            <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              View Bookings
            </button>
          </div>

          <div className="bg-white rounded shadow p-6">
            <h3 className="text-lg font-semibold mb-2">Users</h3>
            <p className="text-gray-600">Manage admin users</p>
            <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Manage Users
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}