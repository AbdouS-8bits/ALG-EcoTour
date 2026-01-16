import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import TourDetailClient from './TourDetailClient';
import StructuredData from '@/components/seo/StructuredData';
import ErrorBoundary from '@/components/common/ErrorBoundary';

interface TourPageProps {
  params: Promise<{ tourId: string }>;
}

// Generate metadata for the tour page
export async function generateMetadata({ params }: TourPageProps): Promise<Metadata> {
  const { tourId } = await params;
  const tour = await prisma.ecoTour.findUnique({
    where: { id: parseInt(tourId) },
  });

  if (!tour) {
    return {
      title: 'Tour Not Found | ALG EcoTour',
      description: 'The requested tour could not be found.',
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://localhost:3000';
  const tourUrl = `${baseUrl}/ecoTour/${tour.id}`;

  return {
    title: `${tour.title} | ALG EcoTour`,
    description: tour.description || `Book ${tour.title} - An amazing eco tour in ${tour.location}, Algeria. Experience authentic local culture and sustainable tourism.`,
    keywords: [
      tour.title,
      tour.location,
      'Algeria eco tour',
      'sustainable tourism',
      'local experience',
      'adventure travel',
      'desert tour',
      'cultural tour'
    ],
    authors: [{ name: 'ALG EcoTour Team' }],
    creator: 'ALG EcoTour',
    publisher: 'ALG EcoTour',
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: tourUrl,
    },
    openGraph: {
      type: 'article',
      url: tourUrl,
      title: tour.title,
      description: tour.description || `Book ${tour.title} - An amazing eco tour in ${tour.location}, Algeria`,
      siteName: 'ALG EcoTour',
      images: tour.photoURL ? [
        {
          url: tour.photoURL,
          width: 1200,
          height: 630,
          alt: tour.title,
        },
      ] : [
        {
          url: '/images/og-image.jpg',
          width: 1200,
          height: 630,
          alt: 'ALG EcoTour - Sustainable Tourism in Algeria',
        },
      ],
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: tour.title,
      description: tour.description || `Book ${tour.title} - An amazing eco tour in ${tour.location}, Algeria`,
      images: tour.photoURL ? [tour.photoURL] : ['/images/og-image.jpg'],
      creator: '@algecotour',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function TourDetailPage({ params }: TourPageProps) {
  const { tourId } = await params;
  
  // Fetch tour data
  const tour = await prisma.ecoTour.findUnique({
    where: { id: parseInt(tourId) },
    select: {
      id: true,
      title: true,
      description: true,
      location: true,
      latitude: true,
      longitude: true,
      price: true,
      maxParticipants: true,
      photoURL: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!tour) {
    notFound();
  }

  return (
    <ErrorBoundary>
      <StructuredData tour={tour} />
      <TourDetailClient tour={tour} />
    </ErrorBoundary>
  );
}
