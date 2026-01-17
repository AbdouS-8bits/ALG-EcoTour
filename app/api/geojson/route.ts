import { NextRequest, NextResponse } from 'next/server';

// Sample GeoJSON data for Algeria tourism regions
const algeriaGeoJSON = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        name: "Sahara Desert Region",
        description: "Major desert tourism area with sand dunes and oasis",
        region: "south"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-5, 20], [10, 20], [10, 30], [-5, 30], [-5, 20]
        ]]
      }
    },
    {
      type: "Feature",
      properties: {
        name: "Tell Atlas Region",
        description: "Mountainous region with hiking and nature tours",
        region: "north"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-2, 34], [6, 34], [6, 37], [-2, 37], [-2, 34]
        ]]
      }
    },
    {
      type: "Feature",
      properties: {
        name: "Coastal Region",
        description: "Mediterranean coastline with beach and marine activities",
        region: "north"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-2, 35], [8, 35], [8, 37], [-2, 37], [-2, 35]
        ]]
      }
    }
  ]
};

export async function GET(request: NextRequest) {
  try {
    // Add CORS headers
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    return NextResponse.json(algeriaGeoJSON, { headers });
  } catch (error) {
    console.error('GeoJSON API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch GeoJSON data' },
      { status: 500 }
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
