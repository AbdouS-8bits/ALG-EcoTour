import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { getUserBookings, BookingWithTour } from '@/lib/bookings';
import BookingsClient from './BookingsClient';
import { ToastProvider } from '@/components/bookings/Toast';

// Server-side auth guard
export default async function BookingsPage() {
  const session = await getServerSession();
  
  if (!session?.user?.email) {
    redirect('/auth/login');
  }

  // Fetch user bookings on server
  const bookings = await getUserBookings(session.user.email, { limit: 50 });

  return (
    <ToastProvider>
      <BookingsClient bookings={bookings} />
    </ToastProvider>
  );
}
