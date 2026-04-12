"use client";

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getSupabaseClient } from '@/utils/supabase/client'
import { toast } from 'sonner'
import { extractIdFromSlug } from '@/lib/slug-utils'
import { Loader, ArrowLeft, MapPin, Phone, Globe, Instagram, Mail, Calendar, DollarSign, Factory, Filter, BadgeDollarSign, ExternalLink, Award, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import ModernImageGallery from '../_components/ModernImageGallery'
import ModernSidebar from '../_components/ModernSidebar'
import GoogleMapSection from '@/app/_components/GoogleMapSection'
import BusinessDetail from '../_components/BusinessDetail'
import BasicListingView from '../_components/BasicListingView'
import { PremiumBadge } from '@/components/ui/premium-badge'
import { getListingCategoryLabel } from '@/lib/category-taxonomy'
// Removed global feature flags - now using listing-specific flags

function ViewListingBySlug() {
 const params = useParams()
 const router = useRouter()
 const [listing, setListing] = useState(null)
 const [loading, setLoading] = useState(true)
 const [error, setError] = useState('')
 const [redirectCount, setRedirectCount] = useState(0)

 const formatDescription = (text) => {
  if (!text) return [];
  const cleaned = text.replace(/\r/g, '').trim();
  if (!cleaned) return [];
  let parts = cleaned.split(/\n{2,}|\n/).map(p => p.trim()).filter(Boolean);
  if (parts.length === 1 && parts[0].length > 280) {
   const sentences = parts[0].split(/(?<=[.!?])\s+/).filter(Boolean);
   const grouped = [];
   for (let i = 0; i < sentences.length; i += 2) {
    grouped.push(sentences.slice(i, i + 2).join(' '));
   }
   parts = grouped;
  }
  return parts;
 };

 useEffect(() => {
  if (params.slug) {
   getListingBySlug(params.slug)
  }
 }, [params.slug])

 // Add timeout to prevent infinite loading
 useEffect(() => {
  const timeout = setTimeout(() => {
   if (loading) {
    console.log('⏰ Loading timeout reached')
    setError('Loading timeout - please try again')
    setLoading(false)
   }
  }, 10000) // 10 second timeout

  return () => clearTimeout(timeout)
 }, [loading])

 const getListingBySlug = async (slug) => {
  const supabase = getSupabaseClient();
  if (!supabase) return;
  try {
   setLoading(true)
   setError('')
   console.log('🔍 Fetching listing for slug:', slug)

   let listing = null;

   // Check if the slug is actually a numeric ID (for backward compatibility)
   const isNumericId = /^\d+$/.test(slug);
   console.log('📊 Is numeric ID:', isNumericId)
   
   if (isNumericId) {
    // Handle old ID-based URLs
    console.log('🔢 Fetching by ID:', parseInt(slug))
    const { data: idData, error: idError } = await supabase
     .from('listing')
     .select('*, listing_images(url, listing_id)')
     .eq('id', parseInt(slug))
     .eq('active', true)
     .single()

    console.log('📊 ID query result:', { data: idData, error: idError })

    if (idData && !idError) {
     listing = idData;
     
     // Redirect to slug-based URL if slug exists (prevent infinite redirects)
     if (listing.slug && redirectCount < 2) {
      console.log('🔄 Redirecting to slug:', listing.slug, 'Redirect count:', redirectCount)
      setRedirectCount(prev => prev + 1)
      router.replace(`/view-listing/${listing.slug}`)
      return
     }
    }
   } else {
    // Handle slug-based URLs
    console.log('🔤 Fetching by slug:', slug)
    // First, try to find by exact slug match
    const { data: slugData, error: slugError } = await supabase
     .from('listing')
     .select('*, listing_images(url, listing_id)')
     .eq('slug', slug)
     .eq('active', true)
     .single()

    console.log('📊 Slug query result:', { data: slugData, error: slugError })

    if (slugData && !slugError) {
     listing = slugData;
    } else {
     // If not found by slug, try extracting ID from slug (for ID-suffixed slugs)
     const listingId = extractIdFromSlug(slug)
     console.log('🔍 Extracted ID from slug:', listingId)
     
     if (listingId) {
      console.log('🔢 Fetching by extracted ID:', listingId)
      const { data: idData, error: idError } = await supabase
       .from('listing')
       .select('*, listing_images(url, listing_id)')
       .eq('id', listingId)
       .eq('active', true)
       .single()

      console.log('📊 Extracted ID query result:', { data: idData, error: idError })

      if (idData && !idError) {
       listing = idData;
       
       // If we found by ID but the slug doesn't match, redirect to correct slug (prevent infinite redirects)
       if (listing.slug && listing.slug !== slug && redirectCount < 2) {
        console.log('🔄 Redirecting to correct slug:', listing.slug, 'Redirect count:', redirectCount)
        setRedirectCount(prev => prev + 1)
        router.replace(`/view-listing/${listing.slug}`)
        return
       }
      }
     }
    }
   }

   console.log('📋 Final listing result:', listing)

   if (!listing) {
    console.log('❌ No listing found')
    setError('Listing not found')
    return
   }

   console.log('✅ Setting listing data')
   setListing(listing)

  } catch (err) {
   console.error('💥 Unexpected error:', err)
   setError('Failed to load listing')
  } finally {
   console.log('🏁 Loading complete')
   setLoading(false)
  }
 }

 const descriptionParagraphs = formatDescription(listing?.description);

 if (loading) {
  return (
   <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
    <div className="text-center">
     <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
     <p className="text-muted-foreground">Loading listing...</p>
    </div>
   </div>
  )
 }

 if (error || !listing) {
  return (
   <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
    <div className="text-center max-w-md mx-auto px-6">
     <h1 className="text-2xl font-bold text-foreground mb-4">Listing Not Found</h1>
     <p className="text-muted-foreground mb-6">
      {error || 'The listing you\'re looking for doesn\'t exist or has been removed.'}
     </p>
     <Link href="/">
      <Button className="w-full">
       <ArrowLeft className="w-4 h-4 mr-2" />
       Back to Home
      </Button>
     </Link>
    </div>
   </div>
  )
 }

 return (
  <div className="min-h-screen">
   {/* Hero Section */}
   <div className="relative overflow-hidden">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(241,99,74,0.14),transparent_55%),radial-gradient(circle_at_85%_10%,rgba(24,98,97,0.10),transparent_60%)]"></div>
    
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
     {/* Back Navigation */}
     <div className="mb-8">
      <Link href="/all-listings" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm border border-border/70 text-muted-foreground hover:text-foreground hover:bg-white hover:shadow-lg transition-all duration-200">
       <ArrowLeft className="w-4 h-4" />
       Back to Vendors
      </Link>
     </div>

     {/* Business Header */}
     <div className="mb-12">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
       <div className="flex-1">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4 leading-tight">
         {listing.business_name}
        </h1>
        <div className="flex items-center gap-4 text-lg text-muted-foreground mb-6">
         <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-accent" />
          <span className="font-medium">{listing.city}, {listing.country}</span>
         </div>
         <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-foreground">Verified Business</span>
         </div>
         {listing.featured && (
          <PremiumBadge size="sm" variant="glow" />
         )}
        </div>
        {listing.business_desc && (
         <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
          {listing.business_desc}
         </p>
        )}
       </div>
      </div>
     </div>
    </div>
   </div>

   {/* Conditional Rendering: Basic vs Premium */}
   {(listing.listing_type === 'basic' || (!listing.listing_type && !listing.featured)) ? (
    <BasicListingView listing={listing} />
   ) : (
    /* Premium Listing - Full Featured View */
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
     {/* Top Section - Image Gallery */}
     <div className="mb-8">
      <ModernImageGallery imageList={listing.listing_images} />
     </div>

    {/* Mobile-First Content Flow - Optimized for Engagement */}
    <div className="space-y-6 lg:hidden">
     <div className="bg-white rounded-3xl p-6 border border-border/70 shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
      <BusinessDetail listingDetail={listing} />
     </div>

     {/* Social Proof Section - Mobile (Listing-Specific Flag) */}
     {listing?.social_proof_enabled && (
      <div className="bg-white rounded-3xl p-5 border border-border/70 shadow-[0_14px_32px_rgba(15,23,42,0.08)]">
       <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-foreground">Trusted by Community</h3>
        <div className="flex items-center gap-1">
         <div className="flex -space-x-1">
          <div className="w-6 h-6 rounded-full bg-secondary/70 border-2 border-white flex items-center justify-center text-foreground text-xs font-bold">A</div>
          <div className="w-6 h-6 rounded-full bg-secondary/70 border-2 border-white flex items-center justify-center text-foreground text-xs font-bold">B</div>
          <div className="w-6 h-6 rounded-full bg-secondary/70 border-2 border-white flex items-center justify-center text-foreground text-xs font-bold">C</div>
         </div>
         <span className="text-xs text-muted-foreground ml-2">+12</span>
        </div>
       </div>
       <div className="grid grid-cols-3 gap-3 text-center">
        <div>
         <div className="text-lg font-bold text-foreground">4.9★</div>
         <div className="text-xs text-muted-foreground">Rating</div>
        </div>
        <div>
         <div className="text-lg font-bold text-foreground">50+</div>
         <div className="text-xs text-muted-foreground">Reviews</div>
        </div>
        <div>
         <div className="text-lg font-bold text-foreground">2+</div>
         <div className="text-xs text-muted-foreground">Years</div>
        </div>
       </div>
      </div>
     )}

     {/* Business Details - Mobile Compact */}
     <div className="bg-white rounded-3xl p-5 border border-border/70 shadow-[0_14px_32px_rgba(15,23,42,0.08)]">
      <h3 className="text-lg font-bold text-foreground mb-3">Business Details</h3>
      <div className="space-y-3">
       {/* Industry & Category Row */}
       <div className="grid grid-cols-2 gap-2">
        <div className="bg-secondary/60 rounded-2xl p-3">
         <div className="flex items-center gap-1 mb-1">
         <Factory className="w-4 h-4 text-muted-foreground" />
         <span className="text-xs text-muted-foreground">Industry</span>
         </div>
         <p className="font-medium text-foreground text-sm">{listing?.industry || 'Not specified'}</p>
        </div>
        <div className="bg-secondary/60 rounded-2xl p-3">
         <div className="flex items-center gap-1 mb-1">
         <Filter className="w-4 h-4 text-muted-foreground" />
         <span className="text-xs text-muted-foreground">Category</span>
         </div>
         <p className="font-medium text-foreground text-sm">{getListingCategoryLabel(listing)}</p>
        </div>
       </div>
       
       {/* Location */}
       <div className="bg-secondary/60 rounded-2xl p-3">
        <div className="flex items-center gap-1 mb-1">
         <MapPin className="w-4 h-4 text-muted-foreground" />
         <span className="text-xs text-muted-foreground">Location</span>
        </div>
        <p className="font-medium text-foreground text-sm">{listing?.city}, {listing?.country}</p>
       </div>
      </div>
     </div>

     {/* Urgency/Scarcity Section - Mobile (Listing-Specific Flag) */}
     {listing?.urgency_enabled && (
      <div className="bg-white rounded-3xl p-5 border border-border/70 shadow-[0_14px_32px_rgba(15,23,42,0.08)]">
       <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
         <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
         <span className="text-sm font-semibold text-foreground">Limited Availability</span>
        </div>
        <span className="text-xs text-muted-foreground">This Week</span>
       </div>
       <div className="flex items-center justify-between">
        <div>
         <p className="text-sm text-muted-foreground">Only 3 spots left for this week</p>
         <p className="text-xs text-muted-foreground">Book now to secure your spot</p>
        </div>
        <Button 
         size="sm"
         className="bg-foreground text-background hover:bg-foreground/90 font-semibold px-4 py-2 rounded-full shadow-[0_10px_24px_rgba(15,23,42,0.25)] transition-all duration-300 transform hover:-translate-y-0.5"
        >
         Book Now
        </Button>
       </div>
      </div>
     )}

     {/* Key Features Section - Mobile */}
     <div className="bg-white rounded-2xl p-6 border border-border/70 shadow-lg">
      <h2 className="text-2xl font-bold text-foreground mb-6">Key Features</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
       {/* Price Range */}
       {listing?.price_range && (
        <div className="bg-secondary/60 rounded-2xl p-4 border border-border/60">
         <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-white rounded-xl border border-border/70">
           <BadgeDollarSign className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
           <p className="text-xs font-medium text-muted-foreground">Price Range</p>
           <p className="text-base font-semibold text-foreground">{listing.price_range}</p>
          </div>
         </div>
        </div>
       )}

       {/* Website */}
       {listing?.url && (
        <div className="bg-secondary/60 rounded-2xl p-4 border border-border/60">
         <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-white rounded-xl border border-border/70">
           <ExternalLink className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
           <p className="text-xs font-medium text-muted-foreground">Website</p>
           <a href={listing.url} target="_blank" rel="noopener noreferrer" 
            className="text-base font-semibold text-foreground hover:underline">
            Visit Website
           </a>
          </div>
         </div>
        </div>
       )}

       {/* Instagram */}
       {listing?.instagram_url && (
        <div className="bg-secondary/60 rounded-2xl p-4 border border-border/60">
         <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-white rounded-xl border border-border/70">
           <Instagram className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
           <p className="text-xs font-medium text-muted-foreground">Instagram</p>
           <a href={listing.instagram_url} target="_blank" rel="noopener noreferrer" 
            className="text-base font-semibold text-foreground hover:underline">
            Follow Us
           </a>
          </div>
         </div>
        </div>
       )}

       {/* Phone */}
       {listing?.phone && (
        <div className="bg-secondary/60 rounded-2xl p-4 border border-border/60">
         <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-white rounded-xl border border-border/70">
           <Phone className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
           <p className="text-xs font-medium text-muted-foreground">Phone</p>
           <a href={`tel:${listing.phone}`} 
            className="text-base font-semibold text-foreground hover:underline">
            {listing.phone}
           </a>
          </div>
         </div>
        </div>
       )}
      </div>
     </div>

     {/* Status Section - Mobile */}
     <div className="bg-white rounded-3xl p-5 border border-border/70 shadow-[0_14px_32px_rgba(15,23,42,0.08)]">
      <h3 className="text-lg font-bold text-foreground mb-3">Status</h3>
      <div className="space-y-2">
       <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-md bg-secondary/70 flex items-center justify-center">
         <Award className="w-3 h-3 text-foreground" />
        </div>
        <div>
         <p className="font-medium text-foreground text-sm">Verified Business</p>
        </div>
       </div>
       <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-md bg-secondary/70 flex items-center justify-center">
         <Clock className="w-3 h-3 text-foreground" />
        </div>
        <div>
         <p className="font-medium text-foreground text-sm">Active Listing</p>
        </div>
       </div>
      </div>
     </div>

     {/* About This Business Section */}
     {descriptionParagraphs.length > 0 && (
      <div className="bg-white rounded-3xl p-6 border border-border/70 shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
       <h2 className="text-2xl font-bold text-foreground mb-4">About This Business</h2>
       <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
        {descriptionParagraphs.map((paragraph, index) => (
         <p key={index} className={index === 0 ? "text-foreground/90 font-medium" : ""}>
          {paragraph}
         </p>
        ))}
       </div>
      </div>
     )}

     {/* Map Section - Mobile */}
     {listing.show_map && (
            <div className="bg-white rounded-3xl p-6 border border-border/70 shadow-[0_14px_32px_rgba(15,23,42,0.08)]">
              <h2 className="text-2xl font-bold text-foreground mb-4">Find On Map</h2>
              <div className="rounded-2xl overflow-hidden border border-border/70 shadow-[0_10px_24px_rgba(15,23,42,0.12)]">
                <GoogleMapSection
         coordinates={listing.coordinates}
         listing={[listing]}
        />
       </div>
      </div>
     )}

     {/* Contact Business Section - Mobile */}
          <div className="bg-white rounded-3xl p-6 border border-border/70 shadow-[0_14px_32px_rgba(15,23,42,0.08)]">
            <h2 className="text-2xl font-bold text-foreground mb-4">Contact Business</h2>
            <BusinessDetail listingDetail={listing} />
          </div>
    </div>

    {/* Desktop Layout - Grid System */}
    <div className="hidden lg:grid grid-cols-12 gap-6 lg:gap-8">
     {/* Left Content Area - Takes up more space */}
     <div className={`space-y-6 ${listing.show_map ? 'col-span-7' : 'col-span-8'}`}>
      {/* About This Business Section */}
      {descriptionParagraphs.length > 0 && (
       <div className="bg-white rounded-3xl p-6 lg:p-8 border border-border/70 shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
        <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-4 lg:mb-6">About This Business</h2>
        <div className="space-y-5 text-base lg:text-lg leading-relaxed text-muted-foreground">
         {descriptionParagraphs.map((paragraph, index) => (
          <p key={index} className={index === 0 ? "text-foreground/90 font-medium" : ""}>
           {paragraph}
          </p>
         ))}
        </div>
       </div>
      )}

      {/* Key Features Section - Desktop (when map is hidden) */}
      {!listing.show_map && (
       <div className="bg-white rounded-3xl p-6 lg:p-8 border border-border/70 shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
        <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-4 lg:mb-6">Key Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
         {/* Price Range */}
         {listing?.price_range && (
          <div className="bg-secondary/60 rounded-2xl p-4 border border-border/60">
           <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white rounded-xl border border-border/70">
             <BadgeDollarSign className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
             <p className="text-xs font-medium text-muted-foreground">Price Range</p>
             <p className="text-base font-semibold text-foreground">{listing.price_range}</p>
            </div>
           </div>
          </div>
         )}

         {/* Website */}
         {listing?.url && (
          <div className="bg-secondary/60 rounded-2xl p-4 border border-border/60">
           <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white rounded-xl border border-border/70">
             <ExternalLink className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
             <p className="text-xs font-medium text-muted-foreground">Website</p>
             <a href={listing.url} target="_blank" rel="noopener noreferrer" 
              className="text-base font-semibold text-foreground hover:underline">
              Visit Website
             </a>
            </div>
           </div>
          </div>
         )}

         {/* Instagram */}
         {listing?.instagram_url && (
          <div className="bg-secondary/60 rounded-2xl p-4 border border-border/60">
           <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white rounded-xl border border-border/70">
             <Instagram className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
             <p className="text-xs font-medium text-muted-foreground">Instagram</p>
             <a href={listing.instagram_url} target="_blank" rel="noopener noreferrer" 
              className="text-base font-semibold text-foreground hover:underline">
              Follow Us
             </a>
            </div>
           </div>
          </div>
         )}

         {/* Phone */}
         {listing?.phone && (
          <div className="bg-secondary/60 rounded-2xl p-4 border border-border/60">
           <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white rounded-xl border border-border/70">
             <Phone className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
             <p className="text-xs font-medium text-muted-foreground">Phone</p>
             <a href={`tel:${listing.phone}`} 
              className="text-base font-semibold text-foreground hover:underline">
              {listing.phone}
             </a>
            </div>
           </div>
          </div>
         )}
        </div>
       </div>
      )}

      {/* Map Section - Conditionally rendered based on show_map */}
      {listing.show_map && (
       <div className="bg-white rounded-3xl p-6 lg:p-8 border border-border/70 shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
        <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-4 lg:mb-6">Find On Map</h2>
        <div className="rounded-2xl overflow-hidden border border-border/70 shadow-[0_10px_24px_rgba(15,23,42,0.12)]">
         <GoogleMapSection
          coordinates={listing.coordinates}
          listing={[listing]}
         />
        </div>
       </div>
      )}
     </div>

     {/* Right Sidebar Area - Compact but spacious */}
     <div className={`${listing.show_map ? 'col-span-5' : 'col-span-4'}`}>
      <div className="sticky top-8">
       <ModernSidebar listingDetail={listing} />
      </div>
     </div>
    </div>

     {/* Additional Content */}
     <div className="mt-16">
      <div className="text-center py-12">
       <h2 className="text-2xl font-bold text-foreground mb-4">More Listings</h2>
       <p className="text-muted-foreground">Discover more businesses in your area</p>
       <Link href="/all-listings">
        <Button className="mt-6 bg-foreground text-background hover:bg-foreground/90 font-medium py-3 px-8 rounded-full shadow-[0_10px_24px_rgba(15,23,42,0.25)] transition-all duration-300">
         Explore All Vendors
        </Button>
       </Link>
      </div>
     </div>
    </div>
   )}
  </div>
 )
}

export default ViewListingBySlug
