import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { getUserSettingsByEmail } from '@/lib/settings';
import SettingsClient from './SettingsClient';
import { ToastProvider } from '@/components/bookings/Toast';

// Server-side auth guard
export default async function SettingsPage() {
  const session = await getServerSession();
  
  if (!session?.user?.email) {
    redirect('/auth/login');
  }

  // Fetch user settings on server
  const userSettings = await getUserSettingsByEmail(session.user.email);

  if (!userSettings) {
    redirect('/auth/login');
  }

  return (
    <ToastProvider>
      <SettingsClient userSettings={userSettings} />
    </ToastProvider>
  );
}
