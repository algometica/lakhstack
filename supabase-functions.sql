-- PostgreSQL function for geographical distance filtering
-- Run this in your Supabase SQL editor

CREATE OR REPLACE FUNCTION get_listings_within_radius(
    search_lat FLOAT,
    search_lng FLOAT,
    radius_km FLOAT DEFAULT 50
)
RETURNS TABLE(
    id BIGINT,
    created_at TIMESTAMP WITH TIME ZONE,
    business_name TEXT,
    business_desc TEXT,
    address TEXT,
    contact TEXT,
    website TEXT,
    youtube TEXT,
    coordinates JSON,
    category TEXT,
    industry TEXT,
    active BOOLEAN,
    featured BOOLEAN,
    listing_images JSON
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        l.id,
        l.created_at,
        l.business_name,
        l.business_desc,
        l.address,
        l.contact,
        l.website,
        l.youtube,
        l.coordinates,
        l.category,
        l.industry,
        l.active,
        l.featured,
        COALESCE(
            json_agg(
                json_build_object(
                    'url', li.url,
                    'listing_id', li.listing_id
                )
            ) FILTER (WHERE li.id IS NOT NULL),
            '[]'::json
        ) as listing_images
    FROM listing l
    LEFT JOIN listing_images li ON l.id = li.listing_id
    WHERE l.active = true
    AND l.coordinates IS NOT NULL
    AND (l.coordinates->>'lat')::FLOAT IS NOT NULL
    AND (l.coordinates->>'lng')::FLOAT IS NOT NULL
    AND (
        6371 * acos(
            cos(radians(search_lat)) * 
            cos(radians((l.coordinates->>'lat')::FLOAT)) * 
            cos(radians((l.coordinates->>'lng')::FLOAT) - radians(search_lng)) + 
            sin(radians(search_lat)) * 
            sin(radians((l.coordinates->>'lat')::FLOAT))
        )
    ) <= radius_km
    GROUP BY l.id, l.created_at, l.business_name, l.business_desc, l.address, 
             l.contact, l.website, l.youtube, l.coordinates, l.category, 
             l.industry, l.active, l.featured
    ORDER BY (
        6371 * acos(
            cos(radians(search_lat)) * 
            cos(radians((l.coordinates->>'lat')::FLOAT)) * 
            cos(radians((l.coordinates->>'lng')::FLOAT) - radians(search_lng)) + 
            sin(radians(search_lat)) * 
            sin(radians((l.coordinates->>'lat')::FLOAT))
        )
    ) ASC;
END;
$$ LANGUAGE plpgsql;