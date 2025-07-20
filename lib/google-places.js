// Server-side Google Places API utility
// This keeps the API key secure on the server

export const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACE_API_KEY;

if (!GOOGLE_PLACES_API_KEY) {
  console.error('GOOGLE_PLACE_API_KEY is not set in environment variables');
}

export const makeGooglePlacesRequest = async (url, options = {}) => {
  if (!GOOGLE_PLACES_API_KEY) {
    throw new Error('Google Places API key is not configured');
  }

  const defaultHeaders = {
    'Content-Type': 'application/json',
    'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Google Places API error:', response.status, errorText);
    throw new Error(`Google Places API error: ${response.status}`);
  }

  return response.json();
}; 