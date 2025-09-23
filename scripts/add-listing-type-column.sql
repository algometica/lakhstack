-- Add listing_type column to the listing table
-- This column will determine if a listing is 'basic' or 'premium'

-- Add the listing_type column with default value 'basic'
ALTER TABLE listing 
ADD COLUMN listing_type TEXT DEFAULT 'basic' CHECK (listing_type IN ('basic', 'premium'));

-- Update existing listings to set listing_type based on featured status
-- Featured listings become premium, non-featured become basic
UPDATE listing 
SET listing_type = CASE 
    WHEN featured = true THEN 'premium'
    ELSE 'basic'
END;

-- Create an index for better performance on listing_type queries
CREATE INDEX idx_listing_type ON listing(listing_type);

-- Create a composite index for common queries
CREATE INDEX idx_listing_type_active ON listing(listing_type, active);

-- Add comment to document the field
COMMENT ON COLUMN listing.listing_type IS 'Determines listing view type: basic (limited features) or premium (full features)';
