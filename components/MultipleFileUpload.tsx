'use client';

import { useState } from 'react';
import Image from 'next/image';

interface UploadedFile {
  url: string;
  publicId: string;
  format: string;
  resourceType: string;
  duration?: number;
  width?: number;
  height?: number;
  originalFilename: string;
}

interface MultipleFileUploadProps {
  onUploadComplete?: (files: UploadedFile[]) => void;
  maxFiles?: number;
  acceptedTypes?: string[];
  allowVideos?: boolean;
}

export default function MultipleFileUpload({
  onUploadComplete,
  maxFiles = 10,
  acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  allowVideos = true,
}: MultipleFileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [progress, setProgress] = useState(0);

  const allAcceptedTypes = allowVideos
    ? [...acceptedTypes, 'video/mp4', 'video/quicktime', 'video/x-msvideo']
    : acceptedTypes;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);

    // Validate file count
    if (files.length + selectedFiles.length > maxFiles) {
      alert(`You can only upload up to ${maxFiles} files`);
      return;
    }

    // Validate file types
    const validFiles = selectedFiles.filter((file) => {
      if (!allAcceptedTypes.includes(file.type)) {
        alert(`${file.name} is not a supported file type`);
        return false;
      }
      return true;
    });

    // Create previews
    const newPreviews: string[] = [];
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        newPreviews.push(e.target?.result as string);
        if (newPreviews.length === validFiles.length) {
          setPreviews([...previews, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });

    setFiles([...files, ...validFiles]);
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setFiles(newFiles);
    setPreviews(newPreviews);
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      alert('Please select files to upload');
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('files', file);
      });

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setUploadedFiles(data.data);
        if (onUploadComplete) {
          onUploadComplete(data.data);
        }
        // Clear files after successful upload
        setFiles([]);
        setPreviews([]);
        alert(`${data.data.length} file(s) uploaded successfully!`);
      } else {
        alert(`Upload failed: ${data.error}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="w-full space-y-4">
      {/* Upload Area */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-500 transition-colors">
        <input
          type="file"
          id="file-upload"
          multiple
          accept={allAcceptedTypes.join(',')}
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer flex flex-col items-center space-y-2"
        >
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <div className="text-sm text-gray-600">
            <span className="font-semibold text-green-600">Click to upload</span> or
            drag and drop
          </div>
          <div className="text-xs text-gray-500">
            {allowVideos ? 'Images (PNG, JPG, WEBP) or Videos (MP4)' : 'Images only (PNG, JPG, WEBP)'}
            <br />
            Max {maxFiles} files • {files.length} selected
          </div>
        </label>
      </div>

      {/* File Previews */}
      {files.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">
            Selected Files ({files.length})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {files.map((file, index) => (
              <div
                key={index}
                className="relative group border rounded-lg overflow-hidden"
              >
                {file.type.startsWith('image/') ? (
                  <img
                    src={previews[index]}
                    alt={file.name}
                    className="w-full h-32 object-cover"
                  />
                ) : (
                  <div className="w-full h-32 bg-gray-100 flex items-center justify-center">
                    <svg
                      className="w-12 h-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center">
                  <button
                    onClick={() => removeFile(index)}
                    className="opacity-0 group-hover:opacity-100 bg-red-500 text-white p-2 rounded-full transition-opacity"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <div className="p-2 bg-white">
                  <p className="text-xs text-gray-600 truncate">{file.name}</p>
                  <p className="text-xs text-gray-400">{formatFileSize(file.size)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Upload Button */}
          <div className="flex gap-2">
            <button
              onClick={handleUpload}
              disabled={uploading}
              className={`flex-1 py-2 px-4 rounded-lg font-medium text-white ${
                uploading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {uploading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Uploading...
                </span>
              ) : (
                `Upload ${files.length} File${files.length > 1 ? 's' : ''}`
              )}
            </button>
            <button
              onClick={() => {
                setFiles([]);
                setPreviews([]);
              }}
              disabled={uploading}
              className="py-2 px-4 rounded-lg font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              Clear All
            </button>
          </div>
        </div>
      )}

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-4 mt-6">
          <h3 className="font-semibold text-gray-900">
            Uploaded Files ({uploadedFiles.length})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="border rounded-lg overflow-hidden">
                {file.resourceType === 'image' ? (
                  <img
                    src={file.url}
                    alt={file.originalFilename}
                    className="w-full h-32 object-cover"
                  />
                ) : (
                  <video
                    src={file.url}
                    controls
                    className="w-full h-32 object-cover"
                  />
                )}
                <div className="p-2 bg-white">
                  <p className="text-xs text-gray-600 truncate">
                    {file.originalFilename}
                  </p>
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-green-600 hover:underline"
                  >
                    View
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
