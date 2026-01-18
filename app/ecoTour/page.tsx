'use client';
import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, MapPin, Calendar, X } from 'lucide-react';
import TourCard from '../components/TourCard';

interface Tour {
  id: string | number;
  title: string;
  description: string;
  location: string;
  price: number;
  maxParticipants: number;
  photoURL: string;
  createdAt: string;
  updatedAt: string;
}

export default function ToursPage() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [filteredTours, setFilteredTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Fetch tours
  useEffect(() => {
    const fetchTours = async () => {
      try {
        const res = await fetch('/api/tours');
        const data = await res.json();
        setTours(data);
        setFilteredTours(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTours();
  }, []);

  // Apply filters
  useEffect(() => {
    let result = [...tours];

    // Search filter
    if (searchQuery) {
      result = result.filter(tour =>
        tour.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tour.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Location filter
    if (selectedLocation !== 'all') {
      result = result.filter(tour =>
        tour.location.toLowerCase().includes(selectedLocation.toLowerCase())
      );
    }

    // Price filter
    if (minPrice) {
      result = result.filter(tour => tour.price >= parseInt(minPrice));
    }
    if (maxPrice) {
      result = result.filter(tour => tour.price <= parseInt(maxPrice));
    }

    // Sort
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    setFilteredTours(result);
  }, [searchQuery, selectedLocation, minPrice, maxPrice, sortBy, tours]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedLocation('all');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('newest');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar - Desktop */}
          <aside className="hidden lg:block lg:col-span-3 sticky top-24 h-fit">
            <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
              <h3 className="text-xl font-bold text-gray-900">الفلاتر</h3>
              
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">البحث</label>
                <div className="relative">
                  <Search className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ابحث عن رحلة..."
                    className="w-full pr-10 px-4 py-3 text-gray-900 bg-white border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الموقع</label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-4 py-3 text-gray-900 bg-white border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="all">الكل</option>
                  <option value="sahara">الصحراء</option>
                  <option value="tassili">تاسيلي</option>
                  <option value="hoggar">الأهقار</option>
                  <option value="kabylie">القبائل</option>
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">السعر (دج)</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="من"
                    className="px-4 py-2 text-gray-900 bg-white border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="إلى"
                    className="px-4 py-2 text-gray-900 bg-white border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              {/* Reset */}
              <button
                onClick={resetFilters}
                className="w-full py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                إعادة تعيين
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-9">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">اكتشف رحلاتنا</h1>
              
              {/* Filter Button - Mobile */}
              <button
                onClick={() => setIsFilterOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-300 rounded-lg mb-4"
              >
                <SlidersHorizontal className="w-5 h-5" />
                الفلاتر
              </button>

              {/* Sort */}
              <div className="flex gap-4">
                <button
                  onClick={() => setSortBy('newest')}
                  className={`px-4 py-2 rounded-lg ${sortBy === 'newest' ? 'bg-green-600 text-white' : 'bg-white text-gray-700'}`}
                >
                  الأحدث
                </button>
                <button
                  onClick={() => setSortBy('price-asc')}
                  className={`px-4 py-2 rounded-lg ${sortBy === 'price-asc' ? 'bg-green-600 text-white' : 'bg-white text-gray-700'}`}
                >
                  الأرخص
                </button>
                <button
                  onClick={() => setSortBy('price-desc')}
                  className={`px-4 py-2 rounded-lg ${sortBy === 'price-desc' ? 'bg-green-600 text-white' : 'bg-white text-gray-700'}`}
                >
                  الأغلى
                </button>
              </div>
            </div>

            {/* Results */}
            <p className="text-gray-600 mb-6">وجدنا {filteredTours.length} رحلة</p>

            {/* Tours Grid */}
            {loading ? (
              <div className="text-center py-12">جاري التحميل...</div>
            ) : filteredTours.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">لم نجد رحلات تطابق بحثك</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredTours.map((tour, index) => (
                  <TourCard 
                    key={tour.id} 
                    tour={{
                      ...tour,
                      duration: 3,
                      currentParticipants: 8,
                    }} 
                    index={index} 
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Filter Modal - Mobile */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 lg:hidden">
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white p-6 overflow-y-auto">
            <button
              onClick={() => setIsFilterOpen(false)}
              className="absolute top-4 left-4"
            >
              <X className="w-6 h-6" />
            </button>
            
            {/* Same filters as sidebar */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900">الفلاتر</h3>
              
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">البحث</label>
                <div className="relative">
                  <Search className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ابحث عن رحلة..."
                    className="w-full pr-10 px-4 py-3 text-gray-900 bg-white border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الموقع</label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-4 py-3 text-gray-900 bg-white border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="all">الكل</option>
                  <option value="sahara">الصحراء</option>
                  <option value="tassili">تاسيلي</option>
                  <option value="hoggar">الأهقار</option>
                  <option value="kabylie">القبائل</option>
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">السعر (دج)</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="من"
                    className="px-4 py-2 text-gray-900 bg-white border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="إلى"
                    className="px-4 py-2 text-gray-900 bg-white border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              {/* Reset */}
              <button
                onClick={resetFilters}
                className="w-full py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                إعادة تعيين
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
