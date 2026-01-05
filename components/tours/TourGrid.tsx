import TourCard from './TourCard';

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

interface TourGridProps {
  tours: Tour[];
  className?: string;
}

export default function TourGrid({ tours, className }: TourGridProps) {
  if (tours.length === 0) {
    return (
      <div className={`text-center py-12 ${className || ''}`}>
        <p className="text-gray-500">No tours found.</p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className || ''}`}>
      {tours.map((tour) => (
        <TourCard key={tour.id} tour={tour} />
      ))}
    </div>
  );
}

