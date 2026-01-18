'use client';

import { useState } from 'react';
import { Copy, MessageCircle, Facebook, Share2, Check } from 'lucide-react';

interface ShareButtonsProps {
  tourUrl: string;
  tourTitle: string;
  tourDescription: string;
  className?: string;
}

export default function ShareButtons({ 
  tourUrl, 
  tourTitle, 
  tourDescription,
  className = '' 
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(tourUrl);
      setCopied(true);
      setShowToast(true);
      
      // Reset states after 2 seconds
      setTimeout(() => {
        setCopied(false);
        setShowToast(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleShare = (platform: string) => {
    const encodedUrl = encodeURIComponent(tourUrl);
    const encodedTitle = encodeURIComponent(tourTitle);
    const encodedDescription = encodeURIComponent(tourDescription);
    
    let shareUrl = '';
    
    switch (platform) {
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodedTitle}%20-%20${encodedDescription}%20${encodedUrl}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedDescription}`;
        break;
      case 'x':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes');
  };

  return (
    <>
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg transform transition-all duration-300 animate-pulse">
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5" />
            <span className="text-sm font-medium">Link copied successfully!</span>
          </div>
        </div>
      )}
      
      {/* Share Buttons Container */}
      <div className={`flex flex-col sm:flex-row gap-3 ${className}`}>
        {/* Copy Link Button */}
        <button
          onClick={handleCopyLink}
          className={`flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 ${
            copied ? 'bg-green-100 text-green-700' : ''
          }`}
          title="Copy tour link to clipboard"
        >
          <Copy className={`w-4 h-4 transition-colors duration-200 ${
            copied ? 'text-green-600' : 'text-gray-500'
          }`} />
          <span className="text-sm font-medium hidden sm:inline">
            {copied ? 'Copied!' : 'Copy Link'}
          </span>
          <span className="text-xs sm:hidden">
            {copied ? '✓' : '🔗'}
          </span>
        </button>

        {/* WhatsApp Share */}
        <button
          onClick={() => handleShare('whatsapp')}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-200"
          title="Share on WhatsApp"
        >
          <MessageCircle className="w-4 h-4" />
          <span className="text-sm font-medium hidden sm:inline">WhatsApp</span>
          <span className="text-xs sm:hidden">📱</span>
        </button>

        {/* Facebook Share */}
        <button
          onClick={() => handleShare('facebook')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
          title="Share on Facebook"
        >
          <Facebook className="w-4 h-4" />
          <span className="text-sm font-medium hidden sm:inline">Facebook</span>
          <span className="text-xs sm:hidden">📘</span>
        </button>

        {/* X (Twitter) Share */}
        <button
          onClick={() => handleShare('x')}
          className="flex items-center gap-2 px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-lg transition-colors duration-200"
          title="Share on X (Twitter)"
        >
          <Share2 className="w-4 h-4" />
          <span className="text-sm font-medium hidden sm:inline">X</span>
          <span className="text-xs sm:hidden">𝕏</span>
        </button>
      </div>
    </>
  );
}
