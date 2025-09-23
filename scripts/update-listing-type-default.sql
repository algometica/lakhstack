-- Update the default value for listing_type column to 'basic'
-- This ensures new listings are created as basic by default

-- First, update the column default
ALTER TABLE listing ALTER COLUMN listing_type SET DEFAULT 'basic';

-- Update any existing listings that might have NULL listing_type
UPDATE listing 
SET listing_type = CASE 
    WHEN featured = true THEN 'premium'
    ELSE 'basic'
END
WHERE listing_type IS NULL;

-- Ensure all listings have a valid listing_type
UPDATE listing 
SET listing_type = 'basic' 
WHERE listing_type NOT IN ('basic', 'premium');
