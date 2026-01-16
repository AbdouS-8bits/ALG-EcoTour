'use client';
import { useState } from 'react';
import { Calendar, MapPin, Users, Clock, X, Check, AlertCircle, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { BookingWithTour } from '@/lib/bookings';
import ConfirmationModal from '@/components/bookings/ConfirmationModal';
import { useToast } from '@/components/bookings/Toast';

interface BookingsClientProps {
  bookings: BookingWithTour[];
}

export default function BookingsClient({ bookings: initialBookings }: BookingsClientProps) {
  const [bookings, setBookings] = useState<BookingWithTour[]>(initialBookings);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState<number | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<BookingWithTour | null>(null);
  const { showToast } = useToast();

  const handleRefresh = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/bookings');
      if (!response.ok) {
        throw new Error('Failed to refresh bookings');
      }
      
      const data = await response.json();
      setBookings(data);
      showToast({
        type: 'success',
        title: 'Bookings refreshed',
        message: 'Your bookings have been updated'
      });
    } catch (error) {
      console.error('Error refreshing bookings:', error);
      setError('Failed to refresh bookings. Please try again.');
      showToast({
        type: 'error',
        title: 'Refresh failed',
        message: 'Could not refresh your bookings'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelClick = (booking: BookingWithTour) => {
    setSelectedBooking(booking);
    setShowCancelModal(true);
  };

  const handleCancelConfirm = async () => {
    if (!selectedBooking) return;

    try {
      setCancelling(selectedBooking.id);
      
      const response = await fetch(`/api/bookings/${selectedBooking.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'cancelled'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to cancel booking');
      }

      // Update local state
      setBookings(prev => prev.map(booking => 
        booking.id === selectedBooking.id 
          ? { ...booking, status: 'cancelled' as const }
          : booking
      ));

      showToast({
        type: 'success',
        title: 'Booking cancelled',
        message: 'Your booking has been successfully cancelled'
      });
    } catch (error) {
      console.error('Error cancelling booking:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to cancel booking';
      setError(errorMessage);
      showToast({
        type: 'error',
        title: 'Cancellation failed',
        message: errorMessage
      });
    } finally {
      setCancelling(null);
      setShowCancelModal(false);
      setSelectedBooking(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'pending':
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Check className="w-4 h-4" />;
      case 'cancelled':
        return <X className="w-4 h-4" />;
      case 'pending':
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'مؤكد';
      case 'cancelled':
        return 'ملغي';
      case 'pending':
      default:
        return 'في الانتظار';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your bookings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">حجوزاتي</h1>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        {bookings.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">لم تقم بأي حجز بعد</h3>
            <p className="text-gray-500 mb-6">ابدأ مغامرتك الآن واستكشف رحلاتنا المميزة</p>
            <Link
              href="/ecoTour"
              className="inline-block px-8 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:scale-105 transition-transform"
            >
              استكشف الرحلات
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {booking.tour?.title || 'Tour Details Loading...'}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {booking.tour?.location || 'Location'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {booking.participants} participants
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(booking.createdAt).toLocaleDateString('ar-DZ')}
                      </span>
                    </div>
                    {booking.tour && (
                      <div className="text-lg font-semibold text-green-600 mb-3">
                        {(booking.tour.price * booking.participants).toLocaleString()} د.ج
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col items-end gap-3">
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 ${getStatusColor(booking.status)}`}>
                      {getStatusIcon(booking.status)}
                      {getStatusText(booking.status)}
                    </span>
                    
                    {booking.status === 'pending' && (
                      <button
                        onClick={() => handleCancelClick(booking)}
                        disabled={cancelling === booking.id}
                        className="px-4 py-2 text-sm border border-red-300 text-red-600 rounded-lg hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {cancelling === booking.id ? 'Cancelling...' : 'Cancel Booking'}
                      </button>
                    )}
                    
                    <Link
                      href={`/ecoTour/${booking.tourId}`}
                      className="px-4 py-2 text-sm border border-green-300 text-green-600 rounded-lg hover:bg-green-50"
                    >
                      View Tour
                    </Link>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Guest Name:</span>
                      <p className="font-medium text-gray-900">{booking.guestName}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Email:</span>
                      <p className="font-medium text-gray-900">{booking.guestEmail}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Phone:</span>
                      <p className="font-medium text-gray-900">{booking.guestPhone}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showCancelModal}
        onClose={() => {
          setShowCancelModal(false);
          setSelectedBooking(null);
        }}
        onConfirm={handleCancelConfirm}
        title="Cancel Booking"
        message={`Are you sure you want to cancel your booking for "${selectedBooking?.tour?.title}"? This action cannot be undone.`}
        confirmText="Cancel Booking"
        cancelText="Keep Booking"
        isLoading={cancelling === selectedBooking?.id}
      />
    </div>
  );
}
