'use client';

import { useState, useEffect } from 'react';
import OptimizedImage, { ImageSizes } from '@/components/common/OptimizedImage';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  fallback?: string;
}

interface ImageGalleryProps {
  images: GalleryImage[];
  title?: string;
}

export default function ImageGallery({ images, title = 'Tour Gallery' }: ImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  // Fallback images array - deterministic based on image index
  const fallbackImages = [
    '/images/tours/desert-1.jpg',
    '/images/tours/sahara.jpg',
    '/images/tours/tassili.jpg',
    '/images/tours/mountains.jpg',
    '/images/tours/oasis.jpg',
    '/images/tours/coast.jpg'
  ];

  const getFallbackImage = (image: GalleryImage) => {
    // Use image-specific fallback first, then deterministic fallback
    if (image.fallback) return image.fallback;
    
    // Use a simple hash of imageId to get consistent fallback
    const hash = image.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return fallbackImages[hash % fallbackImages.length];
  };

  const handleImageError = (image: GalleryImage) => {
    setImageErrors(prev => new Set(prev).add(image.id));
  };

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
  };

  const closeLightbox = () => {
    setSelectedImageIndex(null);
  };

  // Handle body overflow in useEffect
  useEffect(() => {
    if (selectedImageIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedImageIndex]);

  const navigateImage = (direction: 'prev' | 'next') => {
    if (selectedImageIndex === null) return;
    
    const newIndex = direction === 'prev' 
      ? (selectedImageIndex - 1 + images.length) % images.length
      : (selectedImageIndex + 1) % images.length;
    
    setSelectedImageIndex(newIndex);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateImage('prev');
    if (e.key === 'ArrowRight') navigateImage('next');
  };

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <>
      {/* Gallery Grid */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">معرض الصور</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => {
            const hasError = imageErrors.has(image.id);
            const imageSrc = hasError ? getFallbackImage(image) : image.src;
            
            return (
              <div
                key={image.id}
                className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group hover:shadow-lg transition-shadow duration-200"
                onClick={() => openLightbox(index)}
              >
                <OptimizedImage
                  src={imageSrc}
                  alt={image.alt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                  {...ImageSizes.gallery}
                  fallback={image.fallback}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-200" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="bg-white rounded-full p-2">
                    <svg className="w-4 h-4 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImageIndex !== null && (
        <div 
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
          onClick={closeLightbox}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          <div className="relative max-w-6xl max-h-[90vh] w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-full p-2 transition-colors"
              aria-label="Close lightbox"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Navigation Buttons */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateImage('prev');
                  }}
                  className="absolute left-4 z-10 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-full p-2 transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateImage('next');
                  }}
                  className="absolute right-4 z-10 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-full p-2 transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>
              </>
            )}

            {/* Main Image */}
            <div className="relative w-full h-full max-w-4xl max-h-[80vh]">
              {(() => {
                const currentImage = images[selectedImageIndex];
                const hasError = imageErrors.has(currentImage.id);
                const imageSrc = hasError ? getFallbackImage(currentImage) : currentImage.src;
                
                return (
                  <OptimizedImage
                    src={imageSrc}
                    alt={currentImage.alt}
                    fill
                    className="object-contain"
                    {...ImageSizes.lightbox}
                    fallback={currentImage.fallback}
                  />
                );
              })()}
            </div>

            {/* Image Counter */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                {selectedImageIndex + 1} / {images.length}
              </div>
            )}

            {/* Image Caption */}
            {images[selectedImageIndex].alt && (
              <div className="absolute bottom-4 left-4 right-4 text-center">
                <p className="text-white text-sm bg-black bg-opacity-50 inline-block px-3 py-1 rounded">
                  {images[selectedImageIndex].alt}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
