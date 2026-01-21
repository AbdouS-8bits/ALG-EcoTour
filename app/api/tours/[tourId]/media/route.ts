import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// Upload multiple images/videos for a tour
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ tourId: string }> }
) {
  try {
    const { tourId } = await params;
    const body = await request.json();
    const { files } = body; // Array of uploaded file objects from Cloudinary

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No files provided' },
        { status: 400 }
      );
    }

    // Insert all images/videos into database
    const insertPromises = files.map(async (file: any, index: number) => {
      return query(
        `INSERT INTO "TourImage" ("tourId", url, alt, "isMain", "resourceType", duration, width, height)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [
          tourId,
          file.url,
          file.originalFilename || `Tour ${file.resourceType} ${index + 1}`,
          index === 0, // First file is main by default
          file.resourceType || 'image',
          file.duration || null,
          file.width || null,
          file.height || null,
        ]
      );
    });

    const results = await Promise.all(insertPromises);
    const insertedFiles = results.map((r) => r.rows[0]);

    return NextResponse.json({
      success: true,
      data: insertedFiles,
      message: `${insertedFiles.length} file(s) added successfully`,
    });
  } catch (error) {
    console.error('Error saving tour media:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save tour media' },
      { status: 500 }
    );
  }
}

// Get all images/videos for a tour
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tourId: string }> }
) {
  try {
    const { tourId } = await params;
    const result = await query(
      `SELECT * FROM "TourImage" 
       WHERE "tourId" = $1 
       ORDER BY "isMain" DESC, "createdAt" ASC`,
      [tourId]
    );

    return NextResponse.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error fetching tour media:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tour media' },
      { status: 500 }
    );
  }
}
