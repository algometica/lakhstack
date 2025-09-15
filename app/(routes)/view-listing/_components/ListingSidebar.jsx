"use client"

import { Button } from '@/components/ui/button'
import { BadgeDollarSign, Factory, Filter, MapPin, Phone, MailOpen, Copy, Check } from 'lucide-react'
import React, { useState } from 'react'
import BusinessDetail from './BusinessDetail'
import { toast } from 'sonner'

function ListingSidebar({ listingDetail }) {
    const [copied, setCopied] = useState(false);
    
    if (!listingDetail) return null;

    const seoUrl = `/view-listing/${listingDetail?.slug || listingDetail?.business_name?.toLowerCase().replace(/\s+/g, '-')}`;

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(window.location.origin + seoUrl);
            setCopied(true);
            toast.success('URL copied to clipboard!');
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            toast.error('Failed to copy URL');
        }
    };

    return (
        <div className="space-y-6">
            {/* SEO URL Display */}
            <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
                <h3 className="text-lg font-semibold text-foreground mb-4">Share This Listing</h3>
                <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">SEO-friendly URL:</p>
                    <div className="flex items-center gap-2">
                        <code className="flex-1 p-3 bg-muted rounded-lg text-sm font-mono text-foreground break-all">
                            {seoUrl}
                        </code>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={copyToClipboard}
                            className="shrink-0"
                        >
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Business Contact */}
            <BusinessDetail listingDetail={listingDetail} />
            
            {/* Business Information */}
            <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
                <h3 className="text-lg font-semibold text-foreground mb-4">Business Information</h3>
                
                <div className="space-y-4">
                    {/* Industry */}
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Factory className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Industry</p>
                            <p className="font-medium text-foreground">{listingDetail?.industry || 'Not specified'}</p>
                        </div>
                    </div>

                    {/* Category */}
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Filter className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Category</p>
                            <p className="font-medium text-foreground">{listingDetail?.category || 'Not specified'}</p>
                        </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <MapPin className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Location</p>
                            <p className="font-medium text-foreground">{listingDetail?.city}, {listingDetail?.country}</p>
                        </div>
                    </div>

                    {/* Address */}
                    {listingDetail?.address && (
                        <div className="pt-2">
                            <p className="text-sm text-muted-foreground">Address</p>
                            <p className="text-sm text-foreground">{listingDetail.address}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Business Description */}
            {listingDetail?.business_desc && (
                <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
                    <h3 className="text-lg font-semibold text-foreground mb-4">About This Business</h3>
                    <p className="text-muted-foreground leading-relaxed">{listingDetail.business_desc}</p>
                </div>
            )}
        </div>
    )
}

export default ListingSidebar
