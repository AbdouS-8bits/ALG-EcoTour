'use client';

import { useSession } from 'next-auth/react';
import { useState } from 'react';

export default function ReviewTestPage() {
  const { data: session, status } = useSession();
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testSession = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/session');
      const data = await res.json();
      setResult({ success: true, data, message: 'Session retrieved successfully' });
    } catch (error) {
      setResult({ success: false, error: (error as Error).message });
    }
    setLoading(false);
  };

  const testGetReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/reviews?tourId=1');
      const data = await res.json();
      setResult({ success: res.ok, data, message: res.ok ? 'Reviews fetched successfully' : 'Failed to fetch reviews' });
    } catch (error) {
      setResult({ success: false, error: (error as Error).message });
    }
    setLoading(false);
  };

  const testCreateReview = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating: 5,
          comment: 'This is a test review with more than 10 characters',
          tourId: 1
        })
      });
      const data = await res.json();
      setResult({ 
        success: res.ok, 
        data, 
        status: res.status,
        message: res.ok ? 'Review created successfully!' : 'Failed to create review' 
      });
    } catch (error) {
      setResult({ success: false, error: (error as Error).message });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Review System Test Page</h1>

        {/* Session Status */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Session Status</h2>
          <div className="space-y-2">
            <p><strong>Status:</strong> {status}</p>
            {session ? (
              <>
                <p><strong>Email:</strong> {session.user?.email}</p>
                <p><strong>Name:</strong> {session.user?.name || 'N/A'}</p>
                <p><strong>ID:</strong> {session.user?.id || 'N/A'}</p>
                <p><strong>Role:</strong> {session.user?.role || 'N/A'}</p>
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
                  <p className="text-green-800">✅ You are logged in</p>
                </div>
              </>
            ) : (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded">
                <p className="text-red-800">❌ You are not logged in</p>
                <p className="text-sm text-red-600 mt-2">Please log in at <a href="/auth/login" className="underline">/auth/login</a></p>
              </div>
            )}
          </div>
        </div>

        {/* Test Buttons */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">API Tests</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={testSession}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              Test Session API
            </button>
            <button
              onClick={testGetReviews}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              Test Get Reviews
            </button>
            <button
              onClick={testCreateReview}
              disabled={loading || !session}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
            >
              Test Create Review
            </button>
          </div>
          {!session && (
            <p className="text-sm text-gray-600 mt-4">
              * You must be logged in to test creating a review
            </p>
          )}
        </div>

        {/* Results */}
        {result && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Test Results</h2>
            <div className={`p-4 rounded mb-4 ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <p className={result.success ? 'text-green-800' : 'text-red-800'}>
                {result.success ? '✅' : '❌'} {result.message || 'Test completed'}
              </p>
              {result.status && (
                <p className="text-sm mt-2">Status Code: {result.status}</p>
              )}
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="font-semibold mb-2">Response Data:</h3>
              <pre className="text-xs overflow-auto max-h-96">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">Instructions</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>Make sure you're logged in (check Session Status above)</li>
            <li>Click "Test Session API" to verify your session is working</li>
            <li>Click "Test Get Reviews" to fetch reviews for tour ID 1</li>
            <li>Click "Test Create Review" to create a test review</li>
            <li>Check the results below each test</li>
          </ol>
          
          <div className="mt-6 pt-6 border-t border-blue-200">
            <h3 className="font-semibold mb-2">Common Issues:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>If "Test Create Review" fails with 401: You're not logged in</li>
              <li>If it fails with 404: Tour ID 1 doesn't exist in your database</li>
              <li>If it fails with 409: You've already reviewed this tour</li>
              <li>If it fails with 500: Check server logs for detailed error</li>
            </ul>
          </div>

          <div className="mt-4 pt-4 border-t border-blue-200">
            <h3 className="font-semibold mb-2">Next Steps:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>If all tests pass, go to a real tour page: <a href="/EcoTour/1" className="underline text-blue-600">/EcoTour/1</a></li>
              <li>Click on the "Reviews" tab</li>
              <li>Try creating a real review</li>
              <li>Test editing and deleting your reviews</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
