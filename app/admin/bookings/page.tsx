import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { getAllBookings } from '@/lib/bookings';
import AdminBookingsClient from './AdminBookingsClient';
import { ToastProvider } from '@/components/bookings/Toast';

// Server-side admin auth guard
export default async function AdminBookingsPage() {
  const session = await getServerSession();
  
  if (!session?.user?.email) {
    redirect('/admin/login');
  }

  // Check if user is admin
  if (session.user.role !== 'admin') {
    redirect('/');
  }

  // Fetch all bookings on server
  const bookings = await getAllBookings({ limit: 100 });

  return (
    <ToastProvider>
      <AdminBookingsClient bookings={bookings} />
    </ToastProvider>
  );
}
