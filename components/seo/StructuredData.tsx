interface Tour {
  id: number;
  title: string;
  description: string | null;
  location: string;
  latitude: number | null;
  longitude: number | null;
  price: number;
  maxParticipants: number;
  photoURL: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface StructuredDataProps {
  tour: Tour;
}

export default function StructuredData({ tour }: StructuredDataProps) {
  // Generate structured data for Tourism/Trip
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://localhost:3000";
  
  // Generate image URLs
  const images = tour.photoURL 
    ? [`${baseUrl}${tour.photoURL}`]
    : [
        `${baseUrl}/images/tours/desert-1.jpg`,
        `${baseUrl}/images/tours/sahara.jpg`,
        `${baseUrl}/images/tours/tassili.jpg`,
        `${baseUrl}/images/tours/mountains.jpg`,
        `${baseUrl}/images/tours/oasis.jpg`
      ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    "name": tour.title,
    "description": tour.description || `Experience ${tour.title} in ${tour.location}, Algeria. An amazing eco tour adventure with sustainable tourism practices.`,
    "provider": {
      "@type": "Organization",
      "name": "ALG EcoTour",
      "url": baseUrl,
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/images/logo.png`
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+213-XXX-XXX-XXX",
        "contactType": "customer service",
        "availableLanguage": ["Arabic", "French", "English"]
      }
    },
    "offers": {
      "@type": "Offer",
      "price": tour.price,
      "priceCurrency": "DZD",
      "availability": "https://schema.org/InStock",
      "validFrom": new Date().toISOString(),
      "priceSpecification": {
        "@type": "UnitPriceSpecification",
        "price": tour.price,
        "priceCurrency": "DZD",
        "unitCode": "DAY"
      },
      "seller": {
        "@type": "Organization",
        "name": "ALG EcoTour"
      }
    },
    "location": {
      "@type": "Place",
      "name": tour.location,
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "DZ",
        "addressLocality": tour.location,
        "addressRegion": tour.location
      },
      "geo": tour.latitude && tour.longitude ? {
        "@type": "GeoCoordinates",
        "latitude": tour.latitude,
        "longitude": tour.longitude
      } : undefined
    },
    "image": images,
    "url": `${baseUrl}/ecoTour/${tour.id}`,
    "duration": "P1D", // 1 day (can be customized based on tour data)
    "maximumAttendeeCapacity": tour.maxParticipants,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.5", // This would come from actual ratings API
      "reviewCount": "12", // This would come from actual reviews API
      "bestRating": "5",
      "worstRating": "1"
    },
    "additionalType": [
      "https://schema.org/EcoTourism",
      "https://schema.org/AdventureTour",
      "https://schema.org/CulturalTour"
    ],
    "inLanguage": ["ar", "fr", "en"],
    "isAccessibleForFree": false,
    "touristType": [
      "CulturalTourism",
      "AdventureTourism",
      "EcoTourism",
      "SustainableTourism"
    ],
    "keywords": `${tour.title}, ${tour.location}, Algeria, eco tour, sustainable tourism, adventure travel, cultural experience, desert tour, mountain tour`,
    "category": "Tourism",
    "subCategory": "EcoTourism",
    "suitableFor": [
      "Adult",
      "Family",
      "Group"
    ],
    "physicalRequirements": "Moderate",
    "season": "All year",
    "bookingURL": `${baseUrl}/ecoTour/${tour.id}`,
    "lastReviewed": new Date().toISOString(),
    "dateModified": tour.updatedAt.toISOString(),
    "datePublished": tour.createdAt.toISOString()
  };

  // Validate required fields
  const validateStructuredData = (data: any) => {
    const errors: string[] = [];
    
    // Required fields validation
    if (!data.name || typeof data.name !== 'string' || data.name.trim().length < 3) {
      errors.push('Tour name must be at least 3 characters long');
    }
    
    if (!data.description || typeof data.description !== 'string' || data.description.trim().length < 10) {
      errors.push('Tour description must be at least 10 characters long');
    }
    
    if (!data.location?.name || typeof data.location.name !== 'string' || data.location.name.trim().length < 2) {
      errors.push('Location name must be at least 2 characters long');
    }
    
    if (!data.offers?.price || typeof data.offers.price !== 'number' || data.offers.price <= 0) {
      errors.push('Price must be a positive number');
    }
    
    if (!data.image || !Array.isArray(data.image) || data.image.length === 0) {
      errors.push('At least one image is required');
    }
    
    if (!data.url || typeof data.url !== 'string' || data.url.trim().length < 10) {
      errors.push('Valid tour URL is required');
    }
    
    if (!data.maximumAttendeeCapacity || typeof data.maximumAttendeeCapacity !== 'number' || data.maximumAttendeeCapacity <= 0) {
      errors.push('Maximum attendee capacity must be a positive number');
    }
    
    // Optional fields validation
    if (data.location?.geo) {
      if (typeof data.location.geo.latitude !== 'number' || 
          typeof data.location.geo.longitude !== 'number' ||
          data.location.geo.latitude < -90 || data.location.geo.latitude > 90 ||
          data.location.geo.longitude < -180 || data.location.geo.longitude > 180) {
        errors.push('Invalid geographic coordinates');
      }
    }
    
    // Image URL validation
    if (data.image) {
      data.image.forEach((img: string, index: number) => {
        if (!img || typeof img !== 'string' || !img.startsWith('http')) {
          errors.push(`Image ${index + 1} must be a valid URL`);
        }
      });
    }
    
    return errors;
  };

  const validationErrors = validateStructuredData(structuredData);

  // Log validation errors in development
  if (process.env.NODE_ENV === 'development' && validationErrors.length > 0) {
    console.warn('Structured data validation errors:', validationErrors);
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 2)
      }}
    />
  );
}
