'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Calendar } from 'lucide-react';

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
  createdAt: string;
  updatedAt: string;
}

interface TourCardProps {
  tour: Tour;
  index: number;
}

export default function TourCard({ tour, index }: TourCardProps) {
  const isAvailable = tour.currentParticipants < tour.maxParticipants;
  const statusText = isAvailable ? 'متاح' : 'ممتلئ';
  const statusColor = isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.05 }}
      className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
    >
      <div className="relative h-48">
        <Image
          src={tour.photoURL || '/placeholder-tour.jpg'}
          alt={tour.title}
          fill
          className="object-cover"
        />
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}>
            {statusText}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2 text-slate-800">
          {tour.title}
        </h3>
        
        <div className="flex items-center gap-4 text-sm text-slate-600 mb-3">
          <div className="flex items-center gap-1">
            <MapPin size={16} />
            <span>{tour.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar size={16} />
            <span>{tour.duration} يوم</span>
          </div>
        </div>
        
        <p className="text-slate-600 mb-4 line-clamp-2">
          {tour.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-green-600">
            {tour.price} د.ج
          </div>
          <Link 
            href={`/EcoTour/${tour.id}`}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            عرض التفاصيل
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
