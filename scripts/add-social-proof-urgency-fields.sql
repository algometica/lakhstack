-- Add social proof and urgency toggle fields to listing table
-- This allows per-listing control of these features from the admin panel

-- Add social proof toggle field
ALTER TABLE listing ADD COLUMN social_proof_enabled BOOLEAN DEFAULT false;

-- Add urgency/scarcity toggle field  
ALTER TABLE listing ADD COLUMN urgency_enabled BOOLEAN DEFAULT false;

-- Update existing listings to have both features disabled by default
UPDATE listing SET social_proof_enabled = false WHERE social_proof_enabled IS NULL;
UPDATE listing SET urgency_enabled = false WHERE urgency_enabled IS NULL;

-- Add comments for clarity
COMMENT ON COLUMN listing.social_proof_enabled IS 'Whether to display the social proof section for this listing';
COMMENT ON COLUMN listing.urgency_enabled IS 'Whether to display the urgency/scarcity section for this listing';

-- Verify the changes
SELECT id, business_name, social_proof_enabled, urgency_enabled, show_map FROM listing LIMIT 5;
