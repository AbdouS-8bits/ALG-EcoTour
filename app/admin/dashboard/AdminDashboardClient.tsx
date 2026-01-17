'use client';
import { useState, useEffect } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  MapPin, 
  Calendar, 
  Users, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  BarChart3,
  RefreshCw,
  Eye,
  Settings
} from 'lucide-react';
import { AnalyticsData } from '@/lib/analytics';
import BookingsChart from '@/components/admin/BookingsChart';
import { useToast } from '@/components/bookings/Toast';

interface AdminDashboardClientProps {
  analyticsData: AnalyticsData;
}

export default function AdminDashboardClient({ analyticsData: initialData }: AdminDashboardClientProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>(initialData);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  const refreshData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/analytics');
      if (!response.ok) {
        throw new Error('Failed to fetch analytics data');
      }
      const data = await response.json();
      setAnalyticsData(data);
      showToast({
        type: 'success',
        title: 'Data refreshed',
        message: 'Analytics data has been updated'
      });
    } catch (error) {
      console.error('Error refreshing data:', error);
      showToast({
        type: 'error',
        title: 'Refresh failed',
        message: 'Could not refresh analytics data'
      });
    } finally {
      setLoading(false);
    }
  };

  const gotours = () => {
    router.push("/admin/EcoTours");
  };

  const bookings = () => {
    router.push("/admin/bookings");
  };

  const users = () => {
    router.push("/admin/tours");
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const statsCards = [
    {
      title: 'Total Tours',
      value: analyticsData.totalTours,
      icon: MapPin,
      color: 'bg-blue-500',
      change: '+12%',
      changeType: 'increase' as const
    },
    {
      title: 'Total Bookings',
      value: analyticsData.totalBookings,
      icon: Calendar,
      color: 'bg-green-500',
      change: '+23%',
      changeType: 'increase' as const
    },
    {
      title: 'Confirmed Bookings',
      value: analyticsData.confirmedBookings,
      icon: CheckCircle,
      color: 'bg-emerald-500',
      change: '+18%',
      changeType: 'increase' as const
    },
    {
      title: 'Pending Bookings',
      value: analyticsData.pendingBookings,
      icon: Clock,
      color: 'bg-yellow-500',
      change: '+5%',
      changeType: 'increase' as const
    },
    {
      title: 'Total Users',
      value: analyticsData.totalUsers,
      icon: Users,
      color: 'bg-purple-500',
      change: '+8%',
      changeType: 'increase' as const
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={refreshData}
              disabled={loading}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Welcome, {session.user?.name}!</h2>
              <p className="text-gray-600 mt-1">Here's what's happening with your business today</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Email:</p>
              <p className="font-semibold text-gray-900">{session.user?.email}</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className={`flex items-center text-sm ${
                  stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                }`}>
                  <TrendingUp className="w-4 h-4 mr-1" />
                  {stat.change}
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value.toLocaleString()}</p>
                <p className="text-sm text-gray-600">{stat.title}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Chart Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Bookings Per Month</h3>
              <BarChart3 className="w-5 h-5 text-gray-400" />
            </div>
            <BookingsChart data={analyticsData.bookingsPerMonth} />
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Bookings</h3>
            <div className="space-y-4">
              {analyticsData.recentBookings.slice(0, 5).map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{booking.guestName}</p>
                    <p className="text-sm text-gray-600">{booking.guestEmail}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={gotours}>
            <div className="flex items-center justify-between mb-4">
              <MapPin className="w-8 h-8 text-blue-500" />
              <Eye className="w-5 h-5 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Manage Tours</h3>
            <p className="text-gray-600">Create and edit eco-tour listings</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={bookings}>
            <div className="flex items-center justify-between mb-4">
              <Calendar className="w-8 h-8 text-green-500" />
              <Eye className="w-5 h-5 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">View Bookings</h3>
            <p className="text-gray-600">Manage customer bookings</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={users}>
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 text-purple-500" />
              <Settings className="w-5 h-5 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">System Settings</h3>
            <p className="text-gray-600">Configure system preferences</p>
          </div>
        </div>
      </main>
    </div>
  );
}
