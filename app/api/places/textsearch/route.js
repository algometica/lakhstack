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

        console.log('Making request to Google Places Text Search API with input:', input);

        // Get the origin from the request headers
        const origin = request.headers.get('origin') || request.headers.get('referer') || 'http://localhost:3000';

        // Using Google Places API (New) - Text Search (New)
        const data = await makeGooglePlacesRequest('https://places.googleapis.com/v1/places:searchText', {
            method: 'POST',
            headers: {
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