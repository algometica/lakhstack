# Quick Feature Toggle Reference

## 🎛️ How to Enable/Disable Features

### Current Status (All Disabled)
All social proof and urgency features are currently **DISABLED** by default.

### To Enable Features Later:

1. **Open**: `lib/feature-flags.js`
2. **Change**: `false` to `true` for desired features
3. **Save**: File automatically updates the UI

### Feature Flag Quick Reference:

```javascript
// Social Proof Features
SOCIAL_PROOF_SECTION: false,  // Main "Trusted by Community" section
COMMUNITY_AVATARS: false,     // Community member avatars (A, B, C, +12)
RATING_DISPLAY: false,        // Star ratings (4.9★)
REVIEW_COUNT: false,          // Review count (50+ Reviews)

// Urgency/Scarcity Features  
URGENCY_SECTION: false,       // Main "Limited Availability" section
SPOT_COUNTDOWN: false,        // Available spots counter (3 spots left)
BOOKING_CTA: false,           // "Book Now" button

// Future Features (Not Implemented Yet)
REAL_TIME_AVAILABILITY: false, // Real-time spot tracking
DYNAMIC_PRICING: false,        // Dynamic pricing based on demand
NOTIFICATION_SYSTEM: false,    // Push notifications for availability
```

### Example: Enable Social Proof Only
```javascript
export const FEATURE_FLAGS = {
  SOCIAL_PROOF_SECTION: true,  // ✅ Enable main section
  COMMUNITY_AVATARS: true,     // ✅ Enable avatars
  RATING_DISPLAY: true,        // ✅ Enable ratings
  REVIEW_COUNT: true,          // ✅ Enable review count
  
  URGENCY_SECTION: false,      // ❌ Keep disabled
  SPOT_COUNTDOWN: false,       // ❌ Keep disabled
  BOOKING_CTA: false,          // ❌ Keep disabled
  // ... other flags
}
```

### Example: Enable Urgency Only
```javascript
export const FEATURE_FLAGS = {
  SOCIAL_PROOF_SECTION: false, // ❌ Keep disabled
  COMMUNITY_AVATARS: false,    // ❌ Keep disabled
  RATING_DISPLAY: false,       // ❌ Keep disabled
  REVIEW_COUNT: false,         // ❌ Keep disabled
  
  URGENCY_SECTION: true,       // ✅ Enable main section
  SPOT_COUNTDOWN: true,        // ✅ Enable countdown
  BOOKING_CTA: true,           // ✅ Enable booking button
  // ... other flags
}
```

### Example: Enable Everything
```javascript
export const FEATURE_FLAGS = {
  SOCIAL_PROOF_SECTION: true,
  COMMUNITY_AVATARS: true,
  RATING_DISPLAY: true,
  REVIEW_COUNT: true,
  URGENCY_SECTION: true,
  SPOT_COUNTDOWN: true,
  BOOKING_CTA: true,
  // ... other flags
}
```

## 🔄 Testing Features

### Test Individual Features:
1. Enable only one feature flag
2. Refresh the page
3. Verify the section appears
4. Test functionality
5. Disable when done testing

### Test Feature Combinations:
1. Enable multiple related features
2. Check for conflicts or layout issues
3. Verify all features work together
4. Document any issues found

## 📋 Backend Requirements

Before enabling features, ensure backend data is available:

### For Social Proof:
- Reviews/ratings data in database
- Community member data
- Business statistics (years in business, etc.)

### For Urgency/Scarcity:
- Availability slots data
- Booking system
- Real-time availability updates

## 🚨 Important Notes

- **Always test** features before enabling in production
- **Backend data** must be available before enabling features
- **Performance impact** should be monitored
- **User experience** should be tested across devices
- **Feature combinations** should be tested for conflicts

## 📞 Support

If you need help implementing the backend features, refer to:
- `FEATURE_IMPLEMENTATION_GUIDE.md` - Complete backend implementation guide
- Database schema requirements
- API endpoint specifications
- Implementation phases and timeline
