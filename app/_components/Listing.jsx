import { Factory, Filter, MapPin, Search } from 'lucide-react'
import Image from 'next/image'
import React, { useState } from 'react'
import GoogleAddressSearch from './GoogleAddressSearch'
import { Button } from '@/components/ui/button'
import FilterSection from './FilterSection'
import Link from 'next/link'

function Listing({ listing, handleSearchClick, searchedAddress, setCoordinates,
    setIndustryType,
    setCategoryType
}) {

    const [address, setAddress] = useState();

    return (
        <div>
            <div className='bg-card rounded-xl shadow-sm border border-border p-4 md:p-6 mb-6'>
                <div className='flex flex-col md:flex-row gap-4'>
                    <div className='flex-1'>
                        <GoogleAddressSearch
                            selectedAddress={(value) => { searchedAddress(value); setAddress(value) }}
                            setCoordinates={setCoordinates}
                        />
                    </div>
                    <Button className='flex gap-2 px-6 h-12 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors duration-200'
                        onClick={handleSearchClick}
                    >
                        <Search className='h-4 w-4' />
                        Search
                    </Button>
                </div>
            </div>

            <div className='bg-card rounded-xl shadow-sm border border-border mb-6'>
                <FilterSection
                    setIndustryType={setIndustryType}
                    setCategoryType={setCategoryType}
                />
            </div>

            {address &&
                <div className='bg-primary/5 rounded-xl p-4 mb-6 border border-primary/20'>
                    <h2 className='text-lg text-foreground'>Found <span className='font-bold text-primary'>{listing.length}</span> {listing.length === 1 ? 'listing' : 'listings'} in <span className='text-primary font-bold'>{address?.label || 'selected location'}</span></h2>
                </div>
            }
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6'>
                {listing?.length > 0 ? listing?.map((item, index) => (
                    <Link key={item.id || index} href={'/view-listing/' + item.id}>
                        <div className='group bg-card rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-border overflow-hidden'>
                            <div className='relative overflow-hidden'>
                                <Image src={item?.listing_images[0] ?
                                    item?.listing_images[0]?.url
                                    : '/placeholder.svg'}
                                    width={400}
                                    height={250}
                                    alt={item?.business_name || 'Business listing image'}
                                    className='w-full h-48 sm:h-52 object-cover group-hover:scale-105 transition-transform duration-300'
                                />
                                <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                            </div>
                            
                            <div className='p-4'>
                                <h2 className='font-bold text-lg mb-2 text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-2'>{item?.business_name}</h2>
                                
                                <div className='flex items-center gap-1 mb-3 text-muted-foreground'>
                                    <MapPin className='h-4 w-4 flex-shrink-0' />
                                    <span className='text-sm truncate'>{item.city + ", " + item.country}</span>
                                </div>
                                
                                <div className='flex flex-col gap-2'>
                                    <div className='flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full text-primary text-xs font-medium'>
                                        <Factory className='h-3 w-3' />
                                        <span className='truncate'>{item?.industry}</span>
                                    </div>
                                    <div className='flex items-center gap-2 px-3 py-1.5 bg-secondary/10 rounded-full text-secondary-foreground text-xs font-medium'>
                                        <Filter className='h-3 w-3' />
                                        <span className='truncate'>{item?.category}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                )) // skeleton effect for that quick load
                    : [1, 2, 3, 4, 5, 6, 7, 8].map((item, index) => (
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
        </div>
    )
}

export default Listing