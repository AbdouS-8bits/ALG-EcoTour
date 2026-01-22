'use client';

export default function DiagnosticPage() {
  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: '#ffffff' }}>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Basic Colors Test */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h1 className="text-3xl font-bold mb-4" style={{ color: '#000000' }}>
            Color Diagnostic Page
          </h1>
          <p className="text-lg" style={{ color: '#374151' }}>
            If you can read this text clearly, colors are working correctly.
          </p>
        </div>

        {/* Tailwind Classes Test */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Tailwind CSS Test</h2>
          <div className="space-y-2">
            <p className="text-gray-900">text-gray-900 (darkest)</p>
            <p className="text-gray-700">text-gray-700</p>
            <p className="text-gray-600">text-gray-600</p>
            <p className="text-gray-500">text-gray-500</p>
            <p className="text-gray-400">text-gray-400</p>
            <p className="text-gray-300">text-gray-300</p>
          </div>
        </div>

        {/* Background Test */}
        <div className="space-y-4">
          <div className="bg-white p-4 rounded">
            <p className="text-gray-900">White background with dark text</p>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-gray-900">Gray-50 background with dark text</p>
          </div>
          <div className="bg-gray-100 p-4 rounded">
            <p className="text-gray-900">Gray-100 background with dark text</p>
          </div>
        </div>

        {/* Button Test */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Button Test</h2>
          <div className="flex gap-4 flex-wrap">
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Blue Button
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
              Green Button
            </button>
            <button className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
              Gray Button
            </button>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50">
              Outlined Button
            </button>
          </div>
        </div>

        {/* System Info */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">System Check</h2>
          <div className="space-y-2 text-gray-700">
            <p><strong>Browser:</strong> {typeof window !== 'undefined' ? navigator.userAgent : 'Loading...'}</p>
            <p><strong>Dark Mode Preference:</strong> {typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'Yes ⚠️' : 'No ✅'}</p>
            <p><strong>Window Size:</strong> {typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : 'Loading...'}</p>
          </div>
        </div>

        {/* Solution Steps */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">If Everything is Black/White:</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Check your browser settings for "Force Dark Mode" or "Dark Reader" extensions</li>
            <li>Check Windows/Mac system settings - might be in Dark Mode</li>
            <li>Try opening in Incognito/Private mode</li>
            <li>Try a different browser</li>
            <li>Check browser accessibility settings</li>
            <li>Press Ctrl+0 (zero) to reset zoom</li>
          </ol>
        </div>

        {/* Inline Styles Test (should always work) */}
        <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>
            Inline Styles Test
          </h2>
          <p style={{ color: '#374151' }}>
            This text uses inline styles and should ALWAYS be readable, regardless of Tailwind or CSS issues.
          </p>
        </div>
      </div>
    </div>
  );
}
