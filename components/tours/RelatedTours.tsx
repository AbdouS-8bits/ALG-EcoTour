'use client';
import { useState, useEffect } from 'react';
import { MapPin, Users, DollarSign, Star, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import OptimizedImage from '@/components/common/OptimizedImage';

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
  createdAt: Date;
  updatedAt: Date;
}

interface RelatedToursProps {
  currentTourId: number;
  currentTourLocation: string;
  limit?: number;
}

export default function RelatedTours({ 
  currentTourId, 
  currentTourLocation, 
  limit = 4 
}: RelatedToursProps) {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchRelatedTours = async () => {
    try {
      setLoading(true);
      setError('');

      // First try to get tours from the same location
      const response = await fetch(`/api/tours?location=${encodeURIComponent(currentTourLocation)}&limit=${limit + 1}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch related tours');
      }

      const allTours = await response.json();
      
      // Filter out the current tour and limit to requested number
      const relatedTours = allTours
        .filter((tour: Tour) => tour.id !== currentTourId)
        .slice(0, limit);

      // If we don't have enough tours from the same location, get random tours
      if (relatedTours.length < limit) {
        const randomResponse = await fetch(`/api/tours?limit=${limit}`);
        if (randomResponse.ok) {
          const randomTours = await randomResponse.json();
          const additionalTours = randomTours
            .filter((tour: Tour) => tour.id !== currentTourId && !relatedTours.find((r: Tour) => r.id === tour.id))
            .slice(0, limit - relatedTours.length);
          
          setTours([...relatedTours, ...additionalTours]);
        } else {
          setTours(relatedTours);
        }
      } else {
        setTours(relatedTours);
      }
    } catch (error) {
      console.error('Error fetching related tours:', error);
      setError('Failed to load related tours');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRelatedTours();
  }, [currentTourId, currentTourLocation, limit]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Tours</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Tours</h2>
        <div className="text-center py-8">
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (tours.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Tours</h2>
        <div className="text-center py-8">
          <p className="text-gray-600">No related tours found at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Related Tours</h2>
        <Link
          href="/ecoTour"
          className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 transition-colors"
        >
          View All Tours
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tours.map((tour) => (
          <div key={tour.id} className="group cursor-pointer">
            <Link href={`/ecoTour/${tour.id}`}>
              <div className="relative overflow-hidden rounded-lg mb-4">
                <OptimizedImage
                  src={tour.photoURL || '/images/placeholder.jpg'}
                  alt={tour.title}
                  width={400}
                  height={250}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  fallback="/images/tours/desert-1.jpg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {tour.title}
                </h3>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span className="line-clamp-1">{tour.location}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="font-semibold text-green-600">
                      {tour.price.toLocaleString()} د.ج
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-600">
                      {tour.maxParticipants}
                    </span>
                  </div>
                </div>

                {tour.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {tour.description}
                  </p>
                )}
              </div>
            </Link>
          </div>
        ))}
      </div>

      {tours.length > 0 && (
        <div className="mt-8 text-center">
          <Link
            href="/ecoTour"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Explore More Tours
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
