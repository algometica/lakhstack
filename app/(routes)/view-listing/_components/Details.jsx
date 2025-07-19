
import GoogleMapSection from '@/app/_components/GoogleMapSection'
import { Button } from '@/components/ui/button'
import { BadgeDollarSign, ExternalLink, Factory, Filter, Instagram, MapPin, Phone } from 'lucide-react'

import React from 'react'
import BusinessDetail from './BusinessDetail'
import ImageCarousel from './ImageCarousel'

function Details({ listingDetail }) {
    return listingDetail && (
        <div className='p-6 sm:p-8 lg:p-12'>
            {/* Header Section */}
            <div className='mb-8 sm:mb-12'>
                <div className='flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4 sm:gap-6'>
                    <div className='flex-1'>
                        <h1 className='text-3xl sm:text-4xl lg:text-5xl font-black text-foreground leading-tight mb-4'>
                            {listingDetail?.business_name}
                        </h1>
                        <div className='flex items-center gap-2 sm:gap-3 text-base sm:text-lg lg:text-xl text-muted-foreground mb-4 sm:mb-6'>
                            <MapPin className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-primary flex-shrink-0" />
                            <span className="font-medium">{listingDetail.city}, {listingDetail.country}</span>
                        </div>
                        
                        {/* Status Badge */}
                        <div className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-cyber/10 text-cyber text-sm sm:text-base font-semibold">
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-cyber rounded-full mr-2 animate-pulse"></div>
                            Verified Business
                        </div>
                    </div>
                </div>
            </div>

            {/* Divider */}
            <div className='w-full h-px bg-gradient-to-r from-transparent via-border to-transparent mb-8 sm:mb-12'></div>

            {/* Image Gallery Section */}
            <div className='mb-12 sm:mb-16'>
                <h2 className='text-2xl sm:text-3xl font-bold text-foreground mb-6 sm:mb-8'>Photo Gallery</h2>
                <ImageCarousel imageList={listingDetail?.listing_images} />
            </div>

            {/* Divider */}
            <div className='w-full h-px bg-gradient-to-r from-transparent via-border to-transparent mb-8 sm:mb-12'></div>
            {/* Key Features Section */}
            <div className='mb-12 sm:mb-16'>
                <h2 className='text-2xl sm:text-3xl font-bold text-foreground mb-6 sm:mb-8'>Business Details</h2>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'>
                    
                    {/* Industry */}
                    <div className='group bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg'>
                        <div className='flex items-center gap-3 sm:gap-4 mb-2 sm:mb-3'>
                            <div className='p-2 sm:p-3 bg-primary/10 rounded-lg sm:rounded-xl group-hover:bg-primary/20 transition-colors'>
                                <Factory className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                            </div>
                            <div>
                                <p className='text-xs sm:text-sm font-medium text-muted-foreground'>Industry</p>
                                <p className='text-base sm:text-lg font-semibold text-foreground'>{listingDetail?.industry}</p>
                            </div>
                        </div>
                    </div>

                    {/* Category */}
                    <div className='group bg-gradient-to-br from-neural/5 to-neural/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-neural/20 hover:border-neural/40 transition-all duration-300 hover:shadow-lg'>
                        <div className='flex items-center gap-3 sm:gap-4 mb-2 sm:mb-3'>
                            <div className='p-2 sm:p-3 bg-neural/10 rounded-lg sm:rounded-xl group-hover:bg-neural/20 transition-colors'>
                                <Filter className="w-5 h-5 sm:w-6 sm:h-6 text-neural" />
                            </div>
                            <div>
                                <p className='text-xs sm:text-sm font-medium text-muted-foreground'>Category</p>
                                <p className='text-base sm:text-lg font-semibold text-foreground'>{listingDetail?.category}</p>
                            </div>
                        </div>
                    </div>

                    {/* Price Range */}
                    <div className='group bg-gradient-to-br from-cyber/5 to-cyber/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-cyber/20 hover:border-cyber/40 transition-all duration-300 hover:shadow-lg'>
                        <div className='flex items-center gap-3 sm:gap-4 mb-2 sm:mb-3'>
                            <div className='p-2 sm:p-3 bg-cyber/10 rounded-lg sm:rounded-xl group-hover:bg-cyber/20 transition-colors'>
                                <BadgeDollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-cyber" />
                            </div>
                            <div>
                                <p className='text-xs sm:text-sm font-medium text-muted-foreground'>Price Range</p>
                                <p className='text-base sm:text-lg font-semibold text-foreground'>{listingDetail?.price_range}</p>
                            </div>
                        </div>
                    </div>

                    {/* Website */}
                    {listingDetail?.url && (
                        <div className='group bg-gradient-to-br from-premium/5 to-premium/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-premium/20 hover:border-premium/40 transition-all duration-300 hover:shadow-lg'>
                            <div className='flex items-center gap-3 sm:gap-4 mb-2 sm:mb-3'>
                                <div className='p-2 sm:p-3 bg-premium/10 rounded-lg sm:rounded-xl group-hover:bg-premium/20 transition-colors'>
                                    <ExternalLink className="w-5 h-5 sm:w-6 sm:h-6 text-premium" />
                                </div>
                                <div>
                                    <p className='text-xs sm:text-sm font-medium text-muted-foreground'>Website</p>
                                    <a href={listingDetail?.url} target="_blank" rel="noopener noreferrer" 
                                       className='text-base sm:text-lg font-semibold text-premium hover:underline'>
                                        Visit Website
                                    </a>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Instagram */}
                    {listingDetail?.instagram_url && (
                        <div className='group bg-gradient-to-br from-pink-500/5 to-pink-500/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-pink-500/20 hover:border-pink-500/40 transition-all duration-300 hover:shadow-lg'>
                            <div className='flex items-center gap-3 sm:gap-4 mb-2 sm:mb-3'>
                                <div className='p-2 sm:p-3 bg-pink-500/10 rounded-lg sm:rounded-xl group-hover:bg-pink-500/20 transition-colors'>
                                    <Instagram className="w-5 h-5 sm:w-6 sm:h-6 text-pink-500" />
                                </div>
                                <div>
                                    <p className='text-xs sm:text-sm font-medium text-muted-foreground'>Instagram</p>
                                    <a href={listingDetail?.instagram_url} target="_blank" rel="noopener noreferrer" 
                                       className='text-base sm:text-lg font-semibold text-pink-500 hover:underline'>
                                        Follow Us
                                    </a>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Phone */}
                    {listingDetail?.phone && (
                        <div className='group bg-gradient-to-br from-green-500/5 to-green-500/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-green-500/20 hover:border-green-500/40 transition-all duration-300 hover:shadow-lg'>
                            <div className='flex items-center gap-3 sm:gap-4 mb-2 sm:mb-3'>
                                <div className='p-2 sm:p-3 bg-green-500/10 rounded-lg sm:rounded-xl group-hover:bg-green-500/20 transition-colors'>
                                    <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
                                </div>
                                <div>
                                    <p className='text-xs sm:text-sm font-medium text-muted-foreground'>Phone</p>
                                    <a href={`tel:${listingDetail?.phone}`} 
                                       className='text-base sm:text-lg font-semibold text-green-500 hover:underline break-all'>
                                        {listingDetail?.phone}
                                    </a>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
            {/* About Section */}
            <div className='mb-12 sm:mb-16'>
                <h2 className='text-2xl sm:text-3xl font-bold text-foreground mb-4 sm:mb-6'>About This Business</h2>
                <div className='prose prose-lg max-w-none'>
                    <p className='text-base sm:text-lg leading-relaxed text-foreground/80 bg-muted/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border border-border/50'>
                        {listingDetail?.description}
                    </p>
                </div>
            </div>

            {/* Location Section */}
            <div className='mb-12 sm:mb-16'>
                <h2 className='text-2xl sm:text-3xl font-bold text-foreground mb-4 sm:mb-6'>Find On Map</h2>
                <div className='rounded-xl sm:rounded-2xl overflow-hidden border border-border/50 shadow-lg'>
                    <GoogleMapSection
                        coordinates={listingDetail.coordinates}
                        listing={[listingDetail]}
                    />
                </div>
            </div>

            {/* Contact Section */}
            <div className='mb-6 sm:mb-8'>
                <h2 className='text-2xl sm:text-3xl font-bold text-foreground mb-4 sm:mb-6'>Contact Business</h2>
                <div className='bg-gradient-to-br from-muted/30 to-muted/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border border-border/50'>
                    <BusinessDetail listingDetail={listingDetail} />
                </div>
            </div>
        </div>
    )
}

export default Details