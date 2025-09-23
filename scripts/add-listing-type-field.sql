-- Add listing_type field to support Basic vs Premium listings
-- This field will determine which view to show for each listing

-- Add the listing_type column with default value 'basic' for new listings
ALTER TABLE listing 
ADD COLUMN IF NOT EXISTS listing_type TEXT DEFAULT 'basic' CHECK (listing_type IN ('basic', 'premium'));

-- Update existing listings to set listing_type based on featured status
-- Featured listings become premium, non-featured become basic
UPDATE listing 
SET listing_type = CASE 
    WHEN featured = true THEN 'premium'
    ELSE 'basic'
END
WHERE listing_type IS NULL;

-- Create an index for better performance on listing_type queries
CREATE INDEX IF NOT EXISTS idx_listing_type ON listing(listing_type);

-- Create a composite index for common queries
CREATE INDEX IF NOT EXISTS idx_listing_type_active ON listing(listing_type, active);

-- Add comment to document the field
COMMENT ON COLUMN listing.listing_type IS 'Determines listing view type: basic (limited features) or premium (full features)';
