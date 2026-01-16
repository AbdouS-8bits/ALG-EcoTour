'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

interface Tour {
  id: number;
  title: string;
  location: string;
  latitude: number | null;
  longitude: number | null;
  price: number;
}

interface TourMapProps {
  tours: Tour[];
  className?: string;
}

export default function TourMap({ tours, className }: TourMapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toursWithCoordinates = tours.filter(
    (tour) => tour.latitude !== null && tour.longitude !== null
  );

  if (!mounted || toursWithCoordinates.length === 0) {
    return (
      <div className={`w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center ${className || ''}`}>
        <p className="text-gray-500">Loading map...</p>
      </div>
    );
  }

  // Calculate center point from all tours
  const avgLat =
    toursWithCoordinates.reduce((sum, tour) => sum + (tour.latitude || 0), 0) /
    toursWithCoordinates.length;
  const avgLng =
    toursWithCoordinates.reduce((sum, tour) => sum + (tour.longitude || 0), 0) /
    toursWithCoordinates.length;

  return (
    <div className={className}>
      <div className="w-full h-96 rounded-lg overflow-hidden border-2 border-emerald-300">
        <MapContainer
          center={[avgLat, avgLng]}
          zoom={6}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {toursWithCoordinates.map((tour) => (
            <Marker
              key={tour.id}
              position={[tour.latitude!, tour.longitude!]}
            >
              <Popup>
                <div className="text-center">
                  <strong className="text-emerald-600">{tour.title}</strong>
                  <br />
                  <small className="text-gray-600">{tour.location}</small>
                  <br />
                  <small className="text-emerald-600 font-semibold">
                    {tour.price.toFixed(2)} DZD
                  </small>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}

