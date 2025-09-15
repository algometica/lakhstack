/**
 * Generate a URL-friendly slug from a string
 * @param {string} text - The text to convert to a slug
 * @returns {string} - URL-friendly slug
 */
export function generateSlug(text) {
  if (!text) return '';
  
  return text
    .toLowerCase()
    .trim()
    // Replace spaces and special characters with hyphens
    .replace(/[\s\W-]+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '');
}

/**
 * Generate a unique slug for a listing
 * @param {string} businessName - The business name
 * @param {number} listingId - The listing ID for uniqueness (fallback only)
 * @param {string[]} existingSlugs - Array of existing slugs to check against
 * @returns {string} - Unique slug
 */
export function generateListingSlug(businessName, listingId, existingSlugs = []) {
  let baseSlug = generateSlug(businessName);
  
  // If no business name provided, use a fallback
  if (!baseSlug) {
    baseSlug = `business-${listingId}`;
  }
  
  // If slug is already unique, return it
  if (!existingSlugs.includes(baseSlug)) {
    return baseSlug;
  }
  
  // If not unique, append ID as fallback
  return `${baseSlug}-${listingId}`;
}

/**
 * Extract listing ID from a slug (for backward compatibility)
 * @param {string} slug - The slug to extract ID from
 * @returns {number|null} - The listing ID or null if not found
 */
export function extractIdFromSlug(slug) {
  const match = slug.match(/-(\d+)$/);
  return match ? parseInt(match[1], 10) : null;
}

/**
 * Check if a slug contains an ID suffix
 * @param {string} slug - The slug to check
 * @returns {boolean} - True if slug ends with an ID
 */
export function hasIdSuffix(slug) {
  return /-\d+$/.test(slug);
}
