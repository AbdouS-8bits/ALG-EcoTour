'use client';

import Image from 'next/image';
import { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
  loading?: 'lazy' | 'eager';
  fallback?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  role?: string;
  ariaLabel?: string;
}

const fallbackImages = [
  '/images/tours/desert-1.jpg',
  '/images/tours/sahara.jpg',
  '/images/tours/tassili.jpg',
  '/images/tours/mountains.jpg',
  '/images/tours/oasis.jpg',
  '/images/tours/coast.jpg'
];

// Deterministic fallback based on src
const getDeterministicFallback = (src: string): string => {
  const hash = src.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return fallbackImages[hash % fallbackImages.length];
};

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className = '',
  sizes,
  priority = false,
  loading = 'lazy',
  fallback,
  objectFit = 'cover',
  quality = 75,
  placeholder = 'empty',
  blurDataURL,
  role,
  ariaLabel
}: OptimizedImageProps) {
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState(src);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      const fallbackSrc = fallback || getDeterministicFallback(src);
      setImageSrc(fallbackSrc);
    }
  };

  const imageProps = {
    src: imageSrc,
    alt: alt || '',
    className: `${objectFit === 'cover' ? 'object-cover' : objectFit === 'contain' ? 'object-contain' : ''} ${className}`,
    sizes: sizes || (fill ? '100vw' : undefined),
    priority,
    loading,
    quality,
    placeholder,
    blurDataURL,
    onError: handleError,
    role: role || 'img',
    'aria-label': ariaLabel || alt || '',
    ...(fill ? { fill } : { width, height })
  };

  return <Image {...imageProps} />;
}

// Predefined size configurations for common use cases
export const ImageSizes = {
  hero: {
    sizes: '(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 70vw',
    quality: 85,
    priority: true,
    loading: 'eager' as const,
  },
  card: {
    sizes: '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw',
    quality: 75,
    priority: false,
    loading: 'lazy' as const,
  },
  gallery: {
    sizes: '(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw',
    quality: 80,
    priority: false
  },
  thumbnail: {
    sizes: '100px',
    quality: 70,
    priority: false
  },
  lightbox: {
    sizes: '100vw',
    quality: 90,
    priority: true
  }
} as const;
