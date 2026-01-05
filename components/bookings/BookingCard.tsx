interface Booking {
  id: number;
  tourId: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  participants: number;
  status: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

interface Tour {
  id: number;
  title: string;
  location: string;
  price: number;
}

interface BookingCardProps {
  booking: Booking;
  tour?: Tour;
  className?: string;
}

export default function BookingCard({ booking, tour, className }: BookingCardProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className || ''}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {tour ? tour.title : `Booking #${booking.id}`}
          </h3>
          {tour && (
            <p className="text-sm text-gray-600 mt-1">{tour.location}</p>
          )}
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
            booking.status
          )}`}
        >
          {booking.status}
        </span>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Guest Name:</span>
          <span className="text-gray-900 font-medium">{booking.guestName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Email:</span>
          <span className="text-gray-900">{booking.guestEmail}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Phone:</span>
          <span className="text-gray-900">{booking.guestPhone}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Participants:</span>
          <span className="text-gray-900 font-medium">{booking.participants}</span>
        </div>
        {tour && (
          <div className="flex justify-between">
            <span className="text-gray-600">Total Price:</span>
            <span className="text-emerald-600 font-bold">
              {(booking.participants * tour.price).toFixed(2)} DZD
            </span>
          </div>
        )}
        <div className="flex justify-between pt-2 border-t">
          <span className="text-gray-600">Booked on:</span>
          <span className="text-gray-900">{formatDate(booking.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}

