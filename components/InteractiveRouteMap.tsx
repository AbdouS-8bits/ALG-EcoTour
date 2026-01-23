'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Waypoint {
  waypoint_code: string;
  name: string;
  waypoint_type: string;
  latitude: number;
  longitude: number;
  commune: string;
  description: string;
  visit_duration_minutes: number;
}

interface Props {
  waypoints: Waypoint[];
  center: [number, number];
}

export default function InteractiveRouteMap({ waypoints, center }: Props) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [selectedWaypoint, setSelectedWaypoint] = useState<Waypoint | null>(null);

  // Custom marker icons
  const getMarkerIcon = (type: string, isSelected: boolean = false) => {
    const colors: Record<string, string> = {
      start: '#10b981', // green
      end: '#ef4444',   // red
      attraction: '#f59e0b', // amber
      belvedere: '#8b5cf6', // purple
      rest: '#3b82f6',  // blue
      service: '#ec4899', // pink
      info: '#06b6d4'   // cyan
    };
    
    const color = colors[type] || '#6b7280';
    const size = isSelected ? 16 : 12;
    
    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          width: ${size * 2}px;
          height: ${size * 2}px;
          background: ${color};
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          ${isSelected ? 'transform: scale(1.2);' : ''}
        ">
          <div style="
            width: ${size}px;
            height: ${size}px;
            background: white;
            border-radius: 50%;
          "></div>
        </div>
      `,
      iconSize: [size * 2, size * 2],
      iconAnchor: [size, size],
    });
  };

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Initialize map
    const map = L.map(mapContainerRef.current, {
      center: center,
      zoom: 10,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    mapRef.current = map;

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(map);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [center]);

  useEffect(() => {
    if (!mapRef.current || waypoints.length === 0) return;

    const map = mapRef.current;

    // Clear existing layers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Polyline) {
        map.removeLayer(layer);
      }
    });

    // Add markers for each waypoint
    const markers: L.Marker[] = [];
    const coordinates: [number, number][] = [];

    waypoints.forEach((wp, idx) => {
      const isSelected = selectedWaypoint?.waypoint_code === wp.waypoint_code;
      const marker = L.marker([wp.latitude, wp.longitude], {
        icon: getMarkerIcon(wp.waypoint_type, isSelected),
        title: wp.name,
      }).addTo(map);

      // Create popup content
      const popupContent = `
        <div style="min-width: 200px;">
          <h3 style="font-weight: bold; margin-bottom: 8px; color: #1f2937;">
            ${idx + 1}. ${wp.name}
          </h3>
          <p style="color: #6b7280; font-size: 0.875rem; margin-bottom: 8px;">
            ${wp.commune}
          </p>
          <p style="color: #374151; font-size: 0.875rem; line-height: 1.4; margin-bottom: 8px;">
            ${wp.description}
          </p>
          <div style="display: flex; gap: 8px; font-size: 0.75rem; color: #6b7280;">
            <span>⏱️ ${wp.visit_duration_minutes} min</span>
            <span>📍 ${wp.waypoint_type}</span>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, {
        maxWidth: 300,
      });

      marker.on('click', () => {
        setSelectedWaypoint(wp);
      });

      markers.push(marker);
      coordinates.push([wp.latitude, wp.longitude]);
    });

    // Draw route line connecting waypoints
    if (coordinates.length > 1) {
      const routeLine = L.polyline(coordinates, {
        color: '#10b981',
        weight: 4,
        opacity: 0.7,
        smoothFactor: 1,
      }).addTo(map);

      // Add distance markers every few waypoints
      for (let i = 0; i < coordinates.length - 1; i++) {
  const [lat1, lng1] = coordinates[i].map(Number);
  const [lat2, lng2] = coordinates[i + 1].map(Number);

  if (isNaN(lat1) || isNaN(lng1) || isNaN(lat2) || isNaN(lng2)) {
    console.warn("Skipping invalid coordinate pair:", coordinates[i], coordinates[i + 1]);
    continue; // skip this segment
  }

  const midpoint: [number, number] = [
    (lat1 + lat2) / 2,
    (lng1 + lng2) / 2
  ];

  const distance = map.distance([lat1, lng1], [lat2, lng2]);
  const distanceKm = (distance / 1000).toFixed(1);

        L.marker(midpoint, {
          icon: L.divIcon({
            className: 'distance-marker',
            html: `
              <div style="
                background: white;
                padding: 2px 8px;
                border-radius: 12px;
                font-size: 0.75rem;
                font-weight: 600;
                color: #10b981;
                border: 2px solid #10b981;
                white-space: nowrap;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              ">
                ${distanceKm} km
              </div>
            `,
            iconSize: [60, 20],
            iconAnchor: [30, 10],
          }),
        }).addTo(map);
      }

      // Fit map to show all waypoints
      map.fitBounds(routeLine.getBounds(), { padding: [50, 50] });
    }

  }, [waypoints, selectedWaypoint]);

  return (
    <div className="relative">
      <div ref={mapContainerRef} className="h-[600px] w-full rounded-b-lg" />
      
      {/* Map controls overlay */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 space-y-2 z-[1000]">
        <div className="text-xs font-semibold text-gray-900">Map Legend</div>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Start</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>End</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <span>Attraction</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
            <span>Viewpoint</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span>Rest Stop</span>
          </div>
        </div>
      </div>

      {/* Selected waypoint info */}
      {selectedWaypoint && (
        <div className="absolute bottom-4 left-4 right-4 bg-white rounded-lg shadow-xl p-4 z-[1000] max-w-md">
          <button
            onClick={() => setSelectedWaypoint(null)}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
          <h4 className="font-bold text-gray-900 mb-1">{selectedWaypoint.name}</h4>
          <p className="text-sm text-gray-600 mb-2">{selectedWaypoint.commune}</p>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            {selectedWaypoint.description}
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>⏱️ {selectedWaypoint.visit_duration_minutes} minutes</span>
            <span>📍 {selectedWaypoint.waypoint_type}</span>
          </div>
        </div>
      )}
    </div>
  );
}
