# Listing-Specific Feature Toggles

## 🎯 Overview
Social Proof and Urgency sections are now controlled per-listing through admin panel toggles, rather than global feature flags.

## 🗄️ Database Changes Required

Run this SQL script in your Supabase SQL editor:

```sql
-- Add social proof and urgency toggle fields to listing table
ALTER TABLE listing ADD COLUMN social_proof_enabled BOOLEAN DEFAULT false;
ALTER TABLE listing ADD COLUMN urgency_enabled BOOLEAN DEFAULT false;

-- Update existing listings to have both features disabled by default
UPDATE listing SET social_proof_enabled = false WHERE social_proof_enabled IS NULL;
UPDATE listing SET urgency_enabled = false WHERE urgency_enabled IS NULL;

-- Add comments for clarity
COMMENT ON COLUMN listing.social_proof_enabled IS 'Whether to display the social proof section for this listing';
COMMENT ON COLUMN listing.urgency_enabled IS 'Whether to display the urgency/scarcity section for this listing';

-- Verify the changes
SELECT id, business_name, social_proof_enabled, urgency_enabled, show_map FROM listing LIMIT 5;
```

## 🎛️ Admin Panel Controls

### Edit Listing Page (`/edit-listing/[id]`)
Three toggle switches are now available in the "Business Details" section:

1. **Map Display** - Controls "Find On Map" section
2. **Social Proof Section** - Controls "Trusted by Community" section  
3. **Urgency Section** - Controls "Limited Availability" section

### Toggle Behavior
- **Default State**: All toggles are OFF for new listings
- **Per-Listing Control**: Each listing can have different combinations enabled
- **Instant Effect**: Changes take effect immediately when saved
- **Visual Feedback**: Toggle switches show current state and preview text

## 📱 Frontend Implementation

### View Listing Page (`/view-listing/[slug]`)
Sections are conditionally rendered based on listing flags:

```javascript
// Social Proof Section
{listing?.social_proof_enabled && (
  <div className="social-proof-section">
    {/* Trusted by Community content */}
  </div>
)}

// Urgency Section  
{listing?.urgency_enabled && (
  <div className="urgency-section">
    {/* Limited Availability content */}
  </div>
)}
```

### Mobile Layout
- Social Proof section appears after Business Owner section
- Urgency section appears after Business Details section
- Both sections are hidden by default (when flags are false)

## 🔄 How It Works

### For Admins:
1. Go to Admin Panel → Edit Listing
2. Scroll to "Business Details" section
3. Toggle desired features ON/OFF
4. Save changes
5. Features appear/disappear on listing page immediately

### For Users:
- Only see sections that are enabled for that specific listing
- No global feature flags affecting all listings
- Each listing can have unique feature combinations

## 🎨 Visual Design

### Toggle Switches:
- **Map Display**: Blue toggle (primary color)
- **Social Proof**: Green toggle (success/trust color)
- **Urgency**: Orange toggle (warning/urgency color)

### Section Styling:
- **Social Proof**: Green gradient background with community avatars
- **Urgency**: Orange/red gradient background with pulsing dot
- Both sections have modern card design with shadows and borders

## 📋 Benefits

1. **Granular Control**: Each listing can have different features enabled
2. **Admin-Friendly**: Easy toggles in familiar admin interface
3. **No Code Changes**: Enable/disable features without touching code
4. **A/B Testing**: Test different feature combinations per listing
5. **Gradual Rollout**: Enable features for specific listings first
6. **Clean Codebase**: No global feature flags cluttering the code

## 🚀 Future Enhancements

When ready to implement real data:

1. **Social Proof**: Connect to reviews/ratings database
2. **Urgency**: Connect to booking/availability system
3. **Dynamic Content**: Replace static data with real-time information
4. **Analytics**: Track which features drive more engagement

## 📝 Notes

- All existing listings will have both features disabled by default
- New listings will have both features disabled by default
- Features can be enabled individually or together
- No backend API changes required for basic functionality
- Static content is used until real data integration is implemented
