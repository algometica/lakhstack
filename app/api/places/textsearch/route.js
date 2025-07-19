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

        console.log('Making request to Google Places Text Search API with input:', input);

        // Get the origin from the request headers
        const origin = request.headers.get('origin') || request.headers.get('referer') || 'http://localhost:3000';

        // Using Google Places API (New) - Text Search (New)
        const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': apiKey,
                'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.location,places.id',
                'Referer': origin,
                'Origin': origin
            },
            body: JSON.stringify({
                textQuery: input.trim(),
                maxResultCount: 10,
                languageCode: 'en'
            })
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('Google Places Text Search API error:', response.status, errorData);
            return NextResponse.json(
                { error: 'Failed to fetch place suggestions', details: errorData },
                { status: response.status }
            );
        }

        const data = await response.json();
        
        // Transform the response to match our expected format
        const transformedData = {
            suggestions: data.places?.map(place => ({
                placePrediction: {
                    text: {
                        text: place.formattedAddress || place.displayName?.text
                    },
                    structuredFormat: {
                        mainText: {
                            text: place.displayName?.text
                        },
                        secondaryText: {
                            text: place.formattedAddress
                        }
                    },
                    placeId: place.id
                }
            })) || []
        };

        return NextResponse.json(transformedData);

    } catch (error) {
        console.error('Text Search API error:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: error.message },
            { status: 500 }
        );
    }
}