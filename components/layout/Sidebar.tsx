'use client';

import Link from 'next/link';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export default function Sidebar({ isOpen, onClose, className }: SidebarProps) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } ${className || ''}`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-emerald-600">Menu</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <nav className="space-y-4">
            <Link
              href="/"
              className="block text-gray-700 hover:text-emerald-600"
              onClick={onClose}
            >
              Home
            </Link>
            <Link
              href="/ecoTour"
              className="block text-gray-700 hover:text-emerald-600"
              onClick={onClose}
            >
              Tours
            </Link>
            <Link
              href="/auth/login"
              className="block text-gray-700 hover:text-emerald-600"
              onClick={onClose}
            >
              Login
            </Link>
          </nav>
        </div>
      </aside>
    </>
  );
}

