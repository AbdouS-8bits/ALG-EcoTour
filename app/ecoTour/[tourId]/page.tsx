'use client';

import { useState, useEffect, use, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ArrowLeft, MapPin, Calendar, Users, DollarSign, Star, Clock } from 'lucide-react';

// Dynamically import MapDisplay to avoid SSR issues
const MapDisplay = dynamic(() => import('@/app/components/MapDisplay'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
      <p className="text-gray-500">Loading map...</p>
    </div>
  ),
});

// Wrap MapDisplay in Suspense for better error handling
const MapWithSuspense = ({ latitude, longitude, title }: { latitude: number; longitude: number; title: string }) => (
  <Suspense fallback={
    <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
      <p className="text-gray-500">Loading map...</p>
    </div>
  }>
    <MapDisplay latitude={latitude} longitude={longitude} title={title} />
  </Suspense>
);

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
  const router = useRouter();
  
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'location'>('details');
  const [bookingData, setBookingData] = useState({
    guestName: session?.user?.name || '',
    guestEmail: session?.user?.email || '',
    guestPhone: '',
    participants: 1,
    tourDate: '',
    specialRequests: '',
  });
  const [bookingMessage, setBookingMessage] = useState({ type: '', text: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTour();
  }, [tourId]);

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

  const handleBookingInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setBookingData({
      ...bookingData,
      [e.target.name]: e.target.value,
    });
  };

  const handleBookingSubmit = async () => {
    if (!bookingData.guestName || !bookingData.guestEmail || !bookingData.guestPhone || !bookingData.tourDate) {
      setBookingMessage({ type: 'error', text: 'Please fill in all required fields' });
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
          tourDate: '',
          specialRequests: '',
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
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          الرجوع
        </button>
        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Hero Image */}
          {tour.photoURL && (
            <img 
              src={tour.photoURL} 
              alt={tour.title}
              className="w-full h-96 object-cover"
              loading="lazy"
            />
          )}
          
          <div className="p-8">
            {/* Title and Basic Info */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-6">{tour.title}</h1>
              
              <div className="grid md:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {tour.price.toLocaleString()} د.ج
                    </div>
                    <div className="text-sm text-gray-600">للشخص الواحد</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-gray-600" />
                  <div>
                    <div className="font-semibold text-gray-900">{tour.location}</div>
                    <div className="text-sm text-gray-600">الموقع</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-gray-600" />
                  <div>
                    <div className="font-semibold text-gray-900">{tour.maxParticipants} شخص</div>
                    <div className="text-sm text-gray-600">السعة القصوى</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-600" />
                  <div>
                    <div className="font-semibold text-gray-900">3 أيام</div>
                    <div className="text-sm text-gray-600">المدة التقريبية</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-8">
              <nav className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'details'
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  التفاصيل
                </button>
                <button
                  onClick={() => setActiveTab('location')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'location'
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  الموقع
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            {activeTab === 'details' && (
              <div>
                {tour.description && (
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">عن الرحلة</h2>
                    <p className="text-gray-700 leading-relaxed">
                      {tour.description}
                    </p>
                  </div>
                )}

                {/* Features */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">ما يتضمن</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-900">إرشاد سياحي محترف</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-900">وجبات طعام</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-900">نقل مريح</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-900">تأمين شامل</span>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="text-center">
                  <button
                    onClick={() => setShowBookingModal(true)}
                    className="px-8 py-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-200 shadow-lg hover:shadow-xl text-lg"
                  >
                    احجز الآن
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'location' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">موقع الرحلة</h2>
                {tour.latitude && tour.longitude && (
                  <MapWithSuspense 
                    latitude={tour.latitude}
                    longitude={tour.longitude}
                    title={tour.title}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
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

            <h2 className="text-2xl font-bold text-gray-900 mb-6">احجز رحلتك</h2>

            {session && (
              <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-green-800 text-sm">
                  ✓ مسجل كـ <strong>{session.user?.email}</strong>
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

            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الاسم الكامل *</label>
                <input
                  type="text"
                  name="guestName"
                  value={bookingData.guestName}
                  onChange={handleBookingInputChange}
                  disabled={!!session?.user?.name}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none disabled:bg-gray-100 text-gray-900 bg-white placeholder-gray-500"
                  placeholder="أدخل اسمك الكامل"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني *</label>
                <input
                  type="email"
                  name="guestEmail"
                  value={bookingData.guestEmail}
                  onChange={handleBookingInputChange}
                  disabled={!!session?.user?.email}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none disabled:bg-gray-100 text-gray-900 bg-white placeholder-gray-500"
                  placeholder="example@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">رقم الهاتف *</label>
                <input
                  type="tel"
                  name="guestPhone"
                  value={bookingData.guestPhone}
                  onChange={handleBookingInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-gray-900 bg-white placeholder-gray-500"
                  placeholder="+213 XXX XXX XXX"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">تاريخ الرحلة *</label>
                <input
                  type="date"
                  name="tourDate"
                  value={bookingData.tourDate}
                  onChange={handleBookingInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-gray-900 bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">عدد المشاركين *</label>
                <select
                  name="participants"
                  value={bookingData.participants}
                  onChange={handleBookingInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-gray-900 bg-white"
                >
                  {[...Array(tour.maxParticipants)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1} {i === 0 ? 'شخص' : 'أشخاص'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">طلبات خاصة</label>
                <textarea
                  name="specialRequests"
                  value={bookingData.specialRequests}
                  onChange={handleBookingInputChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-gray-900 bg-white placeholder-gray-500 resize-none"
                  placeholder="أي طلبات خاصة..."
                />
              </div>

              <div className="flex items-center justify-between pt-4">
                <p className="text-sm text-gray-600">
                  الحقول المطلوبة مسبوقة بعلامة *
                </p>
                <button
                  type="button"
                  onClick={handleBookingSubmit}
                  disabled={submitting}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin inline-block ml-2"></div>
                      جاري الإرسال...
                    </>
                  ) : (
                    'تأكيد الحجز'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
