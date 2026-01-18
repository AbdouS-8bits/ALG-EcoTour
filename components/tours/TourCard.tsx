import Link from 'next/link';
import Image from 'next/image';

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
            <Image
              src={tour.photoURL}
              alt={tour.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Image
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

