-- Add slug field to listing table
-- Run this in Supabase SQL Editor

-- Step 1: Add the slug column
ALTER TABLE listing 
ADD COLUMN IF NOT EXISTS slug TEXT;

-- Step 2: Create a unique index on slug
CREATE UNIQUE INDEX IF NOT EXISTS idx_listing_slug ON listing(slug);

-- Step 3: Generate clean slugs for existing listings
-- This will create clean slugs like "iron-alley-gym" for business "Iron Alley Gym"
-- Only append ID if there's a conflict (handled by unique constraint)
UPDATE listing 
SET slug = LOWER(
  REGEXP_REPLACE(
    REGEXP_REPLACE(
      REGEXP_REPLACE(business_name, '[^a-zA-Z0-9\s]', '', 'g'),
      '\s+', '-', 'g'
    ),
    '^-+|-+$', '', 'g'
  )
)
WHERE slug IS NULL;

-- Step 3b: Handle conflicts by appending ID only where needed
-- This will update any slugs that violate the unique constraint
WITH conflicts AS (
  SELECT id, slug, 
         ROW_NUMBER() OVER (PARTITION BY slug ORDER BY id) as rn
  FROM listing
)
UPDATE listing 
SET slug = listing.slug || '-' || listing.id::text
FROM conflicts 
WHERE listing.id = conflicts.id 
  AND conflicts.rn > 1;

-- Step 4: Make slug NOT NULL after populating
ALTER TABLE listing 
ALTER COLUMN slug SET NOT NULL;

-- Verify the results
SELECT id, business_name, slug FROM listing LIMIT 10;
