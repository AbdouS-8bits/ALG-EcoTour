'use client';

import { useState, useEffect, use } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Dynamically import MapDisplay to avoid SSR issues
const MapDisplay = dynamic(() => import('@/app/components/MapDisplay'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
      <p className="text-gray-500">Loading map...</p>
    </div>
  ),
});

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

export default function TourDetailPage({ params }: { params: Promise<{ tourId: string }> }) {
  const { tourId } = use(params);
  const { data: session } = useSession();
  
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingData, setBookingData] = useState({
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    participants: 1,
  });
  const [bookingMessage, setBookingMessage] = useState({ type: '', text: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTour();
  }, [tourId]);

  useEffect(() => {
    if (session?.user) {
      setBookingData(prev => ({
        ...prev,
        guestName: session.user.name || '',
        guestEmail: session.user.email || '',
      }));
    }
  }, [session]);

  const fetchTour = async () => {
    try {
      const response = await fetch(`/api/tours/${tourId}`);
      if (response.ok) {
        const data = await response.json();
        setTour(data);
      }
    } catch (error) {
      console.error('Error fetching tour:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookingInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: name === 'participants' ? parseInt(value) : value
    }));
  };

  const handleBookingSubmit = async () => {
    if (!bookingData.guestName || !bookingData.guestEmail || !bookingData.guestPhone) {
      setBookingMessage({ type: 'error', text: 'Please fill in all fields' });
      return;
    }

    setSubmitting(true);
    setBookingMessage({ type: '', text: '' });

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...bookingData,
          tourId: parseInt(tourId),
          userId: session?.user?.id || null,
        }),
      });

      if (response.ok) {
        setBookingMessage({ type: 'success', text: 'Booking submitted successfully!' });
        setBookingData({
          guestName: session?.user?.name || '',
          guestEmail: session?.user?.email || '',
          guestPhone: '',
          participants: 1,
        });
        setTimeout(() => {
          setShowBookingModal(false);
          setBookingMessage({ type: '', text: '' });
        }, 2000);
      } else {
        throw new Error('Booking failed');
      }
    } catch (error) {
      setBookingMessage({ type: 'error', text: 'Failed to submit booking' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Tour not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {tour.photoURL && (
            <img 
              src={tour.photoURL} 
              alt={tour.title}
              className="w-full h-96 object-cover"
            />
          )}
          
          <div className="p-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{tour.title}</h1>
            
            <div className="flex items-center gap-4 mb-6">
              <span className="text-2xl font-bold text-emerald-600">
                {tour.price.toLocaleString()} DZD
              </span>
              <span className="text-gray-600">
                📍 {tour.location}
              </span>
              <span className="text-gray-600">
                👥 Max: {tour.maxParticipants} people
              </span>
            </div>

            {tour.description && (
              <p className="text-gray-700 mb-8 leading-relaxed">
                {tour.description}
              </p>
            )}

            {/* Map Display */}
            {tour.latitude && tour.longitude && (
              <div className="mb-8">
                <MapDisplay 
                  latitude={tour.latitude}
                  longitude={tour.longitude}
                  title={tour.title}
                />
              </div>
            )}

            {!session && (
              <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 text-sm">
                  💡 <Link href="/auth/login" className="font-semibold underline">Sign in</Link> or{' '}
                  <Link href="/auth/signup" className="font-semibold underline">create an account</Link>{' '}
                  to book faster with auto-filled information!
                </p>
              </div>
            )}

            <button
              onClick={() => setShowBookingModal(true)}
              className="w-full bg-emerald-600 text-white font-semibold py-4 px-8 rounded-lg hover:bg-emerald-700 transition duration-200 shadow-lg hover:shadow-xl text-lg"
            >
              Book This Tour
            </button>
          </div>
        </div>
      </div>

      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowBookingModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">Book Your Tour</h2>

            {session && (
              <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-green-800 text-sm">
                  ✓ Logged in as <strong>{session.user?.email}</strong>
                </p>
              </div>
            )}

            {bookingMessage.text && (
              <div className={`mb-4 p-3 rounded-lg ${
                bookingMessage.type === 'success' 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {bookingMessage.text}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="guestName"
                  value={bookingData.guestName}
                  onChange={handleBookingInputChange}
                  disabled={!!session?.user?.name}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none disabled:bg-gray-100"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="guestEmail"
                  value={bookingData.guestEmail}
                  onChange={handleBookingInputChange}
                  disabled={!!session?.user?.email}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none disabled:bg-gray-100"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone *
                </label>
                <input
                  type="tel"
                  name="guestPhone"
                  value={bookingData.guestPhone}
                  onChange={handleBookingInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                  placeholder="+213 XXX XXX XXX"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Number of Participants *
                </label>
                <input
                  type="number"
                  name="participants"
                  value={bookingData.participants}
                  onChange={handleBookingInputChange}
                  min="1"
                  max={tour.maxParticipants}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                />
              </div>

              <div className="bg-emerald-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-semibold">Total Price:</span>
                  <span className="text-2xl font-bold text-emerald-600">
                    {(tour.price * bookingData.participants).toLocaleString()} DZD
                  </span>
                </div>
              </div>

              <button
                onClick={handleBookingSubmit}
                disabled={submitting}
                className="w-full bg-emerald-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200"
              >
                {submitting ? 'Submitting...' : 'Confirm Booking'}
              </button>

              {!session && (
                <p className="text-center text-sm text-gray-600">
                  <Link href="/auth/login" className="text-emerald-600 hover:text-emerald-700 font-semibold">
                    Sign in
                  </Link>
                  {' '}to save your info for next time
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
