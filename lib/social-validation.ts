// Utility functions for social media and OG validation

export interface OGValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  metaTags: {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
    type?: string;
  };
}

export function validateOGMetaTags(url: string, title: string, description: string, image?: string): OGValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const metaTags: OGValidationResult['metaTags'] = {};

  // Validate URL
  try {
    const urlObj = new URL(url);
    metaTags.url = urlObj.toString();
    
    if (!urlObj.protocol || !urlObj.hostname) {
      errors.push('Invalid URL format');
    }
  } catch (e) {
    errors.push('Invalid URL format');
  }

  // Validate title
  if (!title || title.trim().length === 0) {
    errors.push('Title is required');
  } else {
    metaTags.title = title.trim();
    
    if (title.length > 60) {
      warnings.push('Title is longer than 60 characters, may be truncated in some platforms');
    }
    
    if (title.length < 15) {
      warnings.push('Title is shorter than 15 characters, may not be descriptive enough');
    }
  }

  // Validate description
  if (!description || description.trim().length === 0) {
    errors.push('Description is required');
  } else {
    metaTags.description = description.trim();
    
    if (description.length > 160) {
      warnings.push('Description is longer than 160 characters, may be truncated in search results');
    }
    
    if (description.length < 50) {
      warnings.push('Description is shorter than 50 characters, may not be descriptive enough');
    }
  }

  // Validate image
  if (image) {
    metaTags.image = image;
    
    try {
      const imageUrl = new URL(image, url);
      
      // Check if image is accessible (basic validation)
      if (!imageUrl.protocol || !imageUrl.hostname) {
        warnings.push('Image URL may not be accessible');
      }
      
      // Check image file extension
      const imageExt = imageUrl.pathname.split('.').pop()?.toLowerCase();
      const validExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
      
      if (!imageExt || !validExtensions.includes(imageExt)) {
        warnings.push('Image should be in JPG, PNG, or WebP format for best compatibility');
      }
    } catch (e) {
      warnings.push('Image URL format may be invalid');
    }
  } else {
    warnings.push('No image specified - social media previews will not show images');
  }

  // Set default type
  metaTags.type = 'article';

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    metaTags
  };
}

export function generateSocialPreview(url: string, title: string, description: string, image?: string) {
  const validation = validateOGMetaTags(url, title, description, image);
  
  return {
    validation,
    preview: {
      facebook: {
        url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(description)}`,
        title: title,
        description: description,
        image: image || '/images/og-image.jpg'
      },
      twitter: {
        url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
        title: title,
        description: description,
        image: image || '/images/og-image.jpg'
      },
      whatsapp: {
        url: `https://wa.me/?text=${encodeURIComponent(title)}%20-%20${encodeURIComponent(description)}%20${encodeURIComponent(url)}`,
        title: title,
        description: description
      },
      linkedin: {
        url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(description)}`,
        title: title,
        description: description
      }
    }
  };
}

export function testSocialSharing(url: string, title: string, description: string, image?: string) {
  const preview = generateSocialPreview(url, title, description, image);
  
  return {
    ...preview,
    recommendations: [
      'Ensure your image is at least 1200x630 pixels for optimal display',
      'Keep titles between 15-60 characters for best results',
      'Write descriptions between 50-160 characters for full visibility',
      'Test your URLs on different social media platforms',
      'Use high-quality images with proper aspect ratios'
    ],
    bestPractices: [
      'Use descriptive, action-oriented titles',
      'Include relevant keywords in descriptions',
      'Add your brand name to titles when possible',
      'Use images that represent your content accurately',
      'Test sharing on both desktop and mobile devices'
    ]
  };
}
