"use client";

import React from 'react'
import { MapPin, Factory, Filter, CheckCircle, ArrowLeft } from 'lucide-react'
import ModernImageGallery from './ModernImageGallery'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

function BasicListingView({ listing }) {
    if (!listing) return null

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Back Button */}
            <div className="mb-6">
                <Link href="/all-listings">
                    <Button variant="ghost" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Listings
                    </Button>
                </Link>
            </div>

            {/* Business Name */}
            <div className="text-center mb-8">
                <h1 className="text-4xl sm:text-5xl font-black text-foreground leading-tight mb-4">
                    {listing.business_name}
                </h1>
                
                {/* Location */}
                <div className="flex items-center justify-center gap-2 text-lg text-muted-foreground mb-4">
                    <MapPin className="w-5 h-5 text-primary" />
                    <span className="font-medium">{listing.city}, {listing.country}</span>
                </div>
                
                {/* Verification Badge */}
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-semibold">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Verified Business
                </div>
            </div>

            {/* Photo Gallery */}
            <div className="mb-12">
                <ModernImageGallery imageList={listing.listing_images} />
            </div>

            {/* Business Details Section */}
            <div className="bg-card rounded-2xl p-6 border border-border shadow-lg">
                <h2 className="text-2xl font-bold text-foreground mb-6">Business Details</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Industry */}
                    <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-xl">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Factory className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Industry</p>
                            <p className="font-semibold text-foreground capitalize">
                                {listing.industry?.replace('-', ' ') || 'Not specified'}
                            </p>
                        </div>
                    </div>

                    {/* Category */}
                    <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-xl">
                        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Filter className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Category</p>
                            <p className="font-semibold text-foreground capitalize">
                                {listing.category?.replace('-', ' ') || 'Not specified'}
                            </p>
                        </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-xl sm:col-span-2">
                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                            <MapPin className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Location</p>
                            <p className="font-semibold text-foreground">
                                {listing.city}, {listing.country}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Upgrade to Premium CTA */}
            <div className="mt-8 text-center">
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-6 border border-primary/20">
                    <h3 className="text-xl font-bold text-foreground mb-2">Want More Features?</h3>
                    <p className="text-muted-foreground mb-4">
                        Upgrade to Premium to get contact information, business description, map location, and more!
                    </p>
                    <Button 
                        className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-lg hover:shadow-pink-500/25 transition-all duration-300"
                        onClick={() => {
                            const subject = encodeURIComponent('Premium Listing Upgrade Request');
                            const body = encodeURIComponent(`Hi LakhStack Team,

I'm interested in upgrading my listing "${listing.business_name}" to Premium.

Please let me know about:
- Pricing information
- Available features
- How to proceed with the upgrade

Thank you!

Best regards,
[Your Name]`);
                            window.location.href = `mailto:lakhstack@gmail.com?subject=${subject}&body=${body}`;
                        }}
                    >
                        Upgrade to Premium
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default BasicListingView
