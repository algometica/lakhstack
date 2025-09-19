// Feature Flags Configuration
// This file controls which features are enabled/disabled in the application

export const FEATURE_FLAGS = {
  // Social Proof Features
  SOCIAL_PROOF_SECTION: false, // "Trusted by Community" section
  COMMUNITY_AVATARS: false,    // Community member avatars
  RATING_DISPLAY: false,       // Star ratings display
  REVIEW_COUNT: false,         // Review count display
  
  // Urgency/Scarcity Features  
  URGENCY_SECTION: false,      // "Limited Availability" section
  SPOT_COUNTDOWN: false,       // Available spots counter
  BOOKING_CTA: false,          // Book Now button
  
  // Future Features
  REAL_TIME_AVAILABILITY: false, // Real-time spot tracking
  DYNAMIC_PRICING: false,        // Dynamic pricing based on demand
  NOTIFICATION_SYSTEM: false,    // Push notifications for availability
}

// Helper function to check if a feature is enabled
export function isFeatureEnabled(featureName) {
  return FEATURE_FLAGS[featureName] === true;
}

// Helper function to get all enabled features
export function getEnabledFeatures() {
  return Object.keys(FEATURE_FLAGS).filter(key => FEATURE_FLAGS[key] === true);
}

// Helper function to get all disabled features
export function getDisabledFeatures() {
  return Object.keys(FEATURE_FLAGS).filter(key => FEATURE_FLAGS[key] === false);
}
