'use client';
import { useState, useEffect } from 'react';
import { Search, Filter, Check, X, AlertCircle, Calendar, Users, MapPin, Phone, Mail, Trash2, Eye, Edit } from 'lucide-react';
import { BookingWithTour } from '@/lib/bookings';
import { useToast } from '@/components/bookings/Toast';

interface AdminBookingsClientProps {
  bookings: BookingWithTour[];
}

export default function AdminBookingsClient({ bookings: initialBookings }: AdminBookingsClientProps) {
  const [bookings, setBookings] = useState<BookingWithTour[]>(initialBookings);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');
  const [selectedBooking, setSelectedBooking] = useState<BookingWithTour | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [notes, setNotes] = useState('');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'confirm' | 'cancel' | 'delete' | 'edit'>('confirm');
  const { showToast } = useToast();

  const fetchBookings = async (filters?: any) => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = new URLSearchParams(filters || {}).toString();
      const response = await fetch(`/api/admin/bookings?${queryParams}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }
      
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError('Failed to load bookings. Please try again.');
      showToast({
        type: 'error',
        title: 'Fetch failed',
        message: 'Could not load bookings data'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId: number, newStatus: string, notes?: string) => {
    try {
      setUpdatingStatus(bookingId);
      
      const response = await fetch(`/api/admin/bookings`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: bookingId,
          status: newStatus,
          notes: notes || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update booking status');
      }

      const updatedBooking = await response.json();
      
      // Update local state
      setBookings(prev => prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: newStatus as any, notes: notes || booking.notes }
          : booking
      ));

      setSelectedBooking(null);
      setShowDetailsModal(false);
      setNotes('');

      showToast({
        type: 'success',
        title: 'Booking updated',
        message: `Booking status changed to ${newStatus}`
      });
    } catch (error) {
      console.error('Error updating booking:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update booking status';
      
      showToast({
        type: 'error',
        title: 'Update failed',
        message: errorMessage
      });
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleDeleteBooking = async (bookingId: number) => {
    try {
      setDeletingId(bookingId);
      
      const response = await fetch(`/api/admin/bookings?id=${bookingId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete booking');
      }

      // Update local state
      setBookings(prev => prev.filter(booking => booking.id !== bookingId));
      
      setShowConfirmModal(false);
      setSelectedBooking(null);
      setDeletingId(null);

      showToast({
        type: 'success',
        title: 'Booking deleted',
        message: 'The booking has been permanently deleted'
      });
    } catch (error) {
      console.error('Error deleting booking:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete booking';
      
      showToast({
        type: 'error',
        title: 'Delete failed',
        message: errorMessage
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleConfirmAction = (action: 'confirm' | 'cancel' | 'delete' | 'edit', booking: BookingWithTour) => {
    setSelectedBooking(booking);
    setConfirmAction(action);
    setShowConfirmModal(true);
  };

  const handleConfirmActionExecute = async () => {
    if (!selectedBooking) return;

    try {
      if (confirmAction === 'confirm') {
        await handleStatusUpdate(selectedBooking.id, 'confirmed', notes);
      } else if (confirmAction === 'cancel') {
        await handleStatusUpdate(selectedBooking.id, 'cancelled', notes);
      } else if (confirmAction === 'delete') {
        await handleDeleteBooking(selectedBooking.id);
      } else if (confirmAction === 'edit') {
        // For edit action, open the details modal
        setShowConfirmModal(false);
        setNotes(selectedBooking.notes || '');
        setShowDetailsModal(true);
      }
    } catch (error) {
      console.error('Error executing action:', error);
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
        return <Calendar className="w-4 h-4" />;
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

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         booking.guestEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         booking.tour?.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Apply filters when they change
  useEffect(() => {
    const filters: any = {};
    if (statusFilter !== 'all') filters.status = statusFilter;
    if (searchQuery) filters.search = searchQuery;
    
    fetchBookings(filters);
  }, [statusFilter, searchQuery]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">Bookings Management</h1>
            <div className="text-sm text-gray-500">
              Total: {filteredBookings.length} bookings
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by guest name, email, or tour..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              <span className="text-red-800">{error}</span>
              <button
                onClick={() => fetchBookings()}
                className="ml-auto text-red-600 hover:text-red-800 underline"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bookings List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No bookings found</h3>
            <p className="text-gray-500">
              {searchQuery || statusFilter !== 'all' 
                ? 'Try adjusting your filters' 
                : 'No bookings have been made yet'
              }
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Guest
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tour
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Participants
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{booking.guestName}</div>
                          <div className="text-sm text-gray-500">{booking.guestEmail}</div>
                          <div className="text-sm text-gray-500">{booking.guestPhone}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{booking.tour?.title || 'N/A'}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {booking.tour?.location || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          <Users className="w-4 h-4 mr-1" />
                          {booking.participants}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                          {getStatusIcon(booking.status)}
                          <span className="ml-1">{getStatusText(booking.status)}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              setSelectedBooking(booking);
                              setNotes(booking.notes || '');
                              setShowDetailsModal(true);
                            }}
                            className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </button>
                          <button
                            onClick={() => handleConfirmAction('edit', booking)}
                            className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                          >
                            <Edit className="w-4 h-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleConfirmAction('confirm', booking)}
                            disabled={booking.status === 'confirmed'}
                            className="text-green-600 hover:text-green-900 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Check className="w-4 h-4" />
                            Confirm
                          </button>
                          <button
                            onClick={() => handleConfirmAction('cancel', booking)}
                            disabled={booking.status === 'cancelled'}
                            className="text-yellow-600 hover:text-yellow-900 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <X className="w-4 h-4" />
                            Cancel
                          </button>
                          <button
                            onClick={() => handleConfirmAction('delete', booking)}
                            className="text-red-600 hover:text-red-900 flex items-center gap-1"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Booking Details</h2>
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedBooking(null);
                    setNotes('');
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Guest Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Guest Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-500">Name</span>
                      <p className="font-medium text-gray-900">{selectedBooking.guestName}</p>
                    </div>
                    <div>
                      <span className="text-3 text-gray-500">Email</span>
                      <p className="font-medium text-gray-900">{selectedBooking.guestEmail}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Phone</span>
                      <p className="font-medium text-gray-900">{selectedBooking.guestPhone}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Participants</span>
                      <p className="font-medium text-gray-900">{selectedBooking.participants}</p>
                    </div>
                  </div>
                </div>

                {/* Tour Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Tour Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-500">Tour</span>
                      <p className="font-medium text-gray-900">{selectedBooking.tour?.title || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Location</span>
                      <p className="font-medium text-gray-900">{selectedBooking.tour?.location || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Price per Person</span>
                      <p className="font-medium text-gray-900">
                        {selectedBooking.tour?.price ? 
                          `${selectedBooking.tour.price.toLocaleString()} د.ج` : 
                          'N/A'
                        }
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Total Price</span>
                      <p className="font-medium text-gray-900">
                        {selectedBooking.tour?.price ? 
                          `${(selectedBooking.tour.price * selectedBooking.participants).toLocaleString()} د.ج` : 
                          'N/A'
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* Status Management */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Status Management</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Update Status
                      </label>
                      <select
                        value={selectedBooking.status}
                        onChange={(e) => {
                          setSelectedBooking(prev => prev ? {...prev, status: e.target.value as any} : null);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Admin Notes
                      </label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Add internal notes about this booking..."
                      />
                    </div>

                    <div className="flex justify-end space-x-4">
                      <button
                        onClick={() => {
                          setShowDetailsModal(false);
                          setSelectedBooking(null);
                          setNotes('');
                        }}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(selectedBooking.id, selectedBooking.status, notes)}
                        disabled={updatingStatus === selectedBooking.id}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {updatingStatus === selectedBooking.id ? 'Updating...' : 'Update Status'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Timestamps */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Timestamps</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-500">Created</span>
                      <p className="font-medium text-gray-900">
                        {new Date(selectedBooking.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Last Updated</span>
                      <p className="font-medium text-gray-900">
                        {new Date(selectedBooking.updatedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                {confirmAction === 'delete' ? 'Delete Booking' : 
                 confirmAction === 'confirm' ? 'Confirm Booking' : 
                 confirmAction === 'cancel' ? 'Cancel Booking' : 'Edit Booking'}
              </h3>
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setSelectedBooking(null);
                  setConfirmAction('confirm');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-gray-600">
                {confirmAction === 'delete' 
                  ? 'Are you sure you want to delete this booking? This action cannot be undone.'
                  : confirmAction === 'confirm'
                  ? `Are you sure you want to confirm this booking?`
                  : confirmAction === 'cancel'
                  ? 'Are you sure you want to cancel this booking?'
                  : 'Do you want to edit this booking? You can modify the status and add notes.'
                }
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm font-medium text-gray-700">Booking:</span>
                  <span className="font-medium text-gray-900">{selectedBooking.tour?.title || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm font-medium text-gray-700">Guest:</span>
                  <span className="font-medium text-gray-900">{selectedBooking.guestName}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-700">Date:</span>
                  <span className="font-medium text-gray-900">
                    {new Date(selectedBooking.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setSelectedBooking(null);
                  setConfirmAction('confirm');
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmActionExecute}
                disabled={updatingStatus !== null || deletingId !== null}
                className={`px-4 py-2 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed ${
                  confirmAction === 'delete' ? 'bg-red-600 hover:bg-red-700' : 
                  confirmAction === 'confirm' ? 'bg-green-600 hover:bg-green-700' : 
                  confirmAction === 'cancel' ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {updatingStatus === selectedBooking.id ? 'Processing...' : 
                 deletingId === selectedBooking.id ? 'Deleting...' : 
                 confirmAction === 'confirm' ? 'Confirm Booking' : 
                 confirmAction === 'cancel' ? 'Cancel Booking' : 
                 confirmAction === 'edit' ? 'Edit Booking' : 'Execute'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
