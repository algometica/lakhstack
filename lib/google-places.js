// Server-side Google Places API utility
// This keeps the API key secure on the server

export const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

if (!GOOGLE_PLACES_API_KEY) {
  console.error('GOOGLE_PLACES_API_KEY is not set in environment variables');
}

export const makeGooglePlacesRequest = async (url, options = {}, retries = 3) => {
  if (!GOOGLE_PLACES_API_KEY) {
    throw new Error('Google Places API key is not configured');
  }

  const defaultHeaders = {
    'Content-Type': 'application/json',
    'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000); // 10 second timeout

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google Places API error:', response.status, errorText);
      throw new Error(`Google Places API error: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    clearTimeout(timeout);
    
    // Retry logic for network errors
    if ((error.name === 'AbortError' || error.code === 'UND_ERR_CONNECT_TIMEOUT' || error.message.includes('timeout')) && retries > 0) {
      console.log(`Google Places API timeout, retrying... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
      return makeGooglePlacesRequest(url, options, retries - 1);
    }
    
    console.error('Google Places API request failed:', error.message);
    throw error;
  }
}; 