'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Calendar, Mountain, Users, Star } from 'lucide-react';
import { useState } from 'react';

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

interface TourCardProps {
  tour: Tour;
  index: number;
}

export default function TourCard({ tour, index }: TourCardProps) {
  const [imgError, setImgError] = useState(false);
  
  // صور محلية بديلة
  const fallbackImages = [
    '/images/tours/desert-1.jpg',
    '/images/tours/sahara.jpg',
    '/images/tours/tassili.jpg',
    '/images/tours/mountains.jpg',
  ];
  
  const randomFallback = fallbackImages[(Number(tour.id) || 0) % fallbackImages.length];
  const isAvailable = tour.currentParticipants < tour.maxParticipants;
  const statusText = isAvailable ? 'متاح' : 'ممتلئ';
  const statusColor = isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
    >
      <div className="relative h-48 overflow-hidden">
        {imgError ? (
          <div className="w-full h-full bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center">
            <Mountain className="w-16 h-16 text-white/50" />
          </div>
        ) : (
          <Image
            src={tour.photoURL || randomFallback}
            alt={tour.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
            onError={() => setImgError(true)}
            priority={false}
          />
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}>
            {statusText}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        {/* Title */}
        <h3 className="text-xl font-semibold mb-2 text-gray-900 line-clamp-1">
          {tour.title}
        </h3>

        {/* Location */}
        <div className="flex items-center text-gray-600 text-sm mb-3">
          <MapPin size={16} className="ml-1" />
          <span>{tour.location}</span>
        </div>

        {/* Duration & Participants */}
        <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
          <div className="flex items-center">
            <Calendar size={16} className="ml-1" />
            <span>{tour.duration} يوم</span>
          </div>
          <div className="flex items-center">
            <Users size={16} className="ml-1" />
            <span>{tour.maxParticipants} شخص</span>
          </div>
        </div>

        {/* Rating */}
        {tour.rating && (
          <div className="flex items-center mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(tour.rating!)
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
        )}
        
        {/* Description */}
        <p className="text-gray-600 mb-4 line-clamp-2">
          {tour.description}
        </p>
        
        {/* Price and Button */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-green-600">
              {tour.price.toLocaleString()} د.ج
            </div>
            <div className="text-sm text-gray-600">للشخص</div>
          </div>
          
          <Link 
            href={`/EcoTour/${tour.id}`}
            className="block w-full text-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            عرض التفاصيل
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
