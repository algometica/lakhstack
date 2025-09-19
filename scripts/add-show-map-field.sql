-- Add show_map field to listing table
ALTER TABLE listing ADD COLUMN show_map BOOLEAN DEFAULT false;

-- Update existing listings to have show_map = false by default
UPDATE listing SET show_map = false WHERE show_map IS NULL;

-- Add comment for clarity
COMMENT ON COLUMN listing.show_map IS 'Whether to display the map section for this listing';
