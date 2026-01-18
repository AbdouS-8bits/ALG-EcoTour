'use client';

import { useState, FormEvent } from 'react';

interface BookingFormProps {
  tourId: number;
  tourPrice: number;
  maxParticipants: number;
  defaultName?: string;
  defaultEmail?: string;
  defaultPhone?: string;
  onSubmit: (bookingData: BookingFormData) => Promise<void>;
  className?: string;
}

export interface BookingFormData {
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  participants: number;
}

export default function BookingForm({
  tourId,
  tourPrice,
  maxParticipants,
  defaultName = '',
  defaultEmail = '',
  defaultPhone = '',
  onSubmit,
  className,
}: BookingFormProps) {
  const [formData, setFormData] = useState<BookingFormData>({
    guestName: defaultName,
    guestEmail: defaultEmail,
    guestPhone: defaultPhone,
    participants: 1,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (formData.participants > maxParticipants) {
      setError(`Maximum ${maxParticipants} participants allowed.`);
      return;
    }

    if (formData.participants < 1) {
      setError('At least 1 participant is required.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalPrice = formData.participants * tourPrice;

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name *
          </label>
          <input
            type="text"
            required
            value={formData.guestName}
            onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            required
            value={formData.guestEmail}
            onChange={(e) => setFormData({ ...formData, guestEmail: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone *
          </label>
          <input
            type="tel"
            required
            value={formData.guestPhone}
            onChange={(e) => setFormData({ ...formData, guestPhone: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Number of Participants *
          </label>
          <input
            type="number"
            min="1"
            max={maxParticipants}
            required
            value={formData.participants}
            onChange={(e) => setFormData({ ...formData, participants: Number(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Maximum {maxParticipants} participants
          </p>
        </div>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-700">Total Price:</span>
            <span className="text-xl font-bold text-emerald-600">
              {totalPrice.toFixed(2)} DZD
            </span>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Submitting...' : 'Book Now'}
          </button>
        </div>
      </div>
    </form>
  );
}

