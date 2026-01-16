'use client';
import { useState } from 'react';
import PaymentForm from '@/components/payment/PaymentForm';
import { Users, DollarSign, CreditCard, Check, AlertCircle, MapPin } from 'lucide-react';
import { Tour, Booking, User, PaymentData } from '@/types/api';

// Extended booking interface for internal state
interface ExtendedBooking extends Omit<Booking, 'id' | 'createdAt' | 'updatedAt'> {
  paymentInfo?: PaymentData | null;
}

interface BookingFlowProps {
  tour: Tour;
  session: {
    user?: User;
  };
  onComplete: (bookingData: Booking) => void;
}

export default function BookingFlow({ tour, session, onComplete }: BookingFlowProps) {
  const [step, setStep] = useState<'details' | 'payment' | 'success'>('details');
  const [bookingData, setBookingData] = useState<Partial<ExtendedBooking>>({
    guestName: session?.user?.name || '',
    guestEmail: session?.user?.email || '',
    guestPhone: '',
    participants: 1,
    tourDate: '',
    specialRequests: '',
    paymentStatus: 'PENDING',
    paymentInfo: null,
  });
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [error, setError] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!bookingData.guestName?.trim()) {
      setError('Guest name is required');
      return;
    }
    if (!bookingData.guestEmail?.trim()) {
      setError('Email is required');
      return;
    }
    if (!bookingData.guestPhone?.trim()) {
      setError('Phone number is required');
      return;
    }
    if ((bookingData.participants || 0) < 1 || (bookingData.participants || 0) > tour.maxParticipants) {
      setError(`Participants must be between 1 and ${tour.maxParticipants}`);
      return;
    }

    setError('');
    setStep('payment');
  };

  const handlePaymentComplete = async (paymentInfo: PaymentData) => {
    try {
      setSubmitting(true);
      setError('');
      
      // Update booking data with payment information
      setBookingData({
        ...bookingData,
        paymentStatus: 'PAID',
        paymentInfo,
      });

      // Create booking via API
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tourId: tour.id,
          guestName: bookingData.guestName || '',
          guestEmail: bookingData.guestEmail || '',
          guestPhone: bookingData.guestPhone || '',
          participants: bookingData.participants || 1,
          tourDate: bookingData.tourDate || '',
          specialRequests: bookingData.specialRequests || '',
          paymentStatus: 'PAID',
          paymentInfo,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create booking');
      }

      const booking = await response.json();
      
      setStep('success');
      onComplete(booking);
    } catch (error) {
      console.error('Booking creation error:', error);
      setError(error instanceof Error ? error.message : 'Failed to create booking');
    } finally {
      setSubmitting(false);
    }
  };

  const totalPrice = tour.price * (bookingData.participants || 1);

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h3>
            <p className="text-gray-600 mb-4">Your booking has been successfully created and payment processed.</p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-4 text-left">
              <h4 className="font-semibold text-gray-900 mb-2">Booking Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tour:</span>
                  <span className="font-medium">{tour.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Guest:</span>
                  <span className="font-medium">{bookingData.guestName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Participants:</span>
                  <span className="font-medium">{bookingData.participants}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Paid:</span>
                  <span className="font-medium text-green-600">${totalPrice.toLocaleString()} د.ج</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="font-medium">{paymentData?.paymentMethod}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onComplete(bookingData as Booking)}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              View My Bookings
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'payment') {
    return (
      <PaymentForm
        onPaymentComplete={handlePaymentComplete}
        onCancel={() => setStep('details')}
        bookingData={{
          tourId: tour.id,
          tourTitle: tour.title,
          participants: bookingData.participants || 1,
          totalPrice: totalPrice,
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Complete Your Booking</h2>
          
          {/* Tour Summary */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">{tour.title}</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center text-gray-600">
                <MapPin className="w-4 h-4 mr-2" />
                {tour.location}
              </div>
              <div className="flex items-center text-gray-600">
                <DollarSign className="w-4 h-4 mr-2" />
                ${tour.price.toLocaleString()} د.ج per person
              </div>
              <div className="flex items-center text-gray-600">
                <Users className="w-4 h-4 mr-2" />
                Max {tour.maxParticipants} participants
              </div>
            </div>
          </div>

          <form onSubmit={handleDetailsSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Guest Name *
                </label>
                <input
                  type="text"
                  value={bookingData.guestName}
                  onChange={(e) => setBookingData(prev => ({ ...prev, guestName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={bookingData.guestEmail}
                  onChange={(e) => setBookingData(prev => ({ ...prev, guestEmail: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={bookingData.guestPhone}
                  onChange={(e) => setBookingData(prev => ({ ...prev, guestPhone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+213 555 123 456"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Participants *
                </label>
                <input
                  type="number"
                  min="1"
                  max={tour.maxParticipants}
                  value={bookingData.participants}
                  onChange={(e) => setBookingData(prev => ({ ...prev, participants: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Tour Date
              </label>
              <input
                type="date"
                value={bookingData.tourDate}
                onChange={(e) => setBookingData(prev => ({ ...prev, tourDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Requests (Optional)
              </label>
              <textarea
                value={bookingData.specialRequests}
                onChange={(e) => setBookingData(prev => ({ ...prev, specialRequests: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Any special requirements or requests..."
              />
            </div>

            {/* Price Summary */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700">Price per person:</span>
                <span className="font-medium">${tour.price.toLocaleString()} د.ج</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700">Participants:</span>
                <span className="font-medium">{bookingData.participants}</span>
              </div>
              <div className="border-t border-blue-200 pt-2 mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Total Amount:</span>
                  <span className="text-lg font-bold text-blue-600">${totalPrice.toLocaleString()} د.ج</span>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-center">
                  <AlertCircle className="w-4 h-4 text-red-600 mr-2" />
                  <span className="text-red-800 text-sm">{error}</span>
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => window.history.back()}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    Continue to Payment
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
