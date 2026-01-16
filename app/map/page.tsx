'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { MapPin, Filter, Map, Navigation, X } from 'lucide-react';

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
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);
const GeoJSON = dynamic(
  () => import('react-leaflet').then((mod) => mod.GeoJSON),
  { ssr: false }
);

interface Tour {
  id: number;
  title: string;
  location: string;
  price: number;
  maxParticipants: number;
  latitude: number | null;
  longitude: number | null;
  photoURL?: string | null;
  available?: boolean;
  region?: string;
}

interface FilterState {
  availableOnly: boolean;
  region: string;
  nearUser: boolean;
  userLocation?: { lat: number; lng: number };
}

// Algerian regions for filtering
const algerianRegions = [
  { id: 'all', name: 'All Regions', center: [28.0, 1.6] as [number, number] },
  { id: 'north', name: 'North', center: [36.5, 3.0] as [number, number] },
  { id: 'center', name: 'Center', center: [35.0, 2.5] as [number, number] },
  { id: 'east', name: 'East', center: [33.5, 6.0] as [number, number] },
  { id: 'west', name: 'West', center: [32.0, -1.0] as [number, number] },
  { id: 'south', name: 'South', center: [26.0, 2.0] as [number, number] },
];

// Sample GeoJSON data for demonstration (can be replaced with real data)
const sampleGeoJSON = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        name: "Sahara Desert Region",
        description: "Major desert tourism area"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-5, 20], [10, 20], [10, 30], [-5, 30], [-5, 20]
        ]]
      }
    }
  ]
};

