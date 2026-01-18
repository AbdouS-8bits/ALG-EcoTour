import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET search tours and filter
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const search = searchParams.get('search');
    const categoryId = searchParams.get('categoryId');
    const difficulty = searchParams.get('difficulty');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const location = searchParams.get('location');
    const status = searchParams.get('status') || 'active';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'DESC';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const offset = (page - 1) * limit;

    let queryText = `
      SELECT 
        t.*,
        c.name as "categoryName",
        c.icon as "categoryIcon",
        COALESCE(AVG(r.rating), 0) as "averageRating",
        COUNT(DISTINCT r.id) as "reviewCount",
        (SELECT url FROM "TourImage" WHERE "tourId" = t.id AND "isMain" = true LIMIT 1) as "mainImage"
      FROM eco_tours t
      LEFT JOIN "Category" c ON t."categoryId" = c.id
      LEFT JOIN "Review" r ON t.id = r."tourId"
    `;

    let countText = `SELECT COUNT(DISTINCT t.id) FROM eco_tours t`;
    
    const params: any[] = [];
    const whereClauses: string[] = [];

    if (search) {
      whereClauses.push(`(t.title ILIKE $${params.length + 1} OR t.description ILIKE $${params.length + 1} OR t.location ILIKE $${params.length + 1})`);
      params.push(`%${search}%`);
    }

    if (categoryId) {
      whereClauses.push(`t."categoryId" = $${params.length + 1}`);
      params.push(categoryId);
    }

    if (difficulty) {
      whereClauses.push(`t.difficulty = $${params.length + 1}`);
      params.push(difficulty);
    }

    if (minPrice) {
      whereClauses.push(`t.price >= $${params.length + 1}`);
      params.push(parseFloat(minPrice));
    }

    if (maxPrice) {
      whereClauses.push(`t.price <= $${params.length + 1}`);
      params.push(parseFloat(maxPrice));
    }

    if (location) {
      whereClauses.push(`t.location ILIKE $${params.length + 1}`);
      params.push(`%${location}%`);
    }

    if (status) {
      whereClauses.push(`t.status = $${params.length + 1}`);
      params.push(status);
    }

    if (whereClauses.length > 0) {
      const whereClause = ` WHERE ${whereClauses.join(' AND ')}`;
      queryText += whereClause;
      countText += whereClause;
    }

    queryText += ` GROUP BY t.id, c.id`;

    // Add sorting
    const allowedSortFields = ['createdAt', 'price', 'title', 'averageRating', 'duration'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const order = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    
    if (sortField === 'averageRating') {
      queryText += ` ORDER BY "averageRating" ${order}, t."createdAt" DESC`;
    } else {
      queryText += ` ORDER BY t."${sortField}" ${order}`;
    }

    queryText += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const [tours, count] = await Promise.all([
      query(queryText, params),
      query(countText, params.slice(0, -2)),
    ]);

    return NextResponse.json({
      success: true,
      data: tours.rows.map(tour => ({
        ...tour,
        averageRating: parseFloat(tour.averageRating).toFixed(1),
        reviewCount: parseInt(tour.reviewCount),
      })),
      pagination: {
        total: parseInt(count.rows[0].count),
        page,
        limit,
        totalPages: Math.ceil(parseInt(count.rows[0].count) / limit),
      },
    });
  } catch (error) {
    console.error('Error searching tours:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to search tours' },
      { status: 500 }
    );
  }
}
