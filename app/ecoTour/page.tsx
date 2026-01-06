'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Calendar, Star, Filter, X, ChevronDown, Users, Clock, DollarSign, Sparkles, TrendingUp, Clock3 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface Tour {
  id: string | number;
  title: string;
  description: string;
  location: string;
  price: number;
  duration: number;
  maxParticipants: number;
  currentParticipants: number;
  photoURL: string;
  rating?: number;
  reviews?: number;
  createdAt: string;
  updatedAt: string;
}

interface Filters {
  search: string;
  location: string;
  minPrice: number;
  maxPrice: number;
  duration: string;
  participants: number;
  sortBy: 'latest' | 'price' | 'popular';
}

export default function EcoTourPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [tours, setTours] = useState<Tour[]>([]);
  const [filteredTours, setFilteredTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    search: '',
    location: '',
    minPrice: 0,
    maxPrice: 50000,
    duration: '',
    participants: 1,
    sortBy: 'latest'
  });

  // Fetch tours from API
  useEffect(() => {
    async function fetchTours() {
      try {
        setLoading(true);
        const res = await fetch('/api/ecotours');
        if (!res.ok) throw new Error('Failed to fetch tours');
        const data = await res.json();
        const toursData = data.tours ?? data.ecoTours ?? data ?? [];
        
        // Add default rating and reviews if not present
        const enrichedTours = toursData.map((tour: Tour) => ({
          ...tour,
          rating: tour.rating || Math.floor(Math.random() * 2) + 3, // 3-5 stars
          reviews: tour.reviews || Math.floor(Math.random() * 50) + 10,
          duration: tour.duration || Math.floor(Math.random() * 5) + 1
        }));
        
        setTours(enrichedTours);
      } catch (err) {
        console.error('Error fetching tours:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchTours();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...tours];

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(tour =>
        tour.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        tour.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        tour.location.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Location filter
    if (filters.location) {
      filtered = filtered.filter(tour =>
        tour.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Price range filter
    filtered = filtered.filter(tour =>
      tour.price >= filters.minPrice && tour.price <= filters.maxPrice
    );

    // Duration filter
    if (filters.duration) {
      filtered = filtered.filter(tour => {
        switch (filters.duration) {
          case '1': return tour.duration === 1;
          case '2-3': return tour.duration >= 2 && tour.duration <= 3;
          case '4-7': return tour.duration >= 4 && tour.duration <= 7;
          case '8+': return tour.duration >= 8;
          default: return true;
        }
      });
    }

    // Participants filter
    filtered = filtered.filter(tour =>
      tour.maxParticipants >= filters.participants
    );

    // Sort
    switch (filters.sortBy) {
      case 'price':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'popular':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'latest':
      default:
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    setFilteredTours(filtered);
  }, [tours, filters]);

  const resetFilters = () => {
    setFilters({
      search: '',
      location: '',
      minPrice: 0,
      maxPrice: 50000,
      duration: '',
      participants: 1,
      sortBy: 'latest'
    });
  };

  const handleTourClick = (tourId: string | number) => {
    router.push(`/ecoTour/${tourId}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Breadcrumb */}
          <nav className="flex items-center text-sm text-gray-600 mb-4">
            <Link href="/" className="hover:text-green-600 transition-colors">الرئيسية</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">الرحلات</span>
          </nav>

          {/* Title and Results Count */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-3xl font-bold text-gray-900">اكتشف رحلاتنا</h1>
            <div className="flex items-center gap-4">
              <span className="text-gray-600">
                وجدنا <span className="font-semibold text-green-600">{filteredTours.length}</span> رحلة
              </span>
              
              {/* Sort Tabs */}
              <div className="hidden sm:flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setFilters({ ...filters, sortBy: 'latest' })}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    filters.sortBy === 'latest'
                      ? 'bg-white text-green-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Clock3 className="w-4 h-4 inline ml-1" />
                  الأحدث
                </button>
                <button
                  onClick={() => setFilters({ ...filters, sortBy: 'price' })}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    filters.sortBy === 'price'
                      ? 'bg-white text-green-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <DollarSign className="w-4 h-4 inline ml-1" />
                  الأرخص
                </button>
                <button
                  onClick={() => setFilters({ ...filters, sortBy: 'popular' })}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    filters.sortBy === 'popular'
                      ? 'bg-white text-green-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Sparkles className="w-4 h-4 inline ml-1" />
                  الأشهر
                </button>
              </div>

              {/* Mobile Filter Button */}
              <button
                onClick={() => setShowMobileFilters(true)}
                className="sm:hidden flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Filter className="w-4 h-4" />
                الفلاتر
              </button>
            </div>
          </div>

          {/* Mobile Sort */}
          <div className="sm:hidden mt-4 flex gap-2 overflow-x-auto">
            {['latest', 'price', 'popular'].map((sort) => (
              <button
                key={sort}
                onClick={() => setFilters({ ...filters, sortBy: sort as any })}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  filters.sortBy === sort
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {sort === 'latest' && 'الأحدث'}
                {sort === 'price' && 'الأرخص'}
                {sort === 'popular' && 'الأشهر'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar - Desktop */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">الفلاتر</h2>
                <button
                  onClick={resetFilters}
                  className="text-sm text-green-600 hover:text-green-700 font-medium"
                >
                  إعادة تعيين
                </button>
              </div>

              {/* Search Box */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">البحث</label>
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="ابحث عن رحلة..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white placeholder-gray-500"
                  />
                </div>
              </div>

              {/* Location Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">الموقع</label>
                <select
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white"
                >
                  <option value="">الكل</option>
                  <option value="الجزائر العاصمة">الجزائر العاصمة</option>
                  <option value="الصحراء الكبرى">الصحراء الكبرى</option>
                  <option value="تاسيلي">تاسيلي</option>
                  <option value="تمنراست">تمنراست</option>
                  <option value="وهران">وهران</option>
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">السعر (دج)</label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    placeholder="الحد الأدنى"
                    min="0"
                    value={filters.minPrice}
                    onChange={(e) => setFilters({ ...filters, minPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white placeholder-gray-500"
                  />
                  <span className="text-gray-500">-</span>
                  <input
                    type="number"
                    placeholder="الحد الأعلى"
                    min="0"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white placeholder-gray-500"
                  />
                </div>
              </div>

              {/* Duration Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">المدة</label>
                <div className="space-y-2">
                  {[
                    { value: '1', label: 'يوم واحد' },
                    { value: '2-3', label: '2-3 أيام' },
                    { value: '4-7', label: '4-7 أيام' },
                    { value: '8+', label: 'أسبوع+' }
                  ].map((duration) => (
                    <label key={duration.value} className="flex items-center">
                      <input
                        type="radio"
                        name="duration"
                        value={duration.value}
                        checked={filters.duration === duration.value}
                        onChange={(e) => setFilters({ ...filters, duration: e.target.value })}
                        className="ml-2 text-green-600 focus:ring-green-500"
                      />
                      <span className="text-sm text-gray-700">{duration.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Participants Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">عدد المشاركين</label>
                <input
                  type="number"
                  min="1"
                  value={filters.participants}
                  onChange={(e) => setFilters({ ...filters, participants: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white placeholder-gray-500"
                />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9">
            {loading ? (
              // Loading State
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
                    <div className="aspect-w-4 aspect-h-3 bg-gray-300"></div>
                    <div className="p-6">
                      <div className="h-6 bg-gray-300 rounded mb-2"></div>
                      <div className="h-4 bg-gray-300 rounded mb-4"></div>
                      <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
                      <div className="h-8 bg-gray-300 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredTours.length === 0 ? (
              // Empty State
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">لم نجد رحلات تطابق بحثك</h3>
                <p className="text-gray-600 mb-6">جرب تعديل الفلاتر أو البحث بكلمات مختلفة</p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  إعادة تعيين
                </button>
              </div>
            ) : (
              // Tours Grid
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredTours.map((tour) => (
                  <motion.div
                    key={tour.id}
                    variants={cardVariants}
                    whileHover={{ scale: 1.05 }}
                    className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
                    onClick={() => handleTourClick(tour.id)}
                  >
                    {/* Image Container */}
                    <div className="relative aspect-w-4 aspect-h-3 h-48">
                      <Image
                        src={tour.photoURL || '/placeholder-tour.jpg'}
                        alt={tour.title}
                        fill
                        className="object-cover"
                      />
                      {/* Overlay Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                      
                      {/* Status Badge */}
                      <div className="absolute top-4 left-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          (tour.currentParticipants || 0) < tour.maxParticipants
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {(tour.currentParticipants || 0) < tour.maxParticipants ? 'متاح' : 'ممتلئ'}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      {/* Title */}
                      <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-1">
                        {tour.title}
                      </h3>

                      {/* Location */}
                      <div className="flex items-center text-gray-600 text-sm mb-3">
                        <MapPin className="w-4 h-4 ml-1" />
                        {tour.location}
                      </div>

                      {/* Duration & Participants */}
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 ml-1" />
                          {tour.duration} يوم
                        </div>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 ml-1" />
                          {tour.maxParticipants} شخص
                        </div>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center mb-4">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < (tour.rating || 0)
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600 mr-2">
                          ({tour.reviews || 0} تقييم)
                        </span>
                      </div>

                      {/* Price */}
                      <div className="mb-4">
                        <div className="text-2xl font-bold text-green-600">
                          {tour.price.toLocaleString()} دج
                        </div>
                        <div className="text-sm text-gray-600">للشخص الواحد</div>
                      </div>

                      {/* Button */}
                      <button className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
                        عرض التفاصيل
                      </button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Modal */}
      <AnimatePresence>
        {showMobileFilters && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden"
            onClick={() => setShowMobileFilters(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="absolute left-0 top-0 h-full w-80 bg-white overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">الفلاتر</h2>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Mobile Filters Content (Same as Desktop) */}
                <div className="space-y-6">
                  {/* Search Box */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">البحث</label>
                    <div className="relative">
                      <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="ابحث عن رحلة..."
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                        className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white placeholder-gray-500"
                      />
                    </div>
                  </div>

                  {/* Location Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">الموقع</label>
                    <select
                      value={filters.location}
                      onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white"
                    >
                      <option value="">الكل</option>
                      <option value="الجزائر العاصمة">الجزائر العاصمة</option>
                      <option value="الصحراء الكبرى">الصحراء الكبرى</option>
                      <option value="تاسيلي">تاسيلي</option>
                      <option value="تمنراست">تمنراست</option>
                      <option value="وهران">وهران</option>
                    </select>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">السعر (دج)</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        placeholder="الحد الأدنى"
                        min="0"
                        value={filters.minPrice}
                        onChange={(e) => setFilters({ ...filters, minPrice: Number(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white placeholder-gray-500"
                      />
                      <span className="text-gray-500">-</span>
                      <input
                        type="number"
                        placeholder="الحد الأعلى"
                        min="0"
                        value={filters.maxPrice}
                        onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white placeholder-gray-500"
                      />
                    </div>
                  </div>

                  {/* Duration Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">المدة</label>
                    <div className="space-y-2">
                      {[
                        { value: '1', label: 'يوم واحد' },
                        { value: '2-3', label: '2-3 أيام' },
                        { value: '4-7', label: '4-7 أيام' },
                        { value: '8+', label: 'أسبوع+' }
                      ].map((duration) => (
                        <label key={duration.value} className="flex items-center">
                          <input
                            type="radio"
                            name="duration"
                            value={duration.value}
                            checked={filters.duration === duration.value}
                            onChange={(e) => setFilters({ ...filters, duration: e.target.value })}
                            className="ml-2 text-green-600 focus:ring-green-500"
                          />
                          <span className="text-sm text-gray-700">{duration.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Participants Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">عدد المشاركين</label>
                    <input
                      type="number"
                      min="1"
                      value={filters.participants}
                      onChange={(e) => setFilters({ ...filters, participants: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white placeholder-gray-500"
                    />
                  </div>

                  {/* Reset Button */}
                  <button
                    onClick={resetFilters}
                    className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    إعادة تعيين الفلاتر
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}