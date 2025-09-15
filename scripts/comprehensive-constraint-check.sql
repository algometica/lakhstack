-- Comprehensive check for ALL unique constraints and indexes on listing table
-- Run this in your Supabase SQL Editor to find the real culprit

-- 1. Check explicit constraints (what you already ran)
SELECT 
    'CONSTRAINT' as type,
    conname as name,
    contype as constraint_type,
    pg_get_constraintdef(oid) as definition
FROM pg_constraint 
WHERE conrelid = 'listing'::regclass
ORDER BY conname;

-- 2. Check unique indexes (this is likely where the problem is!)
SELECT 
    'INDEX' as type,
    indexname as name,
    'unique' as constraint_type,
    indexdef as definition
FROM pg_indexes 
WHERE tablename = 'listing' 
AND indexdef LIKE '%UNIQUE%'
ORDER BY indexname;

-- 3. Check all indexes on the listing table
SELECT 
    'ALL_INDEXES' as type,
    indexname as name,
    CASE 
        WHEN indexdef LIKE '%UNIQUE%' THEN 'unique'
        ELSE 'regular'
    END as constraint_type,
    indexdef as definition
FROM pg_indexes 
WHERE tablename = 'listing'
ORDER BY indexname;

-- 4. Check system catalog for unique indexes
SELECT 
    'SYSTEM_CATALOG' as type,
    i.relname as name,
    CASE 
        WHEN ix.indisunique THEN 'unique'
        ELSE 'regular'
    END as constraint_type,
    pg_get_indexdef(ix.indexrelid) as definition
FROM pg_class i
JOIN pg_index ix ON i.oid = ix.indexrelid
JOIN pg_class t ON ix.indrelid = t.oid
WHERE t.relname = 'listing'
ORDER BY i.relname;
