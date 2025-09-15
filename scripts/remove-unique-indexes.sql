-- Remove unique indexes that might be causing the constraint violation
-- Run this in your Supabase SQL Editor after running the comprehensive check

-- First, let's see what unique indexes exist
SELECT 
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename = 'listing' 
AND indexdef LIKE '%UNIQUE%';

-- Remove common unique indexes that might be causing issues
-- (Only run these if the above query shows they exist)

-- Remove unique index on address column
DROP INDEX IF EXISTS idx_listing_address_unique;
DROP INDEX IF EXISTS listing_address_key;
DROP INDEX IF EXISTS listing_address_idx;

-- Remove unique index on created_by column  
DROP INDEX IF EXISTS idx_listing_created_by_unique;
DROP INDEX IF EXISTS listing_created_by_key;
DROP INDEX IF EXISTS listing_created_by_idx;

-- Remove unique index on coordinates column
DROP INDEX IF EXISTS idx_listing_coordinates_unique;
DROP INDEX IF EXISTS listing_coordinates_key;
DROP INDEX IF EXISTS listing_coordinates_idx;

-- Remove unique index on slug column (if it exists and is causing issues)
DROP INDEX IF EXISTS idx_listing_slug_unique;
DROP INDEX IF EXISTS listing_slug_key;
DROP INDEX IF EXISTS listing_slug_idx;

-- Generic approach: Remove ALL unique indexes except primary key
DO $$ 
DECLARE
    index_record RECORD;
BEGIN
    FOR index_record IN 
        SELECT indexname
        FROM pg_indexes 
        WHERE tablename = 'listing' 
        AND indexdef LIKE '%UNIQUE%'
        AND indexname NOT LIKE '%pkey%'  -- Keep primary key
    LOOP
        EXECUTE 'DROP INDEX IF EXISTS ' || index_record.indexname;
        RAISE NOTICE 'Dropped unique index: %', index_record.indexname;
    END LOOP;
END $$;

-- Verify all unique indexes are removed
SELECT 
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename = 'listing' 
AND indexdef LIKE '%UNIQUE%';
