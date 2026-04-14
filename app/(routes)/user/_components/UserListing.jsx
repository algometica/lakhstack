"use client";

import { Button } from '@/components/ui/button';
import { getSupabaseClient } from '@/utils/supabase/client'
import { useSession } from 'next-auth/react'
import { Bath, BedDouble, Factory, Filter, MapPin, Ruler, Trash } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';
import React, { useCallback, useEffect, useState } from 'react'
import { getListingCategoryLabel } from '@/lib/category-taxonomy';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


function UserListing() {

    const { data: session } = useSession();
    const user = session?.user;
    const [listing, setListing] = useState();

    const GetUserListing = useCallback(async () => {
        const supabase = getSupabaseClient();
        if (!supabase) return;
        const { data, error } = await supabase
            .from('listing')
            .select(`*,listing_images(url,listing_id)`)
            .eq('created_by', user?.email);
        
        setListing(data);
    }, [user?.email]);

    useEffect(() => {
        user && GetUserListing();
    }, [user, GetUserListing])

    /**
     * Delete Property 
     */
    const deleteListing = async (id) => {
        const supabase = getSupabaseClient();
        if (!supabase) return;
        //Delete Images  Record First
        await supabase
            .from('listing_images')
            .delete()
            .eq('listing_id', id);

        //Delete Actual Listing

        const { data, error } = await supabase
            .from('listing')
            .delete()
            .eq('id', id);

        toast('Record deleted!');
        GetUserListing();


    }
    return (
        <div>
            <h2 className='font-bold text-xl sm:text-2xl mb-4'>Manage your listing</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5'>
                {listing && listing.map((item, index) => (
                    <div key={item.id || index} className='relative rounded-xl border border-border/50 overflow-hidden bg-white shadow-sm hover:shadow-md hover:border-primary/40 transition-all duration-200'>
                        <div className='relative'>
                            <span className='absolute top-2 left-2 z-10 bg-primary text-white text-xs font-semibold px-2.5 py-1 rounded-full'>
                                {item.active ? 'Published' : 'Draft'}
                            </span>
                            <Image src={item?.listing_images[0] ?
                                item?.listing_images[0]?.url
                                : '/placeholder.svg'
                            }
                                width={800}
                                height={150}
                                alt={item?.business_name || 'Business listing'}
                                className='w-full object-cover h-44 sm:h-48'
                            />
                        </div>
                        <div className='p-4 flex flex-col gap-3'>
                            <h2 className='font-bold text-base sm:text-lg text-foreground line-clamp-1'>{item?.business_name}</h2>
                            <p className='flex gap-1.5 items-center text-sm text-muted-foreground line-clamp-1'>
                                <MapPin className='h-3.5 w-3.5 shrink-0' />
                                {item.address}
                            </p>
                            <div className='flex gap-2'>
                                <span className='flex gap-1.5 items-center text-xs bg-secondary/70 rounded-lg px-2.5 py-1.5 text-muted-foreground flex-1 justify-center truncate'>
                                    <Factory className='h-3.5 w-3.5 shrink-0' />
                                    <span className="truncate">{item?.industry}</span>
                                </span>
                                <span className='flex gap-1.5 items-center text-xs bg-secondary/70 rounded-lg px-2.5 py-1.5 text-muted-foreground flex-1 justify-center truncate'>
                                    <Filter className='h-3.5 w-3.5 shrink-0' />
                                    <span className="truncate">{getListingCategoryLabel(item)}</span>
                                </span>
                            </div>
                            <div className='flex gap-2 pt-1'>
                                <Link href={`/view-listing/${item.slug || item.id}`} className="flex-1">
                                    <Button variant="outline" className="w-full h-11 text-sm font-medium">View</Button>
                                </Link>
                                <Link href={'/edit-listing/' + item.id} className="flex-1">
                                    <Button className="w-full h-11 text-sm font-medium">Edit</Button>
                                </Link>

                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive" className="h-11 w-11 shrink-0 p-0">
                                            <Trash className="h-4 w-4" />
                                        </Button>

                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Ready to Delete?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Do you really want to Delete the listing?
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => deleteListing(item.id)} >
                                                Continue
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default UserListing
