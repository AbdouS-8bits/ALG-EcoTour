import Link from 'next/link';

interface HeaderProps {
  className?: string;
}

export default function Header({ className }: HeaderProps) {
  return (
    <header className={className}>
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-emerald-600">
            ALG EcoTour
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/ecoTour" className="text-gray-700 hover:text-emerald-600">
              Tours
            </Link>
            <Link href="/auth/login" className="text-gray-700 hover:text-emerald-600">
              Login
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}

