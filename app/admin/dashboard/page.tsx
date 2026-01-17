import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { getAnalyticsData } from '@/lib/analytics';
import AdminDashboardClient from './AdminDashboardClient';
import { ToastProvider } from '@/components/bookings/Toast';

// Server-side admin auth guard
export default async function AdminDashboard() {
  const session = await getServerSession();
  
  if (!session?.user?.email) {
    redirect('/admin/login');
  }

  // Check if user is admin
  if (session.user.role !== 'admin') {
    redirect('/');
  }

  // Fetch analytics data on server
  const analyticsData = await getAnalyticsData();

  return (
    <ToastProvider>
      <AdminDashboardClient analyticsData={analyticsData} />
    </ToastProvider>
  );
}