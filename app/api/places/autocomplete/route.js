import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { input } = await request.json();
        
        if (!input || typeof input !== 'string') {
            return NextResponse.json(
                { error: 'Input is required and must be a string' },
                { status: 400 }
            );
        }

        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACE_API_KEY;
        
        if (!apiKey) {
            console.error('Google Places API key is missing from environment variables');
            return NextResponse.json(
                { error: 'Google Places API key is not configured' },
                { status: 500 }
            );
        }

        console.log('Making request to Google Places API (New) with input:', input);

        // Get the origin from the request headers
        const origin = request.headers.get('origin') || request.headers.get('referer') || 'http://localhost:3000';

        // Using Google Places API (New) - Autocomplete (New)
        const response = await fetch('https://places.googleapis.com/v1/places:autocomplete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': apiKey,
                'X-Goog-FieldMask': 'suggestions.placePrediction.text,suggestions.placePrediction.structuredFormat,suggestions.placePrediction.placeId',
                'Referer': origin,
                'Origin': origin
            },
            body: JSON.stringify({
                input: input.trim(),
                languageCode: 'en'
            })
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('Google Places API error:', response.status, errorData);
            return NextResponse.json(
                { error: 'Failed to fetch place suggestions' },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error('Autocomplete API error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}