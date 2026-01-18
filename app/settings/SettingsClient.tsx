'use client';
import { useState } from 'react';
import { Bell, Globe, Moon, Sun, Shield, Lock, Save, Check } from 'lucide-react';
import { UserSettings } from '@/lib/settings';
import { useToast } from '@/components/bookings/Toast';

interface SettingsClientProps {
  userSettings: UserSettings;
}

export default function SettingsClient({ userSettings }: SettingsClientProps) {
  const [settings, setSettings] = useState<UserSettings>(userSettings);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const { showToast } = useToast();

  // Initialize dark mode from settings
  useState(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
      setDarkMode(true);
    }
  });

  const handleSettingChange = (key: keyof UserSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleDarkModeToggle = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    handleSettingChange('darkMode', newDarkMode);
    
    // Apply dark mode immediately
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleSave = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/user/settings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          language: settings.language,
          emailNotifications: settings.emailNotifications,
          darkMode: settings.darkMode,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update settings');
      }

      const updatedSettings = await response.json();
      setSettings(updatedSettings);

      showToast({
        type: 'success',
        title: 'Settings saved',
        message: 'Your preferences have been updated successfully'
      });
    } catch (error) {
      console.error('Error updating settings:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update settings';
      
      showToast({
        type: 'error',
        title: 'Update failed',
        message: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  const languageOptions = [
    { value: 'ar', label: 'العربية', flag: '🇩🇿' },
    { value: 'fr', label: 'Français', flag: '🇫🇷' },
    { value: 'en', label: 'English', flag: '🇬🇧' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">الإعدادات</h1>

        <div className="space-y-6">
          {/* Language Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Language / اللغة
            </h3>
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {languageOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleSettingChange('language', option.value)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      settings.language === option.value
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                    }`}
                  >
                    <div className="text-2xl mb-2">{option.flag}</div>
                    <div className="font-medium text-gray-900 dark:text-white">{option.label}</div>
                    {settings.language === option.value && (
                      <div className="mt-2 text-green-600 dark:text-green-400 text-sm flex items-center justify-center gap-1">
                        <Check className="w-4 h-4" />
                        Selected
                      </div>
                    )}
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
                Choose your preferred language for the interface
              </p>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notifications / الإشعارات
            </h3>
            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Email Notifications</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Receive booking confirmations and updates via email</div>
                </div>
                <button
                  onClick={() => handleSettingChange('emailNotifications', !settings.emailNotifications)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.emailNotifications ? 'bg-green-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </label>
            </div>
          </div>

          {/* Appearance Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              {darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              Appearance / المظهر
            </h3>
            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Dark Mode</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Toggle dark theme for better viewing in low light</div>
                </div>
                <button
                  onClick={handleDarkModeToggle}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    darkMode ? 'bg-green-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      darkMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </label>
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Security / الأمان
            </h3>
            <div className="space-y-3">
              <button className="w-full py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors flex items-center justify-center gap-2">
                <Lock className="w-5 h-5" />
                Change Password / تغيير كلمة المرور
              </button>
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                Password change functionality coming soon
              </p>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white font-semibold rounded-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Save className="w-5 h-5" />
              {loading ? 'Saving...' : 'Save Settings'}
            </button>
          </div>

          {/* Settings Summary */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">Current Settings</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-blue-700 dark:text-blue-300">Language:</span>
                <div className="font-medium text-blue-900 dark:text-blue-100">
                  {languageOptions.find(opt => opt.value === settings.language)?.label}
                </div>
              </div>
              <div>
                <span className="text-blue-700 dark:text-blue-300">Email Notifications:</span>
                <div className="font-medium text-blue-900 dark:text-blue-100">
                  {settings.emailNotifications ? 'Enabled' : 'Disabled'}
                </div>
              </div>
              <div>
                <span className="text-blue-700 dark:text-blue-300">Theme:</span>
                <div className="font-medium text-blue-900 dark:text-blue-100">
                  {settings.darkMode ? 'Dark' : 'Light'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
