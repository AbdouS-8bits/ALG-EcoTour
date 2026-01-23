'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Send, Users, Eye, Target, X, PlayCircle } from 'lucide-react';

interface Campaign {
  id: number;
  name: string;
  subject: string;
  status: string;
  sent?: number;
  opens?: number;
  clicks?: number;
  conversions?: number;
}

interface Segment {
  id?: string;
  name: string;
  count: number;
  criteria?: string;
  description?: string;
  engagement: 'high' | 'medium' | 'low';
}

export default function EmailMarketingDashboard() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showCreateCampaign, setShowCreateCampaign] = useState(false);
  
  const [campaignForm, setCampaignForm] = useState({
    name: '',
    subject: '',
    template: 'tour_recommendation',
    segment: 'all',
    scheduledFor: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [campaignsRes, segmentsRes] = await Promise.all([
        fetch('/api/marketing/campaigns'),
        fetch('/api/marketing/segments')
      ]);
      
      const campaignsData = await campaignsRes.json();
      const segmentsData = await segmentsRes.json();
      
      setCampaigns(campaignsData.campaigns || []);
      setSegments(segmentsData.segments || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCampaign = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!campaignForm.name || !campaignForm.subject) {
      alert('Please fill in campaign name and subject');
      return;
    }
    
    try {
      const response = await fetch('/api/marketing/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(campaignForm)
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message || 'Campaign created successfully!');
        setShowCreateCampaign(false);
        fetchData();
        setCampaignForm({
          name: '',
          subject: '',
          template: 'tour_recommendation',
          segment: 'all',
          scheduledFor: ''
        });
      } else {
        alert(data.error || 'Failed to create campaign');
      }
    } catch (error) {
      console.error('Error creating campaign:', error);
      alert('Failed to create campaign');
    }
  };

  const handleSendCampaign = async (campaignId: number) => {
    if (!confirm('Are you sure you want to send this campaign? This action cannot be undone.')) {
      return;
    }

    try {
      setSending(campaignId);
      const response = await fetch(`/api/marketing/campaigns/${campaignId}/send`, {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message || 'Campaign sent successfully!');
        fetchData();
      } else {
        alert(data.error || 'Failed to send campaign');
      }
    } catch (error) {
      console.error('Error sending campaign:', error);
      alert('Failed to send campaign');
    } finally {
      setSending(null);
    }
  };

  const emailTemplates = [
    { id: 'tour_recommendation', name: 'Tour Recommendations', description: 'Based on user interests' },
    { id: 'abandoned_cart', name: 'Abandoned Cart', description: 'For users who didn\'t complete booking' },
    { id: 'engagement', name: 'Re-engagement', description: 'For inactive users' },
    { id: 'welcome', name: 'Welcome Series', description: 'For new users' },
    { id: 'seasonal', name: 'Seasonal Offers', description: 'Promote seasonal tours' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  const totalCampaigns = campaigns.length;
  const sentCampaigns = campaigns.filter(c => c.status === 'sent').length;
  const totalSent = campaigns.reduce((sum, c) => sum + (c.sent || 0), 0);
  const totalOpens = campaigns.reduce((sum, c) => sum + (c.opens || 0), 0);
  const avgOpenRate = totalSent > 0 ? ((totalOpens / totalSent) * 100).toFixed(1) : '0.0';

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Email Marketing</h1>
        <p className="text-gray-600 mt-1">Behavior-driven email campaigns</p>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b">
        <div className="flex gap-4">
          {['overview', 'campaigns', 'segments', 'templates'].map((tab) => (
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between mb-2">
                <Mail className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-2xl font-bold">{segments.reduce((sum, s) => sum + s.count, 0)}</div>
              <div className="text-sm text-gray-600">Total Users</div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between mb-2">
                <Send className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-2xl font-bold">{totalCampaigns}</div>
              <div className="text-sm text-gray-600">Total Campaigns</div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between mb-2">
                <Eye className="w-8 h-8 text-purple-600" />
              </div>
              <div className="text-2xl font-bold">{avgOpenRate}%</div>
              <div className="text-sm text-gray-600">Avg. Open Rate</div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between mb-2">
                <Target className="w-8 h-8 text-orange-600" />
              </div>
              <div className="text-2xl font-bold">{sentCampaigns}</div>
              <div className="text-sm text-gray-600">Campaigns Sent</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => setShowCreateCampaign(true)}
                className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-600 hover:bg-green-50 transition-colors"
              >
                <Send className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <div className="font-medium">Create New Campaign</div>
                <div className="text-sm text-gray-500">Send targeted emails to users</div>
              </button>
              
              <button 
                onClick={() => setActiveTab('segments')}
                className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-colors"
              >
                <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <div className="font-medium">View Segments</div>
                <div className="text-sm text-gray-500">See behavior-based user groups</div>
              </button>
            </div>
          </div>

          {/* Available Segments Preview */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Behavior-Based Segments</h3>
              <button
                onClick={() => setActiveTab('segments')}
                className="text-sm text-green-600 hover:text-green-700 font-medium"
              >
                View All →
              </button>
            </div>
            <div className="space-y-3">
              {segments.slice(0, 4).map((segment, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">{segment.name}</div>
                    <div className="text-sm text-gray-500">{segment.description || segment.criteria}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-green-600">{segment.count}</div>
                    <div className="text-xs text-gray-500">users</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Campaigns */}
          {campaigns.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Recent Campaigns</h3>
                <button
                  onClick={() => setActiveTab('campaigns')}
                  className="text-sm text-green-600 hover:text-green-700 font-medium"
                >
                  View All →
                </button>
              </div>
              <div className="space-y-3">
                {campaigns.slice(0, 3).map((campaign) => (
                  <div key={campaign.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">{campaign.name}</div>
                      <div className="text-sm text-gray-500">{campaign.subject}</div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      campaign.status === 'sent' ? 'bg-green-100 text-green-800' :
                      campaign.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {campaign.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Campaigns Tab */}
      {activeTab === 'campaigns' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Email Campaigns</h2>
            <button
              onClick={() => setShowCreateCampaign(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Create Campaign
            </button>
          </div>

          {campaigns.length === 0 ? (
            <div className="bg-white p-12 rounded-lg shadow text-center">
              <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No campaigns yet</h3>
              <p className="text-gray-600 mb-4">Create your first email campaign to engage users</p>
              <button
                onClick={() => setShowCreateCampaign(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Create Campaign
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {campaigns.map((campaign) => (
                <div key={campaign.id} className="bg-white p-6 rounded-lg shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{campaign.name}</h3>
                      <p className="text-sm text-gray-500">{campaign.subject}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        campaign.status === 'sent' ? 'bg-green-100 text-green-800' :
                        campaign.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {campaign.status}
                      </span>
                      {campaign.status === 'draft' && (
                        <button
                          onClick={() => handleSendCampaign(campaign.id)}
                          disabled={sending === campaign.id}
                          className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {sending === campaign.id ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              Sending...
                            </>
                          ) : (
                            <>
                              <PlayCircle className="w-4 h-4" />
                              Send Now
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{campaign.sent || 0}</div>
                      <div className="text-xs text-gray-500">Sent</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{campaign.opens || 0}</div>
                      <div className="text-xs text-gray-500">Opens</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">{campaign.clicks || 0}</div>
                      <div className="text-xs text-gray-500">Clicks</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600">{campaign.conversions || 0}</div>
                      <div className="text-xs text-gray-500">Conversions</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Segments Tab */}
      {activeTab === 'segments' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">User Segments</h2>
            <div className="text-sm text-gray-600">
              Total Users: <span className="font-semibold">{segments.reduce((sum, s) => sum + s.count, 0)}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {segments.map((segment, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-lg">{segment.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    segment.engagement === 'high' ? 'bg-green-100 text-green-800' :
                    segment.engagement === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {segment.engagement} engagement
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-4">{segment.description || segment.criteria}</p>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-2xl font-bold text-green-600">{segment.count}</span>
                    <span className="text-sm text-gray-500 ml-2">users</span>
                  </div>
                  <button 
                    onClick={() => {
                      setCampaignForm({...campaignForm, segment: segment.id || 'all'});
                      setShowCreateCampaign(true);
                    }}
                    className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                  >
                    Create Campaign
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Email Templates</h2>
            <div className="text-sm text-gray-600">
              {emailTemplates.length} templates available
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {emailTemplates.map((template) => (
              <div key={template.id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{template.name}</h3>
                    <p className="text-sm text-gray-600">{template.description}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm text-gray-500">
                    <strong>Best for:</strong>
                    {template.id === 'tour_recommendation' && ' Personalized tour suggestions based on user behavior'}
                    {template.id === 'abandoned_cart' && ' Re-engaging users who started but didn\'t complete booking'}
                    {template.id === 'engagement' && ' Bringing back inactive users with new offerings'}
                    {template.id === 'welcome' && ' Onboarding new users to the platform'}
                    {template.id === 'seasonal' && ' Promoting time-sensitive seasonal tours'}
                  </div>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <button 
                    onClick={() => {
                      setCampaignForm({...campaignForm, template: template.id});
                      setShowCreateCampaign(true);
                    }}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                  >
                    Use Template
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Campaign Modal */}
      {showCreateCampaign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Create Email Campaign</h2>
              <button
                onClick={() => setShowCreateCampaign(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Campaign Name *
                </label>
                <input
                  type="text"
                  value={campaignForm.name}
                  onChange={(e) => setCampaignForm({...campaignForm, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., Summer Adventure Tours 2026"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Subject *
                </label>
                <input
                  type="text"
                  value={campaignForm.subject}
                  onChange={(e) => setCampaignForm({...campaignForm, subject: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., Discover Amazing Summer Adventures!"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Template
                </label>
                <select
                  value={campaignForm.template}
                  onChange={(e) => setCampaignForm({...campaignForm, template: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {emailTemplates.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name} - {template.description}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Segment
                </label>
                <select
                  value={campaignForm.segment}
                  onChange={(e) => setCampaignForm({...campaignForm, segment: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {segments.map((segment) => (
                    <option key={segment.id || segment.name} value={segment.id || 'all'}>
                      {segment.name} ({segment.count} users)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Schedule (Optional)
                </label>
                <input
                  type="datetime-local"
                  value={campaignForm.scheduledFor}
                  onChange={(e) => setCampaignForm({...campaignForm, scheduledFor: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <p className="text-sm text-gray-500 mt-1">Leave empty to create as draft</p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowCreateCampaign(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateCampaign}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Create Campaign
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
