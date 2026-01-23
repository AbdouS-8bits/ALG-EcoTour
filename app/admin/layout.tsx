"use client";

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/auth/login?callbackUrl=/admin/analytics');
      return;
    }

    if (session.user?.role !== 'admin') {
      router.push('/');
      return;
    }
  }, [session, status, router]);

  // Show loading state while checking authentication
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  // Don't render children until authenticated
  if (!session || session.user?.role !== 'admin') {
    return null;
  }

  return <>{children}</>;
}
