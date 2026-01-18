'use client';

import { useState } from 'react';

export default function UploadTestPage() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError('');
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      console.log('Uploading file:', file.name, file.type, file.size);
      
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      console.log('Response status:', response.status);
      
      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.error || `Upload failed with status ${response.status}`);
      }

      setResult(data);
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-6">Upload Test Page</h1>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-semibold
                file:bg-green-50 file:text-green-700
                hover:file:bg-green-100"
            />
          </div>

          {file && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm"><strong>File:</strong> {file.name}</p>
              <p className="text-sm"><strong>Type:</strong> {file.type}</p>
              <p className="text-sm"><strong>Size:</strong> {(file.size / 1024).toFixed(2)} KB</p>
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={!file || loading}
            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Uploading...' : 'Upload'}
          </button>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800"><strong>Error:</strong></p>
              <p className="text-sm text-red-600 mt-1">{error}</p>
            </div>
          )}

          {result && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800 mb-2"><strong>Success!</strong></p>
              <p className="text-sm text-green-600 break-all"><strong>URL:</strong> {result.url}</p>
              <p className="text-sm text-green-600"><strong>Public ID:</strong> {result.publicId}</p>
              {result.url && (
                <img src={result.url} alt="Uploaded" className="mt-4 max-w-full h-auto rounded-lg" />
              )}
            </div>
          )}
        </div>

        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800 font-semibold mb-2">Required Environment Variables:</p>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>✓ NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME</li>
            <li>✓ CLOUDINARY_UPLOAD_PRESET</li>
          </ul>
          <p className="text-xs text-yellow-600 mt-3">
            Check your terminal/console for detailed error logs
          </p>
        </div>
      </div>
    </div>
  );
}
