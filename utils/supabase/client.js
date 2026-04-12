
"use client";

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_API_KEY;

let supabaseClient = null;

export const getSupabaseClient = () => {
  if (typeof window === 'undefined') return null;
  if (supabaseClient) return supabaseClient;
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase env vars are missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_API_KEY in .env.local.');
  }
  supabaseClient = createClient(supabaseUrl, supabaseKey);
  return supabaseClient;
};
