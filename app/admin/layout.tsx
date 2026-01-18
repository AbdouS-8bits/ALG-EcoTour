import { ReactNode } from 'react';
import AdminLayout from './AdminLayout';
import { SessionProvider } from 'next-auth/react';

export const metadata = {
  title: 'Admin Panel - ALG EcoTour',
  description: 'Admin management panel',
};

export default function RootAdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminLayout>
      {children}
    </AdminLayout>
  );
}
