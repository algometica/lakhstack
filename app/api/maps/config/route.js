import { NextResponse } from 'next/server';

export async function GET() {
  // Only return the API key if it's configured for client-side use
  const mapsApiKey = process.env.GOOGLE_MAPS_API_KEY;
  
  if (!mapsApiKey) {
    return NextResponse.json(
      { error: 'Google Maps API key is not configured' },
      { status: 500 }
    );
  }

  return NextResponse.json({
    apiKey: mapsApiKey
  });
} 