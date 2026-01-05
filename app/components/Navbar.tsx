'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { 
  Mountain, 
  Menu, 
  X, 
  User, 
  Settings, 
  LogOut, 
  Calendar,
  ChevronDown 
} from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const navLinks = [
    { href: '/', label: 'الرئيسية' },
    { href: '/ecoTour', label: 'الرحلات' },
    { href: '/about', label: 'من نحن' },
    { href: '/contact', label: 'اتصل بنا' },
  ];

  const isActiveLink = (href: string) => {
    if (href === '/') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
    setDropdownOpen(false);
  };

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/90 shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <Mountain className="w-6 h-6 text-green-600 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-xl text-slate-800 group-hover:text-green-600 transition-colors">
                ALG EcoTour
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-slate-600 hover:text-green-600 transition-colors font-medium ${
                    isActiveLink(link.href) 
                      ? 'text-green-600 underline underline-offset-4' 
                      : ''
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center gap-4">
              {status === 'loading' ? (
                <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
              ) : session ? (
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-sm font-medium text-slate-700">
                      {session.user?.name || 'مستخدم'}
                    </span>
                    <ChevronDown 
                      className={`w-4 h-4 text-slate-500 transition-transform ${
                        dropdownOpen ? 'rotate-180' : ''
                      }`} 
                    />
                  </button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2"
                      >
                        <Link
                          href="/profile"
                          className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <User className="w-4 h-4" />
                          الملف الشخصي
                        </Link>
                        <Link
                          href="/bookings"
                          className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <Calendar className="w-4 h-4" />
                          حجوزاتي
                        </Link>
                        <Link
                          href="/settings"
                          className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <Settings className="w-4 h-4" />
                          الإعدادات
                        </Link>
                        <hr className="my-2 border-gray-200" />
                        <button
                          onClick={handleSignOut}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-right"
                        >
                          <LogOut className="w-4 h-4" />
                          تسجيل خروج
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors font-medium"
                  >
                    تسجيل دخول
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    التسجيل
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-slate-600" />
              ) : (
                <Menu className="w-6 h-6 text-slate-600" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Sidebar */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-80 bg-white shadow-xl z-50 md:hidden"
            >
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <Link 
                    href="/" 
                    className="flex items-center gap-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Mountain className="w-6 h-6 text-green-600" />
                    <span className="font-bold text-xl text-slate-800">
                      ALG EcoTour
                    </span>
                  </Link>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-6 h-6 text-slate-600" />
                  </button>
                </div>
              </div>

              {/* Mobile Navigation Links */}
              <div className="p-4 space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`block px-4 py-3 rounded-lg transition-colors font-medium ${
                      isActiveLink(link.href)
                        ? 'bg-green-50 text-green-600'
                        : 'text-slate-600 hover:bg-gray-50'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              {/* Mobile Auth Section */}
              <div className="p-4 border-t border-gray-200">
                {status === 'loading' ? (
                  <div className="flex items-center gap-3 p-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                    </div>
                  </div>
                ) : session ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">
                          {session.user?.name || 'مستخدم'}
                        </p>
                        <p className="text-sm text-slate-600">
                          {session.user?.email}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-slate-600 hover:bg-gray-50 rounded-lg transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        الملف الشخصي
                      </Link>
                      <Link
                        href="/bookings"
                        className="block px-4 py-2 text-sm text-slate-600 hover:bg-gray-50 rounded-lg transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        حجوزاتي
                      </Link>
                      <Link
                        href="/settings"
                        className="block px-4 py-2 text-sm text-slate-600 hover:bg-gray-50 rounded-lg transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        الإعدادات
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="block w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors text-right"
                      >
                        تسجيل خروج
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link
                      href="/auth/login"
                      className="block w-full px-4 py-3 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors font-medium text-center"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      تسجيل دخول
                    </Link>
                    <Link
                      href="/auth/signup"
                      className="block w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-center"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      التسجيل
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
