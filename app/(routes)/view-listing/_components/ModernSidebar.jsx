"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
    Factory, 
    Filter, 
    MapPin, 
    MailOpen, 
    Copy, 
    Check, 
    Phone, 
    Globe, 
    Instagram,
    Star,
    Clock,
    Users,
    Award
} from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'
import { getListingUrl } from '@/lib/url-utils'

function ModernSidebar({ listingDetail }) {
    const [copied, setCopied] = useState(false);
    
    if (!listingDetail) return null;

    const seoUrl = `/view-listing/${listingDetail?.slug || listingDetail?.business_name?.toLowerCase().replace(/\s+/g, '-')}`;
    const contactEmail = listingDetail?.business_email || listingDetail?.created_by;

    const copyToClipboard = async () => {
        try {
            const fullUrl = getListingUrl(listingDetail?.slug || listingDetail?.business_name?.toLowerCase().replace(/\s+/g, '-'));
            
            await navigator.clipboard.writeText(fullUrl);
            setCopied(true);
            toast.success('URL copied successfully!');
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            toast.error('Unable to copy URL');
        }
    };

    return (
        <div className="space-y-6">
            {/* Contact Card - Primary Action */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-6 border border-blue-200 dark:border-slate-600 shadow-lg">
                <div className="text-center mb-6">
                    <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl mb-4">
                        {listingDetail.business_name?.charAt(0) || 'B'}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                        {listingDetail.full_name || 'Business Owner'}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">
                        {contactEmail}
                    </p>
                    {listingDetail?.business_email && (
                        <span className="inline-block px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded-full">
                            Business Contact
                        </span>
                    )}
                </div>
                
                <Button 
                    onClick={() => window.location.href = 'mailto:' + contactEmail}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                    <MailOpen className="w-5 h-5 mr-2" />
                    Contact Business
                </Button>
            </div>

            {/* Business Details - Compact */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-lg">
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">Business Details</h3>
                <div className="space-y-3">
                    {/* Industry & Category Row */}
                    <div className="grid grid-cols-2 gap-2">
                        <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-2">
                            <div className="flex items-center gap-1 mb-1">
                                <Factory className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                                <span className="text-xs text-slate-600 dark:text-slate-400">Industry</span>
                            </div>
                            <p className="font-medium text-slate-900 dark:text-white text-xs">{listingDetail?.industry || 'Not specified'}</p>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-2">
                            <div className="flex items-center gap-1 mb-1">
                                <Filter className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                                <span className="text-xs text-slate-600 dark:text-slate-400">Category</span>
                            </div>
                            <p className="font-medium text-slate-900 dark:text-white text-xs">{listingDetail?.category || 'Not specified'}</p>
                        </div>
                    </div>
                    
                    {/* Price Range & Years in Business Row */}
                    {(listingDetail?.price_range || listingDetail?.since) && (
                        <div className="grid grid-cols-2 gap-2">
                            {listingDetail?.price_range && (
                                <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-2">
                                    <div className="flex items-center gap-1 mb-1">
                                        <Star className="w-3 h-3 text-yellow-600 dark:text-yellow-400" />
                                        <span className="text-xs text-slate-600 dark:text-slate-400">Price</span>
                                    </div>
                                    <p className="font-medium text-slate-900 dark:text-white text-xs">{listingDetail.price_range}</p>
                                </div>
                            )}
                            {listingDetail?.since && (
                                <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-2">
                                    <div className="flex items-center gap-1 mb-1">
                                        <Clock className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                                        <span className="text-xs text-slate-600 dark:text-slate-400">Since</span>
                                    </div>
                                    <p className="font-medium text-slate-900 dark:text-white text-xs">{listingDetail.since}</p>
                                </div>
                            )}
                        </div>
                    )}
                    
                    {/* Location */}
                    <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-2">
                        <div className="flex items-center gap-1 mb-1">
                            <MapPin className="w-3 h-3 text-green-600 dark:text-green-400" />
                            <span className="text-xs text-slate-600 dark:text-slate-400">Location</span>
                        </div>
                        <p className="font-medium text-slate-900 dark:text-white text-xs">{listingDetail?.city}, {listingDetail?.country}</p>
                    </div>
                </div>
            </div>

            {/* Contact Information - Compact */}
            {(listingDetail?.phone || listingDetail?.url || listingDetail?.instagram_url) && (
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-lg">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">Contact</h3>
                    <div className="space-y-2">
                        {listingDetail?.phone && (
                            <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-700 rounded-lg">
                                <Phone className="w-4 h-4 text-green-600 dark:text-green-400" />
                                <a 
                                    href={`tel:${listingDetail.phone}`}
                                    className="font-medium text-slate-900 dark:text-white text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                >
                                    {listingDetail.phone}
                                </a>
                            </div>
                        )}
                        
                        {listingDetail?.url && (
                            <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-700 rounded-lg">
                                <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                <a 
                                    href={listingDetail.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-medium text-slate-900 dark:text-white text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate"
                                >
                                    {listingDetail.url.replace(/^https?:\/\//, '')}
                                </a>
                            </div>
                        )}
                        
                        {listingDetail?.instagram_url && (
                            <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-700 rounded-lg">
                                <Instagram className="w-4 h-4 text-pink-600 dark:text-pink-400" />
                                <a 
                                    href={listingDetail.instagram_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-medium text-slate-900 dark:text-white text-sm hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
                                >
                                    @{listingDetail.instagram_url.split('/').filter(part => part && part !== 'instagram.com').pop() || 'instagram'}
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Status & Trust Indicators - Compact */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-lg">
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">Status</h3>
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                            <Award className="w-3 h-3 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <p className="font-medium text-slate-900 dark:text-white text-xs">Verified Business</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <Clock className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <p className="font-medium text-slate-900 dark:text-white text-xs">Active Listing</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Share Section - Compact */}
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-lg">
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">Share This Business</h3>
                <div className="space-y-2">
                    <p className="text-xs text-slate-600 dark:text-slate-400">Professional listing URL:</p>
                    <div className="flex items-center gap-2">
                        <code className="flex-1 p-2 bg-white dark:bg-slate-700 rounded-lg text-xs font-mono text-slate-700 dark:text-slate-300 break-all border border-slate-200 dark:border-slate-600">
                            {getListingUrl(listingDetail?.slug || listingDetail?.business_name?.toLowerCase().replace(/\s+/g, '-'))}
                        </code>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={copyToClipboard}
                            className="shrink-0 border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 h-8 w-8 p-0"
                        >
                            {copied ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ModernSidebar
