'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Dynamic imports for SSR compatibility
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

// Fix for default marker icon
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
}

interface MapPickerProps {
  onLocationSelect: (location: { lat: number; lng: number; address: string }) => void;
  initialLocation?: { lat: number; lng: number };
}

// Default center: Algeria (Algiers)
const defaultCenter: [number, number] = [36.7538, 3.0588];

function LocationMarker({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [map, setMap] = useState<any>(null);

  useEffect(() => {
    if (map) {
      const handleClick = (e: any) => {
        const { lat, lng } = e.latlng;
        setPosition([lat, lng]);
        onLocationSelect(lat, lng);
      };

      map.on('click', handleClick);

      return () => {
        map.off('click', handleClick);
      };
    }
  }, [map, onLocationSelect]);

  return (
    <>
      {position === null ? null : <Marker position={position} />}
    </>
  );
}

export default function MapPicker({ onLocationSelect, initialLocation }: MapPickerProps) {
  const [markerPosition, setMarkerPosition] = useState<[number, number]>(
    initialLocation ? [initialLocation.lat, initialLocation.lng] : defaultCenter
  );
  const [address, setAddress] = useState('');
  const [mounted, setMounted] = useState(false);
  const hasMounted = useRef(false);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMounted(true);
    }
  }, []);

  // Get address from coordinates using Nominatim (OpenStreetMap geocoding)
  const getAddressFromCoordinates = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      
      if (data.display_name) {
        return data.display_name;
      }
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    } catch (error) {
      console.error('Geocoding error:', error);
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    }
  };

  const handleLocationSelect = async (lat: number, lng: number) => {
    setMarkerPosition([lat, lng]);
    
    // Get address
    const addressText = await getAddressFromCoordinates(lat, lng);
    setAddress(addressText);
    
    onLocationSelect({
      lat,
      lng,
      address: addressText,
    });
  };

  if (!mounted) {
    return (
      <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Loading map...</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-sm text-blue-800">
          📍 Click on map to select tour location
        </p>
      </div>

      <div className="rounded-lg overflow-hidden border-2 border-gray-300">
        <MapContainer
          center={markerPosition}
          zoom={6}
          style={{ height: '400px', width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker onLocationSelect={handleLocationSelect} />
          {markerPosition && <Marker position={markerPosition} />}
        </MapContainer>
      </div>

      {address && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
          <p className="text-sm text-emerald-800">
            <strong>Selected Location:</strong> {address}
          </p>
          <p className="text-xs text-emerald-700 mt-1">
            Coordinates: {markerPosition[0].toFixed(6)}, {markerPosition[1].toFixed(6)}
          </p>
        </div>
      )}
    </div>
  );
}
