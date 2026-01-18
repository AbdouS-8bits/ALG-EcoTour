import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { getUserProfile } from '@/lib/user';
import ProfileClient from './ProfileClient';
import { ToastProvider } from '@/components/bookings/Toast';

// Server-side auth guard
export default async function ProfilePage() {
  const session = await getServerSession();
  
  if (!session?.user?.email) {
    redirect('/auth/login');
  }

  // Fetch user profile on server
  const userProfile = await getUserProfile(session.user.email);

  if (!userProfile) {
    redirect('/auth/login');
  }

  return (
    <ToastProvider>
      <ProfileClient userProfile={userProfile} />
    </ToastProvider>
  );
}
