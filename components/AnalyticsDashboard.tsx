'use client';

import { useState, useEffect } from 'react';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30'); // days
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/analytics/dashboard?days=${timeRange}`);
      const data = await response.json();
      if (data.success) {
        setAnalytics(data.data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!analytics) {
    return <div className="p-6">No analytics data available</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-600 mt-1">Track your website performance and user behavior</p>
      </div>

      {/* Time Range Selector */}
      <div className="mb-6 flex gap-2">
        {['7', '30', '90'].map((days) => (
          <button
            key={days}
            onClick={() => setTimeRange(days)}
            className={`px-4 py-2 rounded-lg font-medium ${
              timeRange === days
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Last {days} days
          </button>
        ))}
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b">
        <div className="flex gap-4">
          {['overview', 'behavior', 'traffic', 'tours', 'marketing'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium capitalize ${
                activeTab === tab
                  ? 'border-b-2 border-green-600 text-green-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Total Sessions"
              value={analytics.overview.total_sessions}
              icon="👥"
              trend="+12%"
            />
            <MetricCard
              title="Page Views"
              value={analytics.overview.total_page_views}
              icon="👁️"
              trend="+8%"
            />
            <MetricCard
              title="Unique Users"
              value={analytics.overview.unique_users}
              icon="👤"
              trend="+15%"
            />
            <MetricCard
              title="Active Now"
              value={analytics.activeUsers.active_now}
              icon="🟢"
              isLive
            />
          </div>

          {/* Engagement Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MetricCard
              title="Avg. Session Duration"
              value={`${Math.round(analytics.overview.avg_session_duration / 60)}m ${Math.round(analytics.overview.avg_session_duration % 60)}s`}
              icon="⏱️"
            />
            <MetricCard
              title="Avg. Pages/Session"
              value={parseFloat(analytics.overview.avg_pages_per_session).toFixed(1)}
              icon="📄"
            />
          </div>

          {/* Daily Trends Chart */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Daily Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.dailyTrends.reverse()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="sessions" stroke="#10b981" name="Sessions" />
                <Line type="monotone" dataKey="page_views" stroke="#3b82f6" name="Page Views" />
                <Line type="monotone" dataKey="unique_users" stroke="#f59e0b" name="Unique Users" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Cookie Consent Stats */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Cookie Consent Statistics</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {analytics.consentStats.total_consents}
                </div>
                <div className="text-sm text-gray-600">Total Consents</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {Math.round((analytics.consentStats.analytics_accepted / analytics.consentStats.total_consents) * 100)}%
                </div>
                <div className="text-sm text-gray-600">Analytics Accepted</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {Math.round((analytics.consentStats.marketing_accepted / analytics.consentStats.total_consents) * 100)}%
                </div>
                <div className="text-sm text-gray-600">Marketing Accepted</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Behavior Tab */}
      {activeTab === 'behavior' && (
        <div className="space-y-6">
          {/* Top Pages */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Most Visited Pages</h3>
            <div className="space-y-3">
              {analytics.topPages.map((page: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex-1">
                    <div className="font-medium">{page.page_title || page.page_url}</div>
                    <div className="text-sm text-gray-500">{page.page_url}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-green-600">{page.views} views</div>
                    <div className="text-sm text-gray-500">
                      {Math.round(page.avg_duration / 60)}m avg.
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Events (Clicks) */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Most Clicked Elements</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={analytics.topEvents.slice(0, 10)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="event_label" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="event_count" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Popular Searches */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Popular Search Terms</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {analytics.topSearches.map((search: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <span className="font-medium">{search.search_term}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">{search.search_count} searches</div>
                    <div className="text-xs text-gray-500">{search.avg_results} avg results</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Traffic Tab */}
      {activeTab === 'traffic' && (
        <div className="space-y-6">
          {/* Device Stats */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Device Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.deviceStats}
                  dataKey="sessions"
                  nameKey="device_type"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {analytics.deviceStats.map((_: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Traffic Sources */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Traffic Sources (UTM)</h3>
            <div className="space-y-3">
              {analytics.trafficSources.map((source: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <div className="font-medium">{source.utm_source}</div>
                    <div className="text-sm text-gray-500">
                      {source.utm_medium} {source.utm_campaign && `• ${source.utm_campaign}`}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{source.sessions} sessions</div>
                    <div className="text-sm text-gray-500">
                      {parseFloat(source.avg_pages).toFixed(1)} pages/session
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Geographic Stats */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Geographic Distribution</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {analytics.geoStats.map((geo: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <span className="font-medium">{geo.country}</span>
                    {geo.city && <span className="text-gray-500">, {geo.city}</span>}
                  </div>
                  <div className="font-semibold text-green-600">{geo.sessions}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tours Tab */}
      {activeTab === 'tours' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Most Interested Tours</h3>
            <div className="space-y-3">
              {analytics.topTours.map((tour: any, index: number) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">{tour.title}</h4>
                      <p className="text-sm text-gray-600">{tour.location}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">${tour.price}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-3">
                    <div>
                      <div className="text-sm text-gray-500">Interest Score</div>
                      <div className="font-semibold">{tour.total_interest}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Unique Visitors</div>
                      <div className="font-semibold">{tour.unique_visitors}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Interactions</div>
                      <div className="font-semibold">{tour.total_interactions}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Marketing Tab */}
      {activeTab === 'marketing' && (
        <div className="space-y-6">
          {/* Conversion Funnel */}
          {analytics.conversionFunnel.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Conversion Funnel</h3>
              <div className="space-y-2">
                {analytics.conversionFunnel.map((step: any, index: number) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium capitalize">{step.step}</span>
                      <span className="text-gray-600">
                        {step.sessions} sessions ({step.completion_rate}% complete)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${step.completion_rate}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Campaign Performance - Placeholder */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Email Campaign Performance</h3>
            <p className="text-gray-600">Email campaigns will appear here when created.</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Metric Card Component
function MetricCard({ 
  title, 
  value, 
  icon, 
  trend, 
  isLive 
}: { 
  title: string; 
  value: any; 
  icon: string; 
  trend?: string; 
  isLive?: boolean;
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        {isLive && <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">LIVE</span>}
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="flex items-center justify-between mt-1">
        <div className="text-sm text-gray-600">{title}</div>
        {trend && <div className="text-sm text-green-600 font-medium">{trend}</div>}
      </div>
    </div>
  );
}
