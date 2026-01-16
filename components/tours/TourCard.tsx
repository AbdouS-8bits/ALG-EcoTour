import Link from 'next/link';
import OptimizedImage, { ImageSizes } from '@/components/common/OptimizedImage';

interface Tour {
  id: number;
  title: string;
  description: string | null;
  location: string;
  latitude: number | null;
  longitude: number | null;
  price: number;
  maxParticipants: number;
  photoURL: string | null;
}

interface TourCardProps {
  tour: Tour;
  className?: string;
}

export default function TourCard({ tour, className }: TourCardProps) {
  return (
    <Link href={`/ecoTour/${tour.id}`} className={className}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative h-48 w-full bg-gray-200">
          {tour.photoURL ? (
            <OptimizedImage
              src={tour.photoURL}
              alt={tour.title}
              fill
              className="object-cover"
              {...ImageSizes.card}
              fallback="/images/placeholder.jpg"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <div className="text-center">
                <div className="w-8 h-8 bg-gray-300 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-sm">No Image</span>
              </div>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{tour.title}</h3>
          <p className="text-sm text-gray-600 mb-2">{tour.location}</p>
          {tour.description && (
            <p className="text-sm text-gray-500 line-clamp-2 mb-3">
              {tour.description}
            </p>
          )}
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-emerald-600">
              {tour.price.toFixed(2)} DZD
            </span>
            <span className="text-sm text-gray-500">
              Max: {tour.maxParticipants}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