export default function GISMapPage() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [filteredTours, setFilteredTours] = useState<Tour[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    availableOnly: false,
    region: 'all',
    nearUser: false,
  });
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [geoJSONData, setGeoJSONData] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const fetchData = async () => {
      try {
        // Fetch tours
        const toursResponse = await fetch('/api/tours');
        if (toursResponse.ok) {
          const toursData = await toursResponse.json();
          setTours(toursData);
          
          // Add region information based on coordinates
          const toursWithRegion = toursData.map((tour: Tour) => ({
            ...tour,
            region: getRegionFromCoordinates(tour.latitude, tour.longitude)
          }));
          
          setTours(toursWithRegion);
        }

        // Try to load GeoJSON data (optional)
        try {
          const geoResponse = await fetch('/api/geojson');
          if (geoResponse.ok) {
            const geoData = await geoResponse.json();
            setGeoJSONData(geoData);
          }
        } catch (geoError) {
          // Use sample data if no GeoJSON endpoint exists
          setGeoJSONData(sampleGeoJSON);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [mounted]);

  // Get user location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFilters(prev => ({
            ...prev,
            userLocation: {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }
          }));
        },
        (error) => {
          console.error('Geolocation error:', error);
        }
      );
    }
  };

  // Determine region based on coordinates
  const getRegionFromCoordinates = (lat: number | null, lng: number | null): string => {
    if (!lat || !lng) return 'unknown';
    
    if (lat > 34) return 'north';
    if (lat > 30) return 'center';
    if (lng > 4) return 'east';
    if (lng < 0) return 'west';
    return 'south';
  };

  // Apply filters
  useEffect(() => {
    let filtered = [...tours];

    // Available only filter
    if (filters.availableOnly) {
      filtered = filtered.filter(tour => tour.available !== false);
    }

    // Region filter
    if (filters.region !== 'all') {
      filtered = filtered.filter(tour => tour.region === filters.region);
    }

    // Near user filter
    if (filters.nearUser && filters.userLocation) {
      filtered = filtered.filter(tour => {
        if (!tour.latitude || !tour.longitude) return false;
        
        const distance = calculateDistance(
          filters.userLocation!.lat,
          filters.userLocation!.lng,
          tour.latitude,
          tour.longitude
        );
        return distance <= 100; // Within 100km
      });
    }

    setFilteredTours(filtered);
  }, [filters, tours]);

  // Calculate distance between two points
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const toursWithCoordinates = filteredTours.filter(
    (tour) => tour.latitude !== null && tour.longitude !== null
  );

  // Calculate center point for map
  const getMapCenter = (): [number, number] => {
    const selectedRegion = algerianRegions.find(r => r.id === filters.region);
    if (selectedRegion && filters.region !== 'all') {
      return selectedRegion.center;
    }
    
    if (filters.nearUser && filters.userLocation) {
      return [filters.userLocation.lat, filters.userLocation.lng];
    }
    
    if (toursWithCoordinates.length === 0) {
      return [36.7538, 3.0588]; // Default to Algiers
    }
    
    const avgLat = toursWithCoordinates.reduce((sum, tour) => sum + tour.latitude!, 0) / toursWithCoordinates.length;
    const avgLng = toursWithCoordinates.reduce((sum, tour) => sum + tour.longitude!, 0) / toursWithCoordinates.length;
    
    return [avgLat, avgLng];
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading tours...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Map className="h-6 w-6 text-emerald-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">GIS Tour Map</h1>
              <span className="ml-3 text-sm text-gray-500">
                {toursWithCoordinates.length} locations
              </span>
            </div>
            
            {/* Filter Toggle Button */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  showFilters
                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                    : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                }`}
              >
                {showFilters ? <X className="h-4 w-4 mr-2" /> : <Filter className="h-4 w-4 mr-2" />}
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white border-b shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Available Only Filter */}
              <div>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.availableOnly}
                    onChange={(e) => setFilters(prev => ({ ...prev, availableOnly: e.target.checked }))}
                    className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-sm text-gray-700">Available Tours Only</span>
                </label>
              </div>

              {/* Region Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Region
                </label>
                <select
                  value={filters.region}
                  onChange={(e) => setFilters(prev => ({ ...prev, region: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {algerianRegions.map(region => (
                    <option key={region.id} value={region.id}>
                      {region.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Near User Filter */}
              <div>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.nearUser}
                    onChange={(e) => {
                      setFilters(prev => ({ ...prev, nearUser: e.target.checked }));
                      if (e.target.checked && !filters.userLocation) {
                        getUserLocation();
                      }
                    }}
                    className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-sm text-gray-700">Near Me (100km)</span>
                  {filters.nearUser && (
                    <Navigation className="h-4 w-4 text-emerald-600" />
                  )}
                </label>
                {filters.nearUser && filters.userLocation && (
                  <p className="text-xs text-gray-500 mt-1">
                    Location: {filters.userLocation.lat.toFixed(4)}, {filters.userLocation.lng.toFixed(4)}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Map Container */}
      <div className="relative" style={{ height: 'calc(100vh - 4rem)' }}>
        {mounted && (
          <MapContainer
            center={getMapCenter()}
            zoom={6}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* GeoJSON Overlay */}
            {geoJSONData && (
              <GeoJSON
                data={geoJSONData}
                style={{
                  color: '#10b981',
                  weight: 2,
                  opacity: 0.6,
                  fillOpacity: 0.1,
                  fillColor: '#10b981'
                }}
                onEachFeature={(feature, layer) => {
                  if (feature.properties) {
                    layer.bindPopup(`
                      <div class="p-2">
                        <h3 class="font-semibold">${feature.properties.name || 'Region'}</h3>
                        <p class="text-sm text-gray-600">${feature.properties.description || 'Geographic area'}</p>
                      </div>
                    `);
                  }
                }}
              />
            )}
            
            {/* Tour Markers */}
            {toursWithCoordinates.map((tour) => (
              <Marker
                key={tour.id}
                position={[tour.latitude!, tour.longitude!]}
              >
                <Popup>
                  <div className="p-3 min-w-[200px]">
                    <div className="flex items-start space-x-3">
                      {tour.photoURL && (
                        <div 
                          className="w-16 h-16 bg-cover bg-center rounded-lg flex-shrink-0"
                          style={{ backgroundImage: `url(${tour.photoURL})` }}
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-sm mb-1">
                          {tour.title}
                        </h3>
                        <p className="text-xs text-gray-600 mb-2">
                          <MapPin className="inline h-3 w-3 mr-1" />
                          {tour.location}
                        </p>
                        {tour.region && (
                          <p className="text-xs text-blue-600 mb-2">
                            Region: {tour.region}
                          </p>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-emerald-600 font-bold text-sm">
                            ${tour.price}
                          </span>
                          <a
                            href={`/ecoTour/${tour.id}`}
                            className="text-xs bg-emerald-600 text-white px-2 py-1 rounded hover:bg-emerald-700 transition-colors"
                          >
                            View Details
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}
      </div>

      {/* No Tours Message */}
      {toursWithCoordinates.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 bg-opacity-90">
          <div className="text-center">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Tours Found
            </h3>
            <p className="text-gray-600">
              Try adjusting your filters or check back later for new tour destinations.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
