'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, Users, MapPin, MessageSquare, FileText, LogOut, Menu, X, 
  Settings, Calendar, Layers, Mail, TrendingDown, Activity
} from 'lucide-react';
import { useState } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { 
      href: '/admin/dashboard', 
      label: 'Dashboard', 
      icon: LayoutDashboard,
    },
    { 
      href: '/admin/tours', 
      label: 'Tours', 
      icon: MapPin,
    },
    { 
      href: '/admin/users', 
      label: 'Users', 
      icon: Users,
    },
    { 
      href: '/admin/categories', 
      label: 'Categories', 
      icon: Layers,
    },
    { 
      href: '/admin/bookings', 
      label: 'Bookings', 
      icon: Calendar,
    },
    { 
      href: '/admin/itinerary', 
      label: 'Itineraries', 
      icon: Activity,
    },
    { 
      href: '/admin/reviews', 
      label: 'Reviews', 
      icon: MessageSquare,
    },
    { 
      href: '/admin/email-campaigns', 
      label: 'Email Campaigns', 
      icon: Mail,
    },
    { 
      href: '/admin/conversion-funnels', 
      label: 'Conversion Funnels', 
      icon: TrendingDown,
    },
    { 
      href: '/admin/audit-logs', 
      label: 'Audit Logs', 
      icon: FileText,
    },
  ];

  const isActive = (href: string) => pathname === href;

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:relative md:translate-x-0`}>
        {/* Header */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">ALG EcoTour</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2">Admin Panel</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  active
                    ? 'bg-green-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-gray-800">
          <div className="bg-gray-800 rounded-lg p-4 mb-4">
            <p className="text-xs text-gray-400 mb-1">Logged in as</p>
            <p className="text-sm font-medium truncate">{session?.user?.email}</p>
            <p className="text-xs text-green-400 mt-1 capitalize">{session?.user?.role}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 text-gray-300 hover:bg-red-600 hover:text-white rounded-lg transition"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold text-gray-900">
              {menuItems.find(item => isActive(item.href))?.label || 'Admin'}
            </h2>
            <div className="text-sm text-gray-500">
              {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
