'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapDisplayProps {
  latitude: number;
  longitude: number;
  title: string;
  geoJsonUrl?: string; // Optional: URL to GeoJSON exported from QGIS
}

export default function MapDisplay({ latitude, longitude, title, geoJsonUrl }: MapDisplayProps) {
  const [mounted, setMounted] = useState(false);
  const [geoJsonData, setGeoJsonData] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Load GeoJSON data if provided (exported from QGIS)
  useEffect(() => {
    if (geoJsonUrl) {
      fetch(geoJsonUrl)
        .then(response => response.json())
        .then(data => setGeoJsonData(data))
        .catch(error => console.error('Error loading GeoJSON:', error));
    }
  }, [geoJsonUrl]);

  if (!mounted) {
    return (
      <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Loading map...</p>
      </div>
    );
  }

  const position: [number, number] = [latitude, longitude];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Tour Location</h3>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
          </svg>
          <span>QGIS Geographic Data</span>
        </div>
      </div>
      
      <div className="rounded-lg overflow-hidden border-2 border-emerald-300 shadow-lg">
        <MapContainer
          center={position}
          zoom={13}
          style={{ height: '400px', width: '100%' }}
          scrollWheelZoom={true}
        >
          {/* Base Layer - OpenStreetMap */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Data: QGIS'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Display GeoJSON layer from QGIS if available */}
          {geoJsonData && (
            <GeoJSON 
              data={geoJsonData}
              style={{
                color: '#10b981',
                weight: 3,
                opacity: 0.7,
              }}
            />
          )}
          
          {/* Tour Location Marker */}
          <Marker position={position}>
            <Popup>
              <div className="text-center">
                <strong className="text-emerald-600">{title}</strong>
                <br />
                <small className="text-gray-600">
                  {latitude.toFixed(6)}, {longitude.toFixed(6)}
                </small>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
      
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-emerald-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <div className="flex-1">
            <p className="text-sm font-semibold text-emerald-800">Geographic Data Source</p>
            <p className="text-xs text-emerald-700 mt-1">
              Coordinates: {latitude.toFixed(6)}°N, {longitude.toFixed(6)}°E
            </p>
            <p className="text-xs text-emerald-600 mt-1">
              Map data processed using QGIS Desktop software
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
