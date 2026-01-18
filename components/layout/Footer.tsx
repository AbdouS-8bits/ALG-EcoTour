import Link from 'next/link';

interface FooterProps {
  className?: string;
}

export default function Footer({ className }: FooterProps) {
  return (
    <footer className={className}>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-emerald-600 mb-4">ALG EcoTour</h3>
            <p className="text-gray-600 text-sm">
              Discover the natural beauty of Algeria through sustainable eco-tourism.
            </p>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/ecoTour" className="text-gray-600 hover:text-emerald-600">
                  All Tours
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="text-gray-600 hover:text-emerald-600">
                  Login
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4">Contact</h4>
            <p className="text-gray-600 text-sm">
              Email: info@algecotour.com
            </p>
          </div>
        </div>
        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-600">
          <p>&copy; {new Date().getFullYear()} ALG EcoTour. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

