import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { placeId } = await request.json();
        
        if (!placeId || typeof placeId !== 'string') {
            return NextResponse.json(
                { error: 'Place ID is required and must be a string' },
                { status: 400 }
            );
        }

        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACE_API_KEY;
        
        if (!apiKey) {
            return NextResponse.json(
                { error: 'Google Places API key is not configured' },
                { status: 500 }
            );
        }

        // Get the origin from the request headers
        const origin = request.headers.get('origin') || request.headers.get('referer') || 'http://localhost:3000';

        // Using Google Places API (New) - Place Details (New)
        const response = await fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': apiKey,
                'X-Goog-FieldMask': 'location,formattedAddress,displayName,addressComponents',
                'Referer': origin,
                'Origin': origin
            }
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('Google Places Details API error:', response.status, errorData);
            return NextResponse.json(
                { error: 'Failed to fetch place details' },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error('Place details API error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}