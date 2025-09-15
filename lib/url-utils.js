/**
 * Get the base URL for the current environment
 * @returns {string} The base URL (localhost in dev, production URL in production)
 */
export function getBaseUrl() {
    // In browser environment
    if (typeof window !== 'undefined') {
        return window.location.origin;
    }
    
    // In server environment (SSR)
    if (typeof process !== 'undefined' && process.env) {
        // Check if we're in production
        if (process.env.NODE_ENV === 'production') {
            // You can set this environment variable in your deployment
            return process.env.NEXT_PUBLIC_BASE_URL || 'https://www.lakhstack.com';
        }
        // Development environment
        return process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    }
    
    // Fallback
    return 'https://www.lakhstack.com';
}

/**
 * Generate a full URL for a listing
 * @param {string} slug - The listing slug
 * @returns {string} The full URL
 */
export function getListingUrl(slug) {
    const baseUrl = getBaseUrl();
    return `${baseUrl}/view-listing/${slug}`;
}
