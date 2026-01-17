import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }

    const uploadPromises = files.map(async (file) => {
      try {
        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Convert buffer to base64
        const base64Data = buffer.toString('base64');
        const dataURI = `data:${file.type};base64,${base64Data}`;

        // Determine resource type
        const isVideo = file.type.startsWith('video/');
        const resourceType = isVideo ? 'video' : 'image';

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(dataURI, {
          folder: 'algeria-ecotourism/tours',
          resource_type: resourceType,
          // Don't use timestamp parameter - let Cloudinary handle it
        });

        return {
          success: true,
          url: result.secure_url,
          publicId: result.public_id,
          format: result.format,
          resourceType: result.resource_type,
          duration: result.duration || null, // For videos
          width: result.width || null,
          height: result.height || null,
          originalFilename: file.name,
        };
      } catch (uploadError: any) {
        console.error(`Error uploading ${file.name}:`, uploadError);
        return {
          success: false,
          error: uploadError.message || 'Upload failed',
          originalFilename: file.name,
        };
      }
    });

    const results = await Promise.all(uploadPromises);

    // Separate successful and failed uploads
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);

    return NextResponse.json({
      success: successful.length > 0,
      data: successful,
      failed: failed.length > 0 ? failed : undefined,
      message: `${successful.length} file(s) uploaded successfully${failed.length > 0 ? `, ${failed.length} failed` : ''}`,
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Upload failed' },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve uploaded files for a tour
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const folder = searchParams.get('folder') || 'algeria-ecotourism/tours';

    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: folder,
      max_results: 100,
    });

    return NextResponse.json({
      success: true,
      data: result.resources,
    });
  } catch (error: any) {
    console.error('Error fetching uploads:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch uploads' },
      { status: 500 }
    );
  }
}

// DELETE endpoint to remove an uploaded file
export async function DELETE(request: NextRequest) {
  try {
    const { publicId, resourceType } = await request.json();

    if (!publicId) {
      return NextResponse.json(
        { error: 'Public ID is required' },
        { status: 400 }
      );
    }

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType || 'image',
    });

    return NextResponse.json({
      success: result.result === 'ok',
      message: result.result === 'ok' ? 'File deleted successfully' : 'File not found',
    });
  } catch (error: any) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: error.message || 'Delete failed' },
      { status: 500 }
    );
  }
}
