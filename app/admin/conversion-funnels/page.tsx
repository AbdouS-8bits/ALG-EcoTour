'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { AlertCircle, TrendingDown } from 'lucide-react';

interface FunnelStep {
  step: string;
  step_order: number;
  count: number;
  completed_count: number;
  completion_rate: number;
  dropoff_count: number;
  dropoff_rate: number;
}

interface FunnelData {
  steps: FunnelStep[];
  total_started: number;
  total_completed: number;
  overall_completion_rate: number;
}

export default function AdminConversionFunnelsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [funnelData, setFunnelData] = useState<FunnelData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<string>('7');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
      return;
    }
    if (status === 'authenticated' && session?.user?.role !== 'admin') {
      router.push('/');
      return;
    }
    fetchFunnelData();
  }, [status, session, router, timeRange]);

  const fetchFunnelData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/admin/conversion-funnels?days=${timeRange}`);
      if (!response.ok) throw new Error('Failed to fetch funnel data');
      const data = await response.json();
      setFunnelData(data);
    } catch (error) {
      console.error('Error fetching funnel data:', error);
      setError('Failed to load funnel data');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Conversion Funnels</h1>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="1">Last 24 Hours</option>
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
              <option value="0">All Time</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchFunnelData}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        ) : funnelData ? (
          <div className="space-y-6">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="text-sm text-gray-600 mb-2">Total Started</div>
                <p className="text-3xl font-bold text-gray-900">{funnelData.total_started}</p>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="text-sm text-gray-600 mb-2">Total Completed</div>
                <p className="text-3xl font-bold text-green-600">{funnelData.total_completed}</p>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="text-sm text-gray-600 mb-2">Overall Completion Rate</div>
                <p className="text-3xl font-bold text-blue-600">{(funnelData.overall_completion_rate * 100).toFixed(1)}%</p>
              </div>
            </div>

            {/* Funnel Visualization */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-8">Conversion Funnel</h2>
              
              <div className="space-y-6">
                {funnelData.steps.map((step, index) => {
                  const maxWidth = 100;
                  const width = (step.count / funnelData.total_started) * maxWidth;
                  
                  return (
                    <div key={step.step_order} className="space-y-2">
                      {/* Step Header */}
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900 capitalize">
                            {step.step_order}. {step.step.replace(/_/g, ' ')}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {step.count.toLocaleString()} users ({(step.completion_rate * 100).toFixed(1)}% completion rate)
                          </p>
                        </div>
                        {index > 0 && (
                          <div className="text-right">
                            <p className="text-sm font-semibold text-red-600">
                              ↓ {step.dropoff_count.toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-500">
                              {(step.dropoff_rate * 100).toFixed(1)}% drop
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Bar */}
                      <div className="w-full bg-gray-200 rounded-full h-8 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-green-500 to-green-600 h-full rounded-full flex items-center justify-center text-white text-sm font-semibold transition-all"
                          style={{ width: `${width}%` }}
                        >
                          {width > 15 && `${(width).toFixed(0)}%`}
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-4 text-xs text-gray-600 mt-2">
                        <div>Entered: <span className="font-semibold text-gray-900">{step.count.toLocaleString()}</span></div>
                        <div>Completed: <span className="font-semibold text-green-600">{step.completed_count.toLocaleString()}</span></div>
                        <div>Dropped: <span className="font-semibold text-red-600">{step.dropoff_count.toLocaleString()}</span></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Insights */}
            {funnelData.steps.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-semibold text-blue-900 mb-4 flex items-center gap-2">
                  <TrendingDown className="w-5 h-5" />
                  Conversion Insights
                </h3>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li>• Your overall conversion rate is {(funnelData.overall_completion_rate * 100).toFixed(1)}%</li>
                  <li>• Most users drop off at the <strong>{funnelData.steps.reduce((prev, curr) => 
                    curr.dropoff_rate > prev.dropoff_rate ? curr : prev
                  ).step.replace(/_/g, ' ')}</strong> step</li>
                  <li>• {funnelData.total_completed.toLocaleString()} out of {funnelData.total_started.toLocaleString()} users completed the funnel</li>
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No funnel data available</h3>
            <p className="text-gray-500">Data will appear once users start interacting with your site</p>
          </div>
        )}
      </div>
    </div>
  );
}
