import { NextResponse } from 'next/server';
import { makeGooglePlacesRequest } from '@/lib/google-places';
import { getClientIp, rateLimit } from '@/lib/rate-limit';

export async function POST(request) {
    try {
        const ip = getClientIp(request);
        const { allowed } = rateLimit({ key: `places-details:${ip}`, limit: 60, windowMs: 60_000 });
        if (!allowed) {
            return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
        }

        const { placeId } = await request.json();
        
        if (!placeId || typeof placeId !== 'string') {
            return NextResponse.json(
                { error: 'Place ID is required and must be a string' },
                { status: 400 }
            );
        }

        // Get the origin from the request headers
        const origin = request.headers.get('origin') || request.headers.get('referer') || process.env.NEXTAUTH_URL || 'https://www.lakhstack.com';

        // Using Google Places API (New) - Place Details (New)
        const data = await makeGooglePlacesRequest(`https://places.googleapis.com/v1/places/${placeId}`, {
            method: 'GET',
            headers: {
                'X-Goog-FieldMask': 'location,formattedAddress,displayName,addressComponents',
                'Referer': origin,
                'Origin': origin
            }
        });

        return NextResponse.json(data);

    } catch (error) {
        console.error('Place details API error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
