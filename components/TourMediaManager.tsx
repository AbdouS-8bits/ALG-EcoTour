'use client';

import { useState } from 'react';
import MultipleFileUpload from '@/components/MultipleFileUpload';

interface TourMediaManagerProps {
  tourId: number;
}

export default function TourMediaManager({ tourId }: TourMediaManagerProps) {
  const [existingMedia, setExistingMedia] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch existing media
  const fetchMedia = async () => {
    try {
      const response = await fetch(`/api/tours/${tourId}/media`);
      const data = await response.json();
      if (data.success) {
        setExistingMedia(data.data);
      }
    } catch (error) {
      console.error('Error fetching media:', error);
    }
  };

  // Handle upload complete
  const handleUploadComplete = async (uploadedFiles: any[]) => {
    setLoading(true);
    try {
      // Save uploaded files to database
      const response = await fetch(`/api/tours/${tourId}/media`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ files: uploadedFiles }),
      });

      const data = await response.json();
      if (data.success) {
        alert('Media saved successfully!');
        await fetchMedia(); // Refresh the list
      } else {
        alert(`Failed to save media: ${data.error}`);
      }
    } catch (error) {
      console.error('Error saving media:', error);
      alert('Failed to save media');
    } finally {
      setLoading(false);
    }
  };

  // Delete media
  const handleDelete = async (mediaId: number, publicId: string, resourceType: string) => {
    if (!confirm('Are you sure you want to delete this media?')) return;

    try {
      // Delete from Cloudinary
      await fetch('/api/upload', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicId, resourceType }),
      });

      // Delete from database
      await fetch(`/api/tours/${tourId}/images/${mediaId}`, {
        method: 'DELETE',
      });

      alert('Media deleted successfully');
      await fetchMedia();
    } catch (error) {
      console.error('Error deleting media:', error);
      alert('Failed to delete media');
    }
  };

  // Set as main image
  const setAsMain = async (mediaId: number) => {
    try {
      await fetch(`/api/tours/${tourId}/images/${mediaId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isMain: true }),
      });

      alert('Main image updated');
      await fetchMedia();
    } catch (error) {
      console.error('Error updating main image:', error);
      alert('Failed to update main image');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Upload Tour Media</h2>
        <MultipleFileUpload
          onUploadComplete={handleUploadComplete}
          maxFiles={20}
          allowVideos={true}
        />
      </div>

      {loading && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <p className="mt-2 text-gray-600">Saving media...</p>
        </div>
      )}

      {/* Existing Media Gallery */}
      {existingMedia.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Tour Media Gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {existingMedia.map((media) => (
              <div
                key={media.id}
                className="relative group border rounded-lg overflow-hidden"
              >
                {media.resourceType === 'video' ? (
                  <video
                    src={media.url}
                    controls
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <img
                    src={media.url}
                    alt={media.alt || 'Tour media'}
                    className="w-full h-48 object-cover"
                  />
                )}

                {media.isMain && (
                  <div className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                    Main
                  </div>
                )}

                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  {!media.isMain && media.resourceType === 'image' && (
                    <button
                      onClick={() => setAsMain(media.id)}
                      className="bg-green-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Set as Main
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(media.id, media.publicId, media.resourceType)}
                    className="bg-red-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Delete
                  </button>
                </div>

                <div className="p-2 bg-white">
                  <p className="text-xs text-gray-600 truncate">
                    {media.alt || 'No description'}
                  </p>
                  <p className="text-xs text-gray-400">
                    {media.resourceType === 'video' && media.duration && (
                      `${Math.round(media.duration)}s • `
                    )}
                    {media.width && media.height && `${media.width}x${media.height}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={fetchMedia}
        className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
      >
        Refresh Gallery
      </button>
    </div>
  );
}
