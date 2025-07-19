import { NextResponse } from 'next/server';
import { makeGooglePlacesRequest } from '@/lib/google-places';

export async function POST(request) {
    try {
        const { input } = await request.json();
        
        if (!input || typeof input !== 'string') {
            return NextResponse.json(
                { error: 'Input is required and must be a string' },
                { status: 400 }
            );
        }

        console.log('Making request to Google Places API (New) with input:', input);

        // Get the origin from the request headers
        const origin = request.headers.get('origin') || request.headers.get('referer') || 'http://localhost:3000';

        // Using Google Places API (New) - Autocomplete (New)
        const data = await makeGooglePlacesRequest('https://places.googleapis.com/v1/places:autocomplete', {
            method: 'POST',
            headers: {
                'X-Goog-FieldMask': 'suggestions.placePrediction.text,suggestions.placePrediction.structuredFormat,suggestions.placePrediction.placeId',
                'Referer': origin,
                'Origin': origin
            },
            body: JSON.stringify({
                input: input.trim(),
                languageCode: 'en'
            })
        });

        return NextResponse.json(data);

    } catch (error) {
        console.error('Autocomplete API error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}