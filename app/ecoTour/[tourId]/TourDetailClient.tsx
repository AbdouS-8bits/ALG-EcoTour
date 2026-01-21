'use client';
import { useState, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { ArrowLeft, MapPin, Users, DollarSign, Star, Clock } from 'lucide-react';
import OptimizedImage, { ImageSizes } from '@/components/common/OptimizedImage';
import ImageGallery from '@/components/tours/ImageGallery';
import ShareButtons from '@/components/tours/ShareButtons';
import TourReviews from '@/components/tours/TourReviews';
import TourRating from '@/components/tours/TourRating';
import RelatedTours from '@/components/tours/RelatedTours';
import AvailabilityCalendar from '@/components/availability/AvailabilityCalendar';
import CommentSection from '@/app/components/social/CommentSection';
import ReactionButton from '@/app/components/social/ReactionButton';
import RatingStars from '@/app/components/social/RatingStars';
import MessagePanel from '@/app/components/social/MessagePanel';
import { Tour, Booking, User } from '@/types/api';

interface TourDetailClientProps {
  tour: Tour;
}

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

export default function TourDetailClient({ tour }: TourDetailClientProps) {
  const { data: session } = useSession();
  const router = useRouter();
  
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'location' | 'reviews' | 'availability'>('details');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Generate gallery images for tour with enhanced fallbacks
  const getGalleryImages = () => {
    const baseImages = [
      { 
        id: `${tour.id}-1`, 
        src: tour.photoURL || '/images/placeholder.jpg', 
        alt: `${tour.title} - Main view`,
        fallback: '/images/tours/desert-1.jpg'
      },
      { 
        id: `${tour.id}-2`, 
        src: '/images/tours/desert-1.jpg', 
        alt: `${tour.title} - Desert landscape`,
        fallback: '/images/tours/sahara.jpg'
      },
      { 
        id: `${tour.id}-3`, 
        src: '/images/tours/sahara.jpg', 
        alt: `${tour.title} - Sahara dunes`,
        fallback: '/images/tours/tassili.jpg'
      },
      { 
        id: `${tour.id}-4`, 
        src: '/images/tours/tassili.jpg', 
        alt: `${tour.title} - Tassili mountains`,
        fallback: '/images/tours/mountains.jpg'
      },
      { 
        id: `${tour.id}-5`, 
        src: '/images/tours/mountains.jpg', 
        alt: `${tour.title} - Mountain view`,
        fallback: '/images/tours/oasis.jpg'
      },
      { 
        id: `${tour.id}-6`, 
        src: '/images/tours/oasis.jpg', 
        alt: `${tour.title} - Oasis view`,
        fallback: '/images/tours/coast.jpg'
      },
    ];

    // Enhance with more diverse images if we have a photo
    // Only add variants for external URLs, not local paths
    if (tour.photoURL && tour.photoURL.startsWith('http')) {
      return [
        baseImages[0],
        ...baseImages.slice(1).map((img, index) => ({
          ...img,
          src: `${tour.photoURL}?variant=${index + 1}`,
          alt: `${tour.title} - View ${index + 2}`,
        })),
      ];
    }

    return baseImages;
  };

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
          <div className="relative w-full h-96">
            {tour.photoURL ? (
              <OptimizedImage
                src={tour.photoURL}
                alt={tour.title}
                fill
                className="object-cover"
                {...ImageSizes.hero}
                fallback="/images/placeholder.jpg"
              />
            ) : (
              <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <MapPin className="w-8 h-8 text-gray-500" />
                  </div>
                  <p className="text-gray-500">No image available</p>
                </div>
              </div>
            )}
          </div>
          
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
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      <TourRating tourId={tour.id} />
                    </div>
                    <div className="text-sm text-gray-600">تقييم</div>
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
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'reviews'
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  التقييمات
                </button>
                <button
                  onClick={() => setActiveTab('availability')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'availability'
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Availability
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            {activeTab === 'details' && (
              <div>
                {/* Description */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">التفاصيل</h2>
                  <p className="text-gray-600">{tour.description}</p>
                </div>

                {/* Social Interactions */}
                <div className="mb-8 space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">تفاعل مع هذه الرحلة</h2>
                  
                  {/* Reactions */}
                  <div className="flex items-center justify-between p-6 bg-gray-50 rounded-xl">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">ما رأيك في هذه الرحلة؟</h3>
                      <p className="text-sm text-gray-600">شارك انطباعك مع الآخرين</p>
                    </div>
                    <ReactionButton 
                      tourId={tour.id.toString()} 
                      className="flex-shrink-0"
                    />
                  </div>

                  {/* Rating */}
                  <RatingStars 
                    tourId={tour.id.toString()}
                    tourTitle={tour.title}
                    size="large"
                    showStats={true}
                    interactive={true}
                  />
                </div>

                {/* Gallery */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">معرض الصور</h2>
                  <ImageGallery images={getGalleryImages()} />
                </div>

                {/* Share Buttons */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">مشاركة</h2>
                  <ShareButtons 
                    tourUrl={typeof window !== 'undefined' ? window.location.href : ''}
                    tourTitle={tour.title}
                    tourDescription={tour.description || `Discover ${tour.title} in ${tour.location}, Algeria. Experience authentic local culture and sustainable tourism.`}
                  />
                </div>
              </div>
            )}

            {activeTab === 'location' && (
              <div>
                {/* Map */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">الموقع</h2>
                  {tour.latitude && tour.longitude ? (
                    <MapWithSuspense latitude={tour.latitude} longitude={tour.longitude} title={tour.title} />
                  ) : (
                    <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                          <MapPin className="w-8 h-8 text-gray-500" />
                        </div>
                        <p className="text-gray-500">No location available</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                {/* Reviews */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">التقييمات</h2>
                  <TourReviews tourId={tour.id} tourTitle={tour.title} />
                </div>

                {/* Comments Section */}
                <div className="mb-8">
                  <CommentSection 
                    tourId={tour.id.toString()} 
                    tourTitle={tour.title}
                  />
                </div>
              </div>
            )}

            {activeTab === 'availability' && (
              <div>
                {/* Availability Calendar */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Tour Availability</h2>
                  <p className="text-gray-600 mb-6">
                    Check available dates for this tour. Select a date to proceed with booking.
                  </p>
                  <AvailabilityCalendar 
                    tourId={tour.id}
                    onDateSelect={setSelectedDate}
                    selectedDate={selectedDate || undefined}
                    maxMonthsToShow={3}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => setShowBookingModal(true)}
            className="px-8 py-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-200 shadow-lg hover:shadow-xl text-lg"
          >
            احجز الآن
          </button>
        </div>
      </div>

      {/* Related Tours Section */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <RelatedTours 
          currentTourId={tour.id} 
          currentTourLocation={tour.location}
          limit={4}
        />
      </div>

      {/* Message Panel */}
      <MessagePanel userId={session?.user?.id} />

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-4xl">
            <div className="bg-white rounded-2xl shadow-2xl p-8 relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setShowBookingModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <h2 className="text-2xl font-bold text-gray-900 mb-6">احجز رحلتك</h2>

              <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-green-800 text-sm">
                  ✓ مسجل كـ <strong>{session?.user?.email}</strong>
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-blue-800 text-sm">
                  💳 الدفع آمن ومشفر. لا توجد معلومات حقيقية للدفع.
                </p>
              </div>

              <button
                onClick={() => setShowBookingModal(false)}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                فهمت
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
