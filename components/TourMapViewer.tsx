'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { MapPin, Route, Clock, Users, DollarSign } from 'lucide-react';

// Import map dynamically to avoid SSR issues
const InteractiveRouteMap = dynamic(() => import('./InteractiveRouteMap'), {
  ssr: false,
  loading: () => <div className="h-[600px] bg-gray-100 animate-pulse rounded-lg" />
});

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

interface RouteTemplate {
  id: number;
  template_name: string;
  template_type: string;
  description: string;
  waypoint_sequence: string[];
  estimated_duration_hours: number;
  difficulty: string;
}

interface Tour {
  id: number;
  title: string;
  description: string;
  location: string;
  latitude: number;
  longitude: number;
  price: number;
  maxParticipants: number;
  duration: number;
  difficulty: string;
}

export default function TourMapViewer() {
  const [tour, setTour] = useState<Tour | null>(null);
  const [routes, setRoutes] = useState<RouteTemplate[]>([]);
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<RouteTemplate | null>(null);
  const [selectedWaypoints, setSelectedWaypoints] = useState<Waypoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTourData();
  }, []);

  useEffect(() => {
    if (selectedRoute && waypoints.length > 0) {
      const routeWaypoints = waypoints.filter(wp => 
        selectedRoute.waypoint_sequence.includes(wp.waypoint_code)
      ).sort((a, b) => 
        selectedRoute.waypoint_sequence.indexOf(a.waypoint_code) - 
        selectedRoute.waypoint_sequence.indexOf(b.waypoint_code)
      );
      setSelectedWaypoints(routeWaypoints);
    }
  }, [selectedRoute, waypoints]);

  const fetchTourData = async () => {
    try {
      console.log('Fetching Jijel tour data...');
      
      // Fetch all tours and find the Jijel one
      const tourRes = await fetch('/api/tours');
      const tourData = await tourRes.json();
      console.log('Tours response:', tourData);
      
      // Handle different response formats
      const toursArray = tourData.tours || tourData || [];
      
      // Look for Jijel tour with flexible matching
      const jijelTour = toursArray.find((t: Tour) => 
        t.title?.toLowerCase().includes('jijel') ||
        t.location?.toLowerCase().includes('jijel')
      );
      
      if (jijelTour) {
        console.log('Found Jijel tour:', jijelTour);
        setTour(jijelTour);
        
        // Fetch routes for this tour
        const routesRes = await fetch(`/api/tours/${jijelTour.id}/routes`);
        const routesData = await routesRes.json();
        console.log('Routes response:', routesData);
        
        setRoutes(routesData.routes || []);
        
        // Set default route (complete tour)
        const completeRoute = routesData.routes?.find((r: RouteTemplate) => r.template_type === 'complete');
        if (completeRoute) {
          console.log('Setting default route:', completeRoute);
          setSelectedRoute(completeRoute);
        }
      } else {
        console.error('No Jijel tour found in response');
        setError('Jijel tour not found. Please ensure the tour data is seeded.');
      }

      // Fetch all waypoints
      const wpRes = await fetch('/api/tours/waypoints');
      const wpData = await wpRes.json();
      console.log('Waypoints response:', wpData);
      setWaypoints(wpData.waypoints || []);
      
    } catch (error) {
      console.error('Error fetching tour data:', error);
      setError('Failed to load tour data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getWaypointIcon = (type: string) => {
    const icons: Record<string, string> = {
      start: '🚀',
      end: '🏁',
      attraction: '🎯',
      belvedere: '👁️',
      rest: '☕',
      service: '🏪',
      info: 'ℹ️'
    };
    return icons[type] || '📍';
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      easy: 'text-green-600 bg-green-50',
      moderate: 'text-yellow-600 bg-yellow-50',
      hard: 'text-red-600 bg-red-50'
    };
    return colors[difficulty] || 'text-gray-600 bg-gray-50';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="h-64 bg-gray-200 animate-pulse rounded-lg mb-6" />
          <div className="h-[600px] bg-gray-200 animate-pulse rounded-lg" />
        </div>
      </div>
    );
  }

  if (error || !tour) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white p-6">
        <div className="max-w-7xl mx-auto text-center py-12">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Tour Not Found</h1>
            <p className="text-gray-600 mb-6">
              {error || 'The Jijel Coastal & Forest Ecotour could not be found.'}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Make sure you've run the seed command:
            </p>
            <code className="bg-gray-100 px-4 py-2 rounded text-sm block mb-6">
              npm run db:seed-jijel-tour
            </code>
            <a
              href="/map"
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Back to Map
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">{tour.title}</h1>
          <p className="text-xl text-green-50 mb-6">{tour.description}</p>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">Location</span>
              </div>
              <p className="font-semibold">{tour.location}</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4" />
                <span className="text-sm">Duration</span>
              </div>
              <p className="font-semibold">{tour.duration}h</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-4 h-4" />
                <span className="text-sm">Max People</span>
              </div>
              <p className="font-semibold">{tour.maxParticipants}</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="w-4 h-4" />
                <span className="text-sm">Price</span>
              </div>
              <p className="font-semibold">{tour.price} DZD</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <Route className="w-4 h-4" />
                <span className="text-sm">Difficulty</span>
              </div>
              <p className="font-semibold capitalize">{tour.difficulty}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Route Selection Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Select Route</h2>
            
            {routes.length === 0 ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">No routes available for this tour.</p>
              </div>
            ) : (
              routes.map((route) => (
                <button
                  key={route.id}
                  onClick={() => setSelectedRoute(route)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    selectedRoute?.id === route.id
                      ? 'border-green-600 bg-green-50 shadow-lg'
                      : 'border-gray-200 bg-white hover:border-green-300 hover:shadow'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{route.template_name}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(route.difficulty)}`}>
                      {route.difficulty}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{route.description}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {route.estimated_duration_hours}h
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {route.waypoint_sequence.length} stops
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Map and Waypoints */}
          <div className="lg:col-span-3 space-y-6">
            {/* Interactive Map */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-4 bg-gray-50 border-b">
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedRoute?.template_name || 'Interactive Route Map'}
                </h2>
                <p className="text-sm text-gray-600">
                  Click on markers to see waypoint details
                </p>
              </div>
              <InteractiveRouteMap
                waypoints={selectedWaypoints}
                center={[tour.latitude, tour.longitude]}
              />
            </div>

            {/* Waypoints Timeline */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Route Timeline</h3>
              
              {selectedWaypoints.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>Select a route to see waypoints</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedWaypoints.map((wp, idx) => (
                    <div key={wp.waypoint_code} className="flex gap-4">
                      {/* Timeline indicator */}
                      <div className="flex flex-col items-center">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                          wp.waypoint_type === 'start' ? 'bg-green-100' :
                          wp.waypoint_type === 'end' ? 'bg-red-100' :
                          'bg-blue-100'
                        }`}>
                          {getWaypointIcon(wp.waypoint_type)}
                        </div>
                        {idx < selectedWaypoints.length - 1 && (
                          <div className="w-0.5 h-full bg-gray-300 my-2" />
                        )}
                      </div>

                      {/* Waypoint details */}
                      <div className="flex-1 pb-8">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-semibold text-gray-900">{wp.name}</h4>
                              <p className="text-sm text-gray-600">{wp.commune}</p>
                            </div>
                            <span className="text-xs bg-white px-3 py-1 rounded-full border">
                              {wp.visit_duration_minutes} min
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 leading-relaxed">{wp.description}</p>
                          <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                            <MapPin className="w-3 h-3" />
                            
                            <span>
  {Number(wp.latitude).toFixed(4)}, {Number(wp.longitude).toFixed(4)}
</span>

                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Summary */}
              {selectedWaypoints.length > 0 && (
                <div className="mt-6 pt-6 border-t grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {selectedWaypoints.length}
                    </p>
                    <p className="text-sm text-gray-600">Waypoints</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {selectedRoute?.estimated_duration_hours || 0}h
                    </p>
                    <p className="text-sm text-gray-600">Total Duration</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {selectedWaypoints.reduce((sum, wp) => sum + wp.visit_duration_minutes, 0)} min
                    </p>
                    <p className="text-sm text-gray-600">Visit Time</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
