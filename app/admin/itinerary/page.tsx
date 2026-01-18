'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Plus, Edit, Trash2, CheckCircle, AlertCircle, MapPin, X } from 'lucide-react';

interface Itinerary {
  id: number;
  tourId: number;
  dayNumber: number;
  title: string;
  description: string;
  createdAt: string;
  tour?: {
    title: string;
  };
}

interface Tour {
  id: number;
  title: string;
  description: string;
}

export default function AdminItineraryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingItinerary, setEditingItinerary] = useState<Itinerary | null>(null);
  const [selectedTourFilter, setSelectedTourFilter] = useState<string>('all');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [formData, setFormData] = useState({
    tourId: '',
    dayNumber: '',
    title: '',
    description: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
      return;
    }
    if (status === 'authenticated' && session?.user?.role !== 'admin') {
      router.push('/');
      return;
    }
    fetchData();
  }, [status, session, router]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [itinerariesRes, toursRes] = await Promise.all([
        fetch('/api/tours'),
        fetch('/api/tours'),
      ]);

      if (!itinerariesRes.ok || !toursRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const toursData = await toursRes.json();
      setTours(Array.isArray(toursData) ? toursData : []);

      // Fetch itineraries for all tours
      const allItineraries: Itinerary[] = [];
      for (const tour of Array.isArray(toursData) ? toursData : []) {
        try {
          const res = await fetch(`/api/tours/${tour.id}/itineraries`);
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data)) {
              allItineraries.push(...data.map((item: any) => ({ ...item, tour: { title: tour.title } })));
            }
          }
        } catch (err) {
          console.error(`Failed to fetch itineraries for tour ${tour.id}`);
        }
      }
      setItineraries(allItineraries);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.tourId || !formData.dayNumber || !formData.title) {
      setMessage({ type: 'error', text: 'Please fill all required fields' });
      return;
    }

    try {
      setActionLoading('submit');
      const url = editingItinerary 
        ? `/api/tours/${formData.tourId}/itineraries/${editingItinerary.id}`
        : `/api/tours/${formData.tourId}/itineraries`;
      const method = editingItinerary ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dayNumber: parseInt(formData.dayNumber),
          title: formData.title,
          description: formData.description,
        }),
      });

      if (!response.ok) throw new Error('Failed to save itinerary');

      const savedItinerary = await response.json();
      const tour = tours.find(t => t.id === parseInt(formData.tourId));

      if (editingItinerary) {
        setItineraries(itineraries.map(i => 
          i.id === savedItinerary.id 
            ? { ...savedItinerary, tour: { title: tour?.title || 'Unknown' } }
            : i
        ));
      } else {
        setItineraries([...itineraries, { ...savedItinerary, tour: { title: tour?.title || 'Unknown' } }]);
      }

      setMessage({ type: 'success', text: `Itinerary ${editingItinerary ? 'updated' : 'created'} successfully` });
      resetForm();
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: (error as Error).message });
    } finally {
      setActionLoading(null);
    }
  };

  const handleEdit = (itinerary: Itinerary) => {
    setEditingItinerary(itinerary);
    setFormData({
      tourId: itinerary.tourId.toString(),
      dayNumber: itinerary.dayNumber.toString(),
      title: itinerary.title,
      description: itinerary.description,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Delete itinerary "${title}"?`)) return;

    try {
      setActionLoading(`delete-${id}`);
      const itinerary = itineraries.find(i => i.id === id);
      if (!itinerary) return;

      const response = await fetch(`/api/tours/${itinerary.tourId}/itineraries/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete itinerary');

      setItineraries(itineraries.filter(i => i.id !== id));
      setMessage({ type: 'success', text: 'Itinerary deleted successfully' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: (error as Error).message });
    } finally {
      setActionLoading(null);
    }
  };

  const resetForm = () => {
    setFormData({ tourId: '', dayNumber: '', title: '', description: '' });
    setEditingItinerary(null);
    setShowForm(false);
  };

  const filteredItineraries = selectedTourFilter === 'all'
    ? itineraries
    : itineraries.filter(i => i.tourId === parseInt(selectedTourFilter));

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Itinerary Management</h1>
            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Plus className="w-4 h-4" />
              New Itinerary
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      {message.text && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className={`p-4 rounded-lg flex items-center ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 mr-2" />
            ) : (
              <AlertCircle className="w-5 h-5 mr-2" />
            )}
            {message.text}
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <select
          value={selectedTourFilter}
          onChange={(e) => setSelectedTourFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="all">All Tours</option>
          {tours.map(tour => (
            <option key={tour.id} value={tour.id}>{tour.title}</option>
          ))}
        </select>
      </div>

      {/* Itineraries List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchData}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        ) : filteredItineraries.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No itineraries found</h3>
            <p className="text-gray-500 mb-4">Create your first itinerary</p>
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Create Itinerary
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredItineraries.sort((a, b) => a.dayNumber - b.dayNumber).map((itinerary) => (
              <div key={itinerary.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                        Day {itinerary.dayNumber}
                      </span>
                      <h3 className="text-lg font-semibold text-gray-900">{itinerary.title}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{itinerary.tour?.title}</p>
                    <p className="text-gray-700">{itinerary.description}</p>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleEdit(itinerary)}
                      className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(itinerary.id, itinerary.title)}
                      disabled={actionLoading === `delete-${itinerary.id}`}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingItinerary ? 'Edit Itinerary' : 'Create Itinerary'}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tour *
                    </label>
                    <select
                      name="tourId"
                      value={formData.tourId}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Select a tour...</option>
                      {tours.map(tour => (
                        <option key={tour.id} value={tour.id}>{tour.title}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Day Number *
                    </label>
                    <input
                      type="number"
                      name="dayNumber"
                      value={formData.dayNumber}
                      onChange={handleInputChange}
                      required
                      min="1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., Hiking to the summit"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Describe this day's activities..."
                  />
                </div>

                <div className="flex justify-end space-x-4 pt-4 border-t">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading === 'submit' || !formData.tourId || !formData.dayNumber || !formData.title}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    {actionLoading === 'submit' ? 'Saving...' : (editingItinerary ? 'Update' : 'Create')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
