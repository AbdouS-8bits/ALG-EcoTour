import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';

interface Tour {
  id: number;
  title: string;
  description: string | null;
  location: string;
  price: number;
  maxParticipants: number;
  photoURL: string | null;
  updatedAt: Date;
}

// Generate dynamic metadata for tour pages
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ tourId: string }> 
}): Promise<Metadata> {
  const { tourId } = await params;
  
  try {
    // Fetch tour data for metadata
    const tour: Tour | null = await prisma.ecoTour.findUnique({
      where: { id: parseInt(tourId) },
      select: {
        id: true,
        title: true,
        description: true,
        location: true,
        price: true,
        maxParticipants: true,
        photoURL: true,
        updatedAt: true,
      },
    });
    
    if (!tour) {
      return {
        title: 'Tour Not Found - ALG EcoTour',
        description: 'The requested tour could not be found.',
      };
    }
    
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://localhost:3000';
    const tourUrl = `${baseUrl}/ecoTour/${tourId}`;
    
    return {
      title: `${tour.title} - ALG EcoTour`,
      description: tour.description || `Discover ${tour.title} in ${tour.location}. Book this amazing eco tour experience in Algeria.`,
      keywords: [
        tour.title,
        tour.location,
        'eco tour',
        'Algeria',
        'sustainable tourism',
        'adventure travel',
        'local experience'
      ].filter(Boolean).join(', '),
      authors: [{ name: 'ALG EcoTour Team' }],
      creator: 'ALG EcoTour',
      publisher: 'ALG EcoTour',
      metadataBase: new URL(baseUrl),
      alternates: {
        canonical: tourUrl
      },
      openGraph: {
        type: 'article',
        url: tourUrl,
        title: tour.title,
        description: tour.description || `Discover ${tour.title} in ${tour.location}. Book this amazing eco tour experience in Algeria.`,
        siteName: 'ALG EcoTour',
        locale: 'en_US',
        images: tour.photoURL ? [
          {
            url: tour.photoURL,
            width: 1200,
            height: 630,
            alt: `${tour.title} - Eco Tour in ${tour.location}`,
          },
        ] : [
          {
            url: '/images/og-tour-default.jpg',
            width: 1200,
            height: 630,
            alt: `${tour.title} - Eco Tour in ${tour.location}`,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: tour.title,
        description: tour.description || `Discover ${tour.title} in ${tour.location}. Book this amazing eco tour experience in Algeria.`,
        images: tour.photoURL ? [tour.photoURL] : ['/images/og-tour-default.jpg'],
        creator: '@algecotour'
      },
      robots: {
        index: true,
        follow: true
      }
    };
  } catch (error) {
    console.error('Error generating tour metadata:', error);
    return {
      title: 'Tour Details - ALG EcoTour',
      description: 'Discover amazing eco tours and experiences across Algeria.'
    };
  }
}
