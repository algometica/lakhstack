"use client";

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/utils/supabase/client'
import { toast } from 'sonner'
import { extractIdFromSlug } from '@/lib/slug-utils'
import { Loader, ArrowLeft, MapPin, Phone, Globe, Instagram, Mail, Calendar, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import ModernImageGallery from '../_components/ModernImageGallery'
import ModernSidebar from '../_components/ModernSidebar'
import GoogleMapSection from '@/app/_components/GoogleMapSection'

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

            {/* Main Content - Flexible Layout */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Top Section - Image Gallery */}
                <div className="mb-8">
                    <ModernImageGallery imageList={listing.listing_images} />
                </div>

                {/* Content Grid - Responsive and Flexible */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
                    {/* Left Content Area - Takes up more space */}
                    <div className="lg:col-span-7 space-y-6">
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

                        {/* Map Section - Full width in left area */}
                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 lg:p-8 border border-slate-200 dark:border-slate-700 shadow-lg">
                            <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white mb-4 lg:mb-6">Find On Map</h2>
                            <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-600 shadow-lg">
                                <GoogleMapSection
                                    coordinates={listing.coordinates}
                                    listing={[listing]}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar Area - Compact but spacious */}
                    <div className="lg:col-span-5">
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
        </div>
    )
}

export default ViewListingBySlug
