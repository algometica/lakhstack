"use client";

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/utils/supabase/client'
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
// Removed global feature flags - now using listing-specific flags

function ViewListingBySlug() {
    const params = useParams()
    const router = useRouter()
    const [listing, setListing] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [redirectCount, setRedirectCount] = useState(0)

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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 dark:from-blue-400/5 dark:via-purple-400/5 dark:to-pink-400/5"></div>
                
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {/* Back Navigation */}
                    <div className="mb-8">
                        <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 hover:shadow-lg transition-all duration-200">
                            <ArrowLeft className="w-4 h-4" />
                            Back to Listings
                        </Link>
                    </div>

                    {/* Business Header */}
                    <div className="mb-12">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                            <div className="flex-1">
                                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">
                                    {listing.business_name}
                                </h1>
                                <div className="flex items-center gap-4 text-lg text-slate-600 dark:text-slate-400 mb-6">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        <span className="font-medium">{listing.city}, {listing.country}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                        <span className="text-sm font-medium text-green-600 dark:text-green-400">Verified Business</span>
                                    </div>
                                    {listing.featured && (
                                        <PremiumBadge size="sm" variant="glow" />
                                    )}
                                </div>
                                {listing.business_desc && (
                                    <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">
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
                    {/* Business Owner Section - Mobile Priority */}
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-6 border border-blue-200 dark:border-slate-600 shadow-lg">
                        <div className="text-center mb-6">
                            <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl mb-4">
                                {listing.business_name?.charAt(0) || 'B'}
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                                {listing.full_name || 'Business Owner'}
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">
                                {listing.business_email || listing.created_by}
                            </p>
                            {listing?.business_email && (
                                <span className="inline-block px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded-full">
                                    Business Contact
                                </span>
                            )}
                        </div>
                        
                        <Button 
                            onClick={() => window.location.href = 'mailto:' + (listing.business_email || listing.created_by)}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            <Mail className="w-5 h-5 mr-2" />
                            Contact Business
                        </Button>
                    </div>

                    {/* Social Proof Section - Mobile (Listing-Specific Flag) */}
                    {listing?.social_proof_enabled && (
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-4 border border-green-200 dark:border-green-800 shadow-lg">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Trusted by Community</h3>
                                <div className="flex items-center gap-1">
                                    <div className="flex -space-x-1">
                                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 border-2 border-white dark:border-slate-800 flex items-center justify-center text-white text-xs font-bold">A</div>
                                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-500 to-teal-600 border-2 border-white dark:border-slate-800 flex items-center justify-center text-white text-xs font-bold">B</div>
                                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 border-2 border-white dark:border-slate-800 flex items-center justify-center text-white text-xs font-bold">C</div>
                                    </div>
                                    <span className="text-xs text-slate-600 dark:text-slate-400 ml-2">+12</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-3 text-center">
                                <div>
                                    <div className="text-lg font-bold text-green-600 dark:text-green-400">4.9★</div>
                                    <div className="text-xs text-slate-600 dark:text-slate-400">Rating</div>
                                </div>
                                <div>
                                    <div className="text-lg font-bold text-blue-600 dark:text-blue-400">50+</div>
                                    <div className="text-xs text-slate-600 dark:text-slate-400">Reviews</div>
                                </div>
                                <div>
                                    <div className="text-lg font-bold text-purple-600 dark:text-purple-400">2+</div>
                                    <div className="text-xs text-slate-600 dark:text-slate-400">Years</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Business Details - Mobile Compact */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-lg">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Business Details</h3>
                        <div className="space-y-3">
                            {/* Industry & Category Row */}
                            <div className="grid grid-cols-2 gap-2">
                                <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-3">
                                    <div className="flex items-center gap-1 mb-1">
                                        <Factory className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                        <span className="text-xs text-slate-600 dark:text-slate-400">Industry</span>
                                    </div>
                                    <p className="font-medium text-slate-900 dark:text-white text-sm">{listing?.industry || 'Not specified'}</p>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-3">
                                    <div className="flex items-center gap-1 mb-1">
                                        <Filter className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                        <span className="text-xs text-slate-600 dark:text-slate-400">Category</span>
                                    </div>
                                    <p className="font-medium text-slate-900 dark:text-white text-sm">{listing?.category || 'Not specified'}</p>
                                </div>
                            </div>
                            
                            {/* Location */}
                            <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-3">
                                <div className="flex items-center gap-1 mb-1">
                                    <MapPin className="w-4 h-4 text-green-600 dark:text-green-400" />
                                    <span className="text-xs text-slate-600 dark:text-slate-400">Location</span>
                                </div>
                                <p className="font-medium text-slate-900 dark:text-white text-sm">{listing?.city}, {listing?.country}</p>
                            </div>
                        </div>
                    </div>

                    {/* Urgency/Scarcity Section - Mobile (Listing-Specific Flag) */}
                    {listing?.urgency_enabled && (
                        <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl p-4 border border-orange-200 dark:border-orange-800 shadow-lg">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                    <span className="text-sm font-semibold text-red-600 dark:text-red-400">Limited Availability</span>
                                </div>
                                <span className="text-xs text-slate-600 dark:text-slate-400">This Week</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-700 dark:text-slate-300">Only 3 spots left for this week</p>
                                    <p className="text-xs text-slate-600 dark:text-slate-400">Book now to secure your spot</p>
                                </div>
                                <Button 
                                    size="sm"
                                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                                >
                                    Book Now
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Key Features Section - Mobile */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-lg">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Key Features</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Price Range */}
                            {listing?.price_range && (
                                <div className="bg-gradient-to-br from-cyber/5 to-cyber/10 rounded-xl p-4 border border-cyber/20">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 bg-cyber/10 rounded-lg">
                                            <BadgeDollarSign className="w-5 h-5 text-cyber" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Price Range</p>
                                            <p className="text-base font-semibold text-slate-900 dark:text-white">{listing.price_range}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Website */}
                            {listing?.url && (
                                <div className="bg-gradient-to-br from-blue-500/5 to-blue-500/10 rounded-xl p-4 border border-blue-500/20">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 bg-blue-500/10 rounded-lg">
                                            <ExternalLink className="w-5 h-5 text-blue-500" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Website</p>
                                            <a href={listing.url} target="_blank" rel="noopener noreferrer" 
                                               className="text-base font-semibold text-blue-500 hover:underline">
                                                Visit Website
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Instagram */}
                            {listing?.instagram_url && (
                                <div className="bg-gradient-to-br from-pink-500/5 to-pink-500/10 rounded-xl p-4 border border-pink-500/20">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 bg-pink-500/10 rounded-lg">
                                            <Instagram className="w-5 h-5 text-pink-500" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Instagram</p>
                                            <a href={listing.instagram_url} target="_blank" rel="noopener noreferrer" 
                                               className="text-base font-semibold text-pink-500 hover:underline">
                                                Follow Us
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Phone */}
                            {listing?.phone && (
                                <div className="bg-gradient-to-br from-green-500/5 to-green-500/10 rounded-xl p-4 border border-green-500/20">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 bg-green-500/10 rounded-lg">
                                            <Phone className="w-5 h-5 text-green-500" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Phone</p>
                                            <a href={`tel:${listing.phone}`} 
                                               className="text-base font-semibold text-green-500 hover:underline">
                                                {listing.phone}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Status Section - Mobile */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-lg">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Status</h3>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-md bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                    <Award className="w-3 h-3 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                    <p className="font-medium text-slate-900 dark:text-white text-sm">Verified Business</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-md bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                    <Clock className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <p className="font-medium text-slate-900 dark:text-white text-sm">Active Listing</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* About This Business Section */}
                    {listing.description && (
                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-lg">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">About This Business</h2>
                            <div className="prose prose-lg max-w-none">
                                <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-700 rounded-xl p-4 border border-slate-200 dark:border-slate-600">
                                    {listing.description}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Map Section - Mobile */}
                    {listing.show_map && (
                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-lg">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Find On Map</h2>
                            <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-600 shadow-lg">
                                <GoogleMapSection
                                    coordinates={listing.coordinates}
                                    listing={[listing]}
                                />
                            </div>
                        </div>
                    )}

                    {/* Contact Business Section - Mobile */}
                    <div className="bg-gradient-to-br from-muted/30 to-muted/10 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-lg">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Contact Business</h2>
                        <BusinessDetail listingDetail={listing} />
                    </div>
                </div>

                {/* Desktop Layout - Grid System */}
                <div className="hidden lg:grid grid-cols-12 gap-6 lg:gap-8">
                    {/* Left Content Area - Takes up more space */}
                    <div className={`space-y-6 ${listing.show_map ? 'col-span-7' : 'col-span-8'}`}>
                        {/* About This Business Section */}
                        {listing.description && (
                            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 lg:p-8 border border-slate-200 dark:border-slate-700 shadow-lg">
                                <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white mb-4 lg:mb-6">About This Business</h2>
                                <div className="prose prose-lg max-w-none">
                                    <p className="text-base lg:text-lg leading-relaxed text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-700 rounded-xl p-4 lg:p-6 border border-slate-200 dark:border-slate-600">
                                        {listing.description}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Key Features Section - Desktop (when map is hidden) */}
                        {!listing.show_map && (
                            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 lg:p-8 border border-slate-200 dark:border-slate-700 shadow-lg">
                                <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white mb-4 lg:mb-6">Key Features</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                                    {/* Price Range */}
                                    {listing?.price_range && (
                                        <div className="bg-gradient-to-br from-cyber/5 to-cyber/10 rounded-xl p-4 border border-cyber/20">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="p-2 bg-cyber/10 rounded-lg">
                                                    <BadgeDollarSign className="w-5 h-5 text-cyber" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Price Range</p>
                                                    <p className="text-base font-semibold text-slate-900 dark:text-white">{listing.price_range}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Website */}
                                    {listing?.url && (
                                        <div className="bg-gradient-to-br from-blue-500/5 to-blue-500/10 rounded-xl p-4 border border-blue-500/20">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="p-2 bg-blue-500/10 rounded-lg">
                                                    <ExternalLink className="w-5 h-5 text-blue-500" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Website</p>
                                                    <a href={listing.url} target="_blank" rel="noopener noreferrer" 
                                                       className="text-base font-semibold text-blue-500 hover:underline">
                                                        Visit Website
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Instagram */}
                                    {listing?.instagram_url && (
                                        <div className="bg-gradient-to-br from-pink-500/5 to-pink-500/10 rounded-xl p-4 border border-pink-500/20">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="p-2 bg-pink-500/10 rounded-lg">
                                                    <Instagram className="w-5 h-5 text-pink-500" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Instagram</p>
                                                    <a href={listing.instagram_url} target="_blank" rel="noopener noreferrer" 
                                                       className="text-base font-semibold text-pink-500 hover:underline">
                                                        Follow Us
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Phone */}
                                    {listing?.phone && (
                                        <div className="bg-gradient-to-br from-green-500/5 to-green-500/10 rounded-xl p-4 border border-green-500/20">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="p-2 bg-green-500/10 rounded-lg">
                                                    <Phone className="w-5 h-5 text-green-500" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Phone</p>
                                                    <a href={`tel:${listing.phone}`} 
                                                       className="text-base font-semibold text-green-500 hover:underline">
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
                            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 lg:p-8 border border-slate-200 dark:border-slate-700 shadow-lg">
                                <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white mb-4 lg:mb-6">Find On Map</h2>
                                <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-600 shadow-lg">
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
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">More Listings</h2>
                            <p className="text-slate-600 dark:text-slate-400">Discover more businesses in your area</p>
                            <Link href="/all-listings">
                                <Button className="mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                                    Explore All Listings
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
