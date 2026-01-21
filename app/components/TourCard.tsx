'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Calendar, Mountain, Users, Star, Heart, Eye } from 'lucide-react';
import { useState } from 'react';
import ReactionButton from '@/app/components/social/ReactionButton';

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
  const [isLiked, setIsLiked] = useState(false);
  
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
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group"
    >
      {/* Image Container */}
      <div className="relative h-56 overflow-hidden">
        {imgError ? (
          <div className="w-full h-full bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center">
            <Mountain className="w-20 h-20 text-white/30" />
          </div>
        ) : (
          <Image
            src={tour.photoURL || randomFallback}
            alt={tour.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
            loading="lazy"
            onError={() => setImgError(true)}
            priority={index < 4}
          />
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor} backdrop-blur-sm`}>
            {statusText}
          </span>
        </div>

        {/* Quick Actions */}
        <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.preventDefault();
                setIsLiked(!isLiked);
              }}
              className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-600 hover:text-red-500 transition-colors"
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current text-red-500' : ''}`} />
            </button>
            <div className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-600">
              <Eye className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Rating Badge */}
        {tour.rating && (
          <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-semibold text-gray-900">{tour.rating.toFixed(1)}</span>
              <span className="text-xs text-gray-600">({tour.reviews || 0})</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-6">
        {/* Title */}
        <h3 className="text-xl font-bold mb-3 text-gray-900 line-clamp-2 group-hover:text-green-600 transition-colors">
          {tour.title}
        </h3>

        {/* Location */}
        <div className="flex items-center text-gray-600 text-sm mb-4">
          <MapPin size={16} className="ml-2 text-green-500" />
          <span>{tour.location}</span>
        </div>

        {/* Duration & Participants */}
        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <div className="flex items-center">
            <Calendar size={16} className="ml-1 text-blue-500" />
            <span>{tour.duration} يوم</span>
          </div>
          <div className="flex items-center">
            <Users size={16} className="ml-1 text-purple-500" />
            <span>{tour.maxParticipants} شخص</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed">
          {tour.description}
        </p>

        {/* Price and Reactions */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col">
            <div className="text-2xl font-bold text-green-600">
              {tour.price.toLocaleString()} د.ج
            </div>
            <div className="text-sm text-gray-500">للشخص</div>
          </div>
          
          {/* Mini Reaction Button */}
          <ReactionButton 
            tourId={tour.id.toString()}
            className="scale-75"
          />
        </div>
        
        {/* CTA Button */}
        <Link 
          href={`/EcoTour/${tour.id}`}
          className="block w-full text-center px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl hover:from-green-700 hover:to-teal-700 transition-all duration-300 font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          عرض التفاصيل
        </Link>
      </div>
    </motion.div>
  );
}
