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
import { getListingCategoryLabel } from '@/lib/category-taxonomy'

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
            <div className="bg-white rounded-3xl p-6 border border-border/70 shadow-[0_18px_40px_rgba(15,23,42,0.10)]">
                <div className="text-center mb-6">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-secondary/70 flex items-center justify-center text-foreground font-bold text-xl mb-4">
                        {listingDetail.business_name?.charAt(0) || 'B'}
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-1">
                        {listingDetail.full_name || 'Business Owner'}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-3">
                        {contactEmail}
                    </p>
                    {listingDetail?.business_email && (
                        <span className="inline-block px-3 py-1 bg-secondary/70 text-foreground text-xs font-medium rounded-full">
                            Business Contact
                        </span>
                    )}
                </div>

                <Button 
                    onClick={() => window.location.href = 'mailto:' + contactEmail}
                    className="w-full bg-foreground text-background hover:bg-foreground/90 font-semibold py-3 rounded-2xl shadow-[0_10px_24px_rgba(15,23,42,0.18)]"
                >
                    <MailOpen className="w-5 h-5 mr-2" />
                    Contact Business
                </Button>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-border/70 shadow-[0_14px_32px_rgba(15,23,42,0.08)]">
                <h3 className="text-base font-bold text-foreground mb-3">Business Details</h3>
                <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                        <div className="bg-secondary/60 rounded-2xl p-3">
                            <div className="flex items-center gap-1 mb-1">
                                <Factory className="w-3 h-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">Industry</span>
                            </div>
                            <p className="font-medium text-foreground text-xs">{listingDetail?.industry || 'Not specified'}</p>
                        </div>
                        <div className="bg-secondary/60 rounded-2xl p-3">
                            <div className="flex items-center gap-1 mb-1">
                                <Filter className="w-3 h-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">Category</span>
                            </div>
                            <p className="font-medium text-foreground text-xs">{getListingCategoryLabel(listingDetail)}</p>
                        </div>
                    </div>

                    {(listingDetail?.price_range || listingDetail?.since) && (
                        <div className="grid grid-cols-2 gap-2">
                            {listingDetail?.price_range && (
                                <div className="bg-secondary/60 rounded-2xl p-3">
                                    <div className="flex items-center gap-1 mb-1">
                                        <Star className="w-3 h-3 text-muted-foreground" />
                                        <span className="text-xs text-muted-foreground">Price</span>
                                    </div>
                                    <p className="font-medium text-foreground text-xs">{listingDetail.price_range}</p>
                                </div>
                            )}
                            {listingDetail?.since && (
                                <div className="bg-secondary/60 rounded-2xl p-3">
                                    <div className="flex items-center gap-1 mb-1">
                                        <Clock className="w-3 h-3 text-muted-foreground" />
                                        <span className="text-xs text-muted-foreground">Since</span>
                                    </div>
                                    <p className="font-medium text-foreground text-xs">{listingDetail.since}</p>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="bg-secondary/60 rounded-2xl p-3">
                        <div className="flex items-center gap-1 mb-1">
                            <MapPin className="w-3 h-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">Location</span>
                        </div>
                        <p className="font-medium text-foreground text-xs">{listingDetail?.city}, {listingDetail?.country}</p>
                    </div>
                </div>
            </div>

            {(listingDetail?.phone || listingDetail?.url || listingDetail?.instagram_url) && (
                <div className="bg-white rounded-3xl p-5 border border-border/70 shadow-[0_14px_32px_rgba(15,23,42,0.08)]">
                    <h3 className="text-base font-bold text-foreground mb-3">Contact</h3>
                    <div className="space-y-2">
                        {listingDetail?.phone && (
                            <div className="flex items-center gap-2 p-3 bg-secondary/60 rounded-2xl">
                                <Phone className="w-4 h-4 text-muted-foreground" />
                                <a 
                                    href={`tel:${listingDetail.phone}`}
                                    className="font-medium text-foreground text-sm hover:text-accent transition-colors"
                                >
                                    {listingDetail.phone}
                                </a>
                            </div>
                        )}
                        
                        {listingDetail?.url && (
                            <div className="flex items-center gap-2 p-3 bg-secondary/60 rounded-2xl">
                                <Globe className="w-4 h-4 text-muted-foreground" />
                                <a 
                                    href={listingDetail.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-medium text-foreground text-sm hover:text-accent transition-colors truncate"
                                >
                                    {listingDetail.url.replace(/^https?:\/\//, '')}
                                </a>
                            </div>
                        )}
                        
                        {listingDetail?.instagram_url && (
                            <div className="flex items-center gap-2 p-3 bg-secondary/60 rounded-2xl">
                                <Instagram className="w-4 h-4 text-muted-foreground" />
                                <a 
                                    href={listingDetail.instagram_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-medium text-foreground text-sm hover:text-accent transition-colors"
                                >
                                    @{listingDetail.instagram_url.split('/').filter(part => part && part !== 'instagram.com').pop() || 'instagram'}
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="bg-white rounded-3xl p-5 border border-border/70 shadow-[0_14px_32px_rgba(15,23,42,0.08)]">
                <h3 className="text-base font-bold text-foreground mb-3">Status</h3>
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-secondary/70 flex items-center justify-center">
                            <Award className="w-3 h-3 text-foreground" />
                        </div>
                        <div>
                            <p className="font-medium text-foreground text-xs">Verified Business</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-secondary/70 flex items-center justify-center">
                            <Clock className="w-3 h-3 text-foreground" />
                        </div>
                        <div>
                            <p className="font-medium text-foreground text-xs">Active Listing</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-border/70 shadow-[0_14px_32px_rgba(15,23,42,0.08)]">
                <h3 className="text-base font-bold text-foreground mb-3">Share This Business</h3>
                <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">Listing URL</p>
                    <div className="flex items-center gap-2">
                        <code className="flex-1 p-3 bg-secondary/60 rounded-2xl text-xs font-mono text-foreground break-all border border-border/60">
                            {getListingUrl(listingDetail?.slug || listingDetail?.business_name?.toLowerCase().replace(/\s+/g, '-'))}
                        </code>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={copyToClipboard}
                            className="shrink-0 h-9 w-9 p-0"
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
