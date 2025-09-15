-- Check for unique constraints on the listing table
-- Run this in your Supabase SQL Editor to see what constraints exist

-- Check all constraints on the listing table
SELECT 
    conname as constraint_name,
    contype as constraint_type,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'listing'::regclass
ORDER BY conname;

-- Check indexes that might be unique
SELECT 
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename = 'listing' 
AND indexdef LIKE '%UNIQUE%';

-- Check specific columns for unique constraints
SELECT 
    column_name,
    is_nullable,
    column_default,
    data_type
FROM information_schema.columns 
WHERE table_name = 'listing'
ORDER BY ordinal_position;
