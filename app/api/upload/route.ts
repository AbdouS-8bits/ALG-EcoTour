import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { getToken } from 'next-auth/jwt';
import { validateRequest } from '@/lib/validation';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// File validation schema
const uploadSchema = {
  file: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  }
};

export async function POST(request: NextRequest) {
  try {
    // Check authentication - require admin role for uploads
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    });

    if (!token || token.role !== "admin") {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > uploadSchema.file.maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!uploadSchema.file.allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { 
          error: 'Invalid file type. Allowed types: JPEG, PNG, WebP',
          allowedTypes: uploadSchema.file.allowedTypes
        },
        { status: 400 }
      );
    }

    // Additional validation for file content
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Basic image validation - check file signatures
    const isValidImage = validateImageBuffer(buffer, file.type);
    if (!isValidImage) {
      return NextResponse.json(
        { error: 'Invalid image file' },
        { status: 400 }
      );
    }

    // Convert buffer to base64
    const base64Image = buffer.toString('base64');
    const dataURI = `data:${file.type};base64,${base64Image}`;

    // Upload to Cloudinary with security settings
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'algeria-ecotourism/tours',
      resource_type: 'image',
      format: 'webp', // Convert to WebP for optimization
      quality: 'auto:good', // Auto-optimize quality
      fetch_format: 'auto', // Auto-format selection
      secure: true, // Force HTTPS URLs
    });

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      size: result.bytes,
      width: result.width,
      height: result.height,
    });
  } catch (error: unknown) {
    console.error('Upload error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Upload failed';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

// Basic image validation using file signatures
function validateImageBuffer(buffer: Buffer, mimeType: string): boolean {
  if (buffer.length < 4) return false;

  // Check file signatures for common image formats
  const signatures = {
    'image/jpeg': [0xFF, 0xD8, 0xFF],
    'image/jpg': [0xFF, 0xD8, 0xFF],
    'image/png': [0x89, 0x50, 0x4E, 0x47],
    'image/webp': [0x52, 0x49, 0x46, 0x46] // RIFF
  };

  const expectedSignature = signatures[mimeType as keyof typeof signatures];
  if (!expectedSignature) return false;

  // Check if buffer starts with expected signature
  for (let i = 0; i < expectedSignature.length; i++) {
    if (buffer[i] !== expectedSignature[i]) return false;
  }

  return true;
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
