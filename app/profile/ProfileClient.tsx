'use client';
import { useState } from 'react';
import { User, Mail, Phone, Camera, Save, AlertCircle, Check } from 'lucide-react';
import { UserProfile } from '@/lib/user';
import { useToast } from '@/components/bookings/Toast';

interface ProfileClientProps {
  userProfile: UserProfile;
}

export default function ProfileClient({ userProfile }: ProfileClientProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: userProfile.name || '',
    email: userProfile.email,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { showToast } = useToast();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length > 100) {
      newErrors.name = 'Name must be less than 100 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update profile');
      }

      const updatedProfile = await response.json();
      
      // Update local state
      setFormData({
        name: updatedProfile.name || '',
        email: updatedProfile.email,
      });

      showToast({
        type: 'success',
        title: 'Profile updated',
        message: 'Your profile has been successfully updated'
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update profile';
      
      showToast({
        type: 'error',
        title: 'Update failed',
        message: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: 'name' | 'email', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="flex items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center text-white text-3xl font-bold">
                {formData.name ? formData.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors">
                <Camera className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            
            {/* Info */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{formData.name || 'User'}</h1>
              <p className="text-gray-600">{formData.email}</p>
              <p className="text-sm text-gray-500 mt-1">
                Member since {new Date(userProfile.createdAt).toLocaleDateString('en-US', { 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">معلوماتي الشخصية</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                الاسم الكامل
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-4 py-3 text-gray-900 bg-white border-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter your full name"
              />
              {errors.name && (
                <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.name}
                </div>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                البريد الإلكتروني
              </label>
              <input
                type="email"
                value={formData.email}
                disabled
                className="w-full px-4 py-3 text-gray-500 bg-gray-100 border-2 border-gray-300 rounded-lg cursor-not-allowed"
              />
              <p className="text-sm text-gray-500 mt-2">Email cannot be changed</p>
            </div>

            {/* Success Message */}
            {Object.keys(errors).length === 0 && !loading && (
              <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg">
                <Check className="w-5 h-5 text-green-600" />
                <p className="text-green-800 text-sm">Your profile is up to date</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white font-semibold rounded-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              {loading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
            </button>
          </form>
        </div>

        {/* Additional Info */}
        <div className="bg-white rounded-xl shadow-lg p-8 mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Account Type</span>
              <span className="font-medium text-gray-900 capitalize">{userProfile.role}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Member Since</span>
              <span className="font-medium text-gray-900">
                {new Date(userProfile.createdAt).toLocaleDateString('en-US', { 
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Last Updated</span>
              <span className="font-medium text-gray-900">
                {new Date(userProfile.updatedAt).toLocaleDateString('en-US', { 
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
