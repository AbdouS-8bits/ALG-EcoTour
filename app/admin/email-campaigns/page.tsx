'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Plus, Eye, Trash2, CheckCircle, AlertCircle, Mail, BarChart3, X } from 'lucide-react';

interface EmailCampaign {
  id: number;
  campaign_name: string;
  campaign_type: string | null;
  subject: string | null;
  sent_count: number;
  opened_count: number;
  clicked_count: number;
  converted_count: number;
  created_at: string;
  sent_at: string | null;
}

export default function AdminEmailCampaignsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<EmailCampaign | null>(null);
  const [showStats, setShowStats] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [formData, setFormData] = useState({
    campaign_name: '',
    campaign_type: 'promotional',
    subject: '',
    content: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
      return;
    }
    if (status === 'authenticated' && session?.user?.role !== 'admin') {
      router.push('/');
      return;
    }
    fetchCampaigns();
  }, [status, session, router]);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/admin/email-campaigns');
      if (!response.ok) throw new Error('Failed to fetch campaigns');
      const data = await response.json();
      setCampaigns(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      setError('Failed to load campaigns');
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setActionLoading('submit');
      const response = await fetch('/api/admin/email-campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to create campaign');

      const newCampaign = await response.json();
      setCampaigns([...campaigns, newCampaign]);

      setMessage({ type: 'success', text: 'Campaign created successfully' });
      resetForm();
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: (error as Error).message });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete campaign "${name}"?`)) return;

    try {
      setActionLoading(`delete-${id}`);
      const response = await fetch(`/api/admin/email-campaigns/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete campaign');

      setCampaigns(campaigns.filter(c => c.id !== id));
      setMessage({ type: 'success', text: 'Campaign deleted successfully' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: (error as Error).message });
    } finally {
      setActionLoading(null);
    }
  };

  const resetForm = () => {
    setFormData({ campaign_name: '', campaign_type: 'promotional', subject: '', content: '' });
    setShowForm(false);
  };

  const calculateOpenRate = (campaign: EmailCampaign) => {
    if (campaign.sent_count === 0) return 0;
    return ((campaign.opened_count / campaign.sent_count) * 100).toFixed(1);
  };

  const calculateClickRate = (campaign: EmailCampaign) => {
    if (campaign.sent_count === 0) return 0;
    return ((campaign.clicked_count / campaign.sent_count) * 100).toFixed(1);
  };

  const calculateConversionRate = (campaign: EmailCampaign) => {
    if (campaign.sent_count === 0) return 0;
    return ((campaign.converted_count / campaign.sent_count) * 100).toFixed(1);
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
            <h1 className="text-2xl font-bold text-gray-900">Email Campaigns</h1>
            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Plus className="w-4 h-4" />
              New Campaign
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      {message.text && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className={`p-4 rounded-lg flex items-center ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 mr-2" />
            ) : (
              <AlertCircle className="w-5 h-5 mr-2" />
            )}
            {message.text}
          </div>
        </div>
      )}

      {/* Campaigns List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchCampaigns}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No campaigns found</h3>
            <p className="text-gray-500 mb-4">Create your first email campaign</p>
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Create Campaign
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{campaign.campaign_name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{campaign.subject}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setSelectedCampaign(campaign);
                        setShowStats(true);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <BarChart3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(campaign.id, campaign.campaign_name)}
                      disabled={actionLoading === `delete-${campaign.id}`}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Sent</p>
                      <p className="text-2xl font-bold text-gray-900">{campaign.sent_count}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Opened</p>
                      <p className="text-2xl font-bold text-blue-600">{campaign.opened_count}</p>
                      <p className="text-xs text-gray-500 mt-1">{calculateOpenRate(campaign)}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Clicked</p>
                      <p className="text-2xl font-bold text-green-600">{campaign.clicked_count}</p>
                      <p className="text-xs text-gray-500 mt-1">{calculateClickRate(campaign)}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Converted</p>
                      <p className="text-2xl font-bold text-orange-600">{campaign.converted_count}</p>
                      <p className="text-xs text-gray-500 mt-1">{calculateConversionRate(campaign)}%</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-xs text-gray-500">
                  Created: {new Date(campaign.created_at).toLocaleDateString()}
                  {campaign.sent_at && ` | Sent: ${new Date(campaign.sent_at).toLocaleDateString()}`}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Create Email Campaign</h2>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Campaign Name *
                  </label>
                  <input
                    type="text"
                    name="campaign_name"
                    value={formData.campaign_name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., Winter Sale 2024"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Campaign Type
                    </label>
                    <select
                      name="campaign_type"
                      value={formData.campaign_type}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="promotional">Promotional</option>
                      <option value="newsletter">Newsletter</option>
                      <option value="announcement">Announcement</option>
                      <option value="reminder">Reminder</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Subject line..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Content *
                  </label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    required
                    rows={8}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Email content..."
                  />
                </div>

                <div className="flex justify-end space-x-4 pt-4 border-t">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading === 'submit' || !formData.campaign_name || !formData.subject || !formData.content}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    {actionLoading === 'submit' ? 'Creating...' : 'Create Campaign'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Stats Modal */}
      {showStats && selectedCampaign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Campaign Statistics</h2>
                <button
                  onClick={() => setShowStats(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">{selectedCampaign.campaign_name}</h3>
                  <p className="text-sm text-gray-600">{selectedCampaign.subject}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">Sent</p>
                    <p className="text-3xl font-bold text-blue-600">{selectedCampaign.sent_count}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">Opened</p>
                    <p className="text-3xl font-bold text-green-600">{selectedCampaign.opened_count}</p>
                    <p className="text-xs text-gray-500 mt-2">Open Rate: {calculateOpenRate(selectedCampaign)}%</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">Clicked</p>
                    <p className="text-3xl font-bold text-purple-600">{selectedCampaign.clicked_count}</p>
                    <p className="text-xs text-gray-500 mt-2">Click Rate: {calculateClickRate(selectedCampaign)}%</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">Converted</p>
                    <p className="text-3xl font-bold text-orange-600">{selectedCampaign.converted_count}</p>
                    <p className="text-xs text-gray-500 mt-2">Conversion Rate: {calculateConversionRate(selectedCampaign)}%</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm text-gray-500">
                    Created: {new Date(selectedCampaign.created_at).toLocaleString()}
                    {selectedCampaign.sent_at && ` | Sent: ${new Date(selectedCampaign.sent_at).toLocaleString()}`}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowStats(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
