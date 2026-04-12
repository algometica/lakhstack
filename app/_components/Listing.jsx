import { Factory, Filter, MapPin, Search } from 'lucide-react'
import Image from 'next/image'
import React, { useState } from 'react'
import GoogleAddressSearch from './GoogleAddressSearch'
import { Button } from '@/components/ui/button'
import FilterSection from './FilterSection'
import { PremiumIcon } from '@/components/ui/premium-badge'
import Link from 'next/link'
import { getListingCategoryLabel } from '@/lib/category-taxonomy'

function Listing({ listing, searchedAddress, setCoordinates,
    setCategoryType,
    categoryType
}) {

    const [address, setAddress] = useState();
    const [clearSearchTrigger, setClearSearchTrigger] = useState(0);

    return (
        <div>
            <div className='relative overflow-hidden rounded-[28px] border border-black/5 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.08)] p-5 md:p-7 mb-7'>
                <div className='absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,184,152,0.28),_transparent_55%)] pointer-events-none'></div>
                <div className='relative grid gap-5'>
                    <div className='flex flex-col gap-2'>
                        <p className='text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground'>Search</p>
                        <h2 className='text-lg md:text-xl font-semibold text-foreground'>Find vendors by location and category</h2>
                    </div>
                    <div className='grid gap-4 lg:grid-cols-[1.5fr,1fr] lg:items-center'>
                        <GoogleAddressSearch
                            selectedAddress={(value) => { searchedAddress(value); setAddress(value) }}
                            setCoordinates={setCoordinates}
                            clearTrigger={clearSearchTrigger}
                        />
                        <div className='bg-white/70 rounded-2xl border border-black/5 p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)]'>
                            <FilterSection
                                setCategoryType={setCategoryType}
                                categoryType={categoryType}
                                compact
                            />
                        </div>
                    </div>
                </div>
            </div>

            {address &&
                <div className='bg-white/80 rounded-2xl p-4 mb-6 border border-border/70 shadow-[0_10px_30px_rgba(15,23,42,0.06)]'>
                    <h2 className='text-lg text-foreground'>Found <span className='font-bold text-primary'>{listing.length}</span> {listing.length === 1 ? 'vendor' : 'vendors'} near <span className='text-primary font-bold'>{address?.label || 'selected location'}</span> <span className='text-sm text-muted-foreground font-normal'>(within 50km)</span></h2>
                </div>
            }
            {/* Results Grid */}
            {listing?.length > 0 ? (
                <>
                {!address && (
                    <div className='bg-white/80 rounded-2xl p-4 mb-6 border border-border/70 shadow-[0_10px_30px_rgba(15,23,42,0.06)]'>
                        <h2 className='text-lg text-foreground'>Showing <span className='font-bold text-primary'>{listing.length}</span> {listing.length === 1 ? 'vendor' : 'vendors'}</h2>
                    </div>
                )}
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-7'>
                    {listing?.map((item, index) => (
                    <Link key={item.id || index} href={`/view-listing/${item.slug || item.id}`}>
                        <div className='group bg-white rounded-[26px] shadow-[0_18px_50px_rgba(15,23,42,0.10)] hover:shadow-[0_26px_60px_rgba(15,23,42,0.16)] transition-all duration-300 transform hover:-translate-y-1 border border-black/5 overflow-hidden'>
                            <div className='relative overflow-hidden'>
                                <Image src={item?.listing_images[0] ?
                                    item?.listing_images[0]?.url
                                    : '/placeholder.svg'}
                                    width={400}
                                    height={250}
                                    alt={item?.business_name || 'Vendor listing image'}
                                    className='w-full h-52 sm:h-56 object-cover group-hover:scale-105 transition-transform duration-500'
                                />
                                <div className='absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                            </div>
                            
                            <div className='p-5'>
                                <div className='flex items-start justify-between mb-2'>
                                    <h2 className='font-semibold text-lg text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-2 flex-1'>{item?.business_name}</h2>
                                    {item.featured && (
                                        <PremiumIcon size="sm" className="ml-2 flex-shrink-0" />
                                    )}
                                </div>
                                
                                <div className='flex items-center gap-1 mb-3 text-muted-foreground'>
                                    <MapPin className='h-4 w-4 flex-shrink-0' />
                                    <span className='text-sm truncate'>{item.city + ", " + item.country}</span>
                                </div>
                                
                                <div className='flex flex-wrap gap-2'>
                                    <div className='inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-foreground rounded-full text-xs font-semibold'>
                                        <Filter className='h-3 w-3' />
                                        <span className='truncate'>{getListingCategoryLabel(item)}</span>
                                    </div>
                                    {item?.industry && (
                                        <div className='inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-900/5 text-muted-foreground rounded-full text-[11px] font-medium'>
                                            <Factory className='h-3 w-3' />
                                            <span className='truncate'>{item?.industry}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Link>
                    ))}
                </div>
                </>
            ) : address ? (
                /* No Results State */
                <div className='bg-white rounded-2xl shadow-[0_12px_30px_rgba(15,23,42,0.08)] border border-border/70 p-8 md:p-12 text-center'>
                    <div className='max-w-md mx-auto'>
                        <div className='w-20 h-20 mx-auto mb-6 bg-secondary/70 rounded-full flex items-center justify-center'>
                            <MapPin className='h-10 w-10 text-muted-foreground' />
                        </div>
                        <h3 className='text-xl font-semibold text-foreground mb-3'>
                            No vendors found in {address?.label}
                        </h3>
                        <p className='text-muted-foreground mb-6'>
                            We couldn't find any listings in this location. Try searching in a nearby city or explore all listings.
                        </p>
                        <div className='flex flex-col sm:flex-row gap-3 justify-center'>
                            <Button 
                                variant="outline" 
                                onClick={() => { 
                                    setAddress(null); 
                                    searchedAddress(null); 
                                    setCoordinates(null); 
                                    setClearSearchTrigger(prev => prev + 1);
                                }}
                                className='flex gap-2 w-full sm:w-auto'
                            >
                                <Search className='h-4 w-4' />
                                Clear Search
                            </Button>
                            <Link href='/all-listings'>
                                <Button className='flex gap-2 w-full sm:w-auto'>
                                    <MapPin className='h-4 w-4' />
                                    View All Listings
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            ) : !address && listing?.length === 0 ? (
                /* Loading Skeleton - only show when initially loading */
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6'>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((item, index) => (
                        <div key={index} className='bg-card rounded-xl shadow-sm border border-border overflow-hidden'>
                            <div className='h-48 sm:h-52 bg-muted animate-pulse'></div>
                            <div className='p-4 space-y-3'>
                                <div className='h-5 bg-muted rounded animate-pulse'></div>
                                <div className='h-4 bg-muted rounded animate-pulse w-3/4'></div>
                                <div className='space-y-2'>
                                    <div className='h-6 bg-muted rounded-full animate-pulse'></div>
                                    <div className='h-6 bg-muted rounded-full animate-pulse'></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : null}
        </div>
    )
}

export default Listing
