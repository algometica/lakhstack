#!/usr/bin/env node

/**
 * Script to add slug field to existing listings
 * This will generate slugs for all existing listings in the database
 */

import { createClient } from '@supabase/supabase-js';
import { generateListingSlug } from '../lib/slug-utils.js';

// Load environment variables
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:');
  console.error('   NEXT_PUBLIC_SUPABASE_URL');
  console.error('   SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function addSlugField() {
  try {
    console.log('🔄 Adding slug field to listing table...');
    
    // First, add the slug column if it doesn't exist
    const { error: alterError } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE listing 
        ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;
      `
    });
    
    if (alterError) {
      console.error('❌ Error adding slug column:', alterError);
      return;
    }
    
    console.log('✅ Slug column added successfully');
    
    // Get all existing listings without slugs
    const { data: listings, error: fetchError } = await supabase
      .from('listing')
      .select('id, business_name, slug')
      .is('slug', null);
    
    if (fetchError) {
      console.error('❌ Error fetching listings:', fetchError);
      return;
    }
    
    if (!listings || listings.length === 0) {
      console.log('✅ No listings need slug generation');
      return;
    }
    
    console.log(`🔄 Generating slugs for ${listings.length} listings...`);
    
    // Generate and update slugs for each listing
    for (const listing of listings) {
      const slug = generateListingSlug(listing.business_name, listing.id);
      
      const { error: updateError } = await supabase
        .from('listing')
        .update({ slug })
        .eq('id', listing.id);
      
      if (updateError) {
        console.error(`❌ Error updating slug for listing ${listing.id}:`, updateError);
      } else {
        console.log(`✅ Generated slug: ${slug} for "${listing.business_name}"`);
      }
    }
    
    console.log('🎉 Slug generation completed successfully!');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the script
addSlugField();
