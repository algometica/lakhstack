import { Button } from '@/components/ui/button';
import { supabase } from '@/utils/supabase/client'
import { useSession } from 'next-auth/react'
import { Bath, BedDouble, Factory, Filter, MapPin, Ruler, Trash } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';
import React, { useEffect, useState } from 'react'
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

    useEffect(() => {
        user && GetUserListing();
    }, [user])

    const GetUserListing = async () => {
        const { data, error } = await supabase
            .from('listing')
            .select(`*,listing_images(url,listing_id)`)
            .eq('created_by', user?.email);
        
        setListing(data);
        console.log(data);
    }

    /**
     * Delete Property 
     */
    const deleteListing = async (id) => {
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
            <h2 className='font-bold text-2xl'>Manage your listing</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                {listing && listing.map((item, index) => (
                    <div key={item.id || index} className='p-3 hover:border hover:border-primary rounded-lg cursor-pointer'>
                        <h2 className='bg-primary m-1 rounded-lg text-white absolute px-2 text-sm p-1'>{item.active ? 'Published' : 'Draft'}</h2>
                        <Image src={item?.listing_images[0] ?
                            item?.listing_images[0]?.url
                            : '/placeholder.svg'
                        }
                            width={800}
                            height={150}
                            alt={item?.business_name || 'Business listing'}
                            className='rounded-lg object-cover h-[170px]'
                        />
                        <div className='flex mt-2 flex-col gap-2'>
                            <h2 className='font-bold text-xl'>{item?.business_name}</h2>
                            <h2 className='flex gap-2 text-sm text-gray-400 '>
                                <MapPin className='h-4 w-4' />
                                {item.address}</h2>
                            <div className='flex gap-2 mt-2 justify-between'>
                                <h2 className='flex gap-2 text-sm bg-slate-200 
                         rounded-md p-2 w-full text-gray-500 justify-center items-center'>
                                    <Factory className='h-4 w-4' />
                                    {item?.industry}
                                </h2>
                                <h2 className='flex gap-2 text-sm bg-slate-200 
                         rounded-md p-2 w-full text-gray-500 justify-center items-center'>
                                    <Filter className='h-4 w-4' />
                                    {item?.category}
                                </h2>
                            </div>
                            <div className='flex gap-2 justify-between'>
                                <Link href={'/view-listing/' + item.id} className="w-full">
                                    <Button size="sm" variant="outline">
                                        View</Button>
                                </Link>
                                <Link href={'/edit-listing/' + item.id} className="w-full">
                                    <Button size="sm" className="w-full">Edit</Button>
                                </Link>

                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button size="sm" variant="destructive" className="w-full">
                                            <Trash />
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