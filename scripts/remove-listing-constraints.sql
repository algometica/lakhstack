-- Remove unique constraints from listing table
-- Run this in your Supabase SQL Editor to fix the constraint issues

-- First, let's see what constraints exist (run this first to see what we're dealing with)
-- SELECT conname, contype, pg_get_constraintdef(oid) 
-- FROM pg_constraint 
-- WHERE conrelid = 'listing'::regclass;

-- Remove unique constraint on address column (if it exists)
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conrelid = 'listing'::regclass 
        AND conname LIKE '%address%' 
        AND contype = 'u'
    ) THEN
        ALTER TABLE listing DROP CONSTRAINT IF EXISTS listing_address_key;
        RAISE NOTICE 'Removed unique constraint on address column';
    ELSE
        RAISE NOTICE 'No unique constraint found on address column';
    END IF;
END $$;

-- Remove unique constraint on created_by column (if it exists)
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conrelid = 'listing'::regclass 
        AND conname LIKE '%created_by%' 
        AND contype = 'u'
    ) THEN
        ALTER TABLE listing DROP CONSTRAINT IF EXISTS listing_created_by_key;
        RAISE NOTICE 'Removed unique constraint on created_by column';
    ELSE
        RAISE NOTICE 'No unique constraint found on created_by column';
    END IF;
END $$;

-- Remove unique constraint on coordinates column (if it exists)
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conrelid = 'listing'::regclass 
        AND conname LIKE '%coordinates%' 
        AND contype = 'u'
    ) THEN
        ALTER TABLE listing DROP CONSTRAINT IF EXISTS listing_coordinates_key;
        RAISE NOTICE 'Removed unique constraint on coordinates column';
    ELSE
        RAISE NOTICE 'No unique constraint found on coordinates column';
    END IF;
END $$;

-- Remove any other unique constraints that might be causing issues
-- (This will remove ALL unique constraints except primary key)
DO $$ 
DECLARE
    constraint_record RECORD;
BEGIN
    FOR constraint_record IN 
        SELECT conname 
        FROM pg_constraint 
        WHERE conrelid = 'listing'::regclass 
        AND contype = 'u'
        AND conname != 'listing_pkey'  -- Keep the primary key
    LOOP
        EXECUTE 'ALTER TABLE listing DROP CONSTRAINT IF EXISTS ' || constraint_record.conname;
        RAISE NOTICE 'Removed constraint: %', constraint_record.conname;
    END LOOP;
END $$;

-- Verify constraints are removed
SELECT 
    conname as constraint_name,
    contype as constraint_type,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'listing'::regclass
ORDER BY conname;
