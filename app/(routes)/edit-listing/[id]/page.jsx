"use client";

import React, { useEffect, useState } from 'react'
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Formik } from 'formik'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/utils/supabase/client'
import { toast } from 'sonner'
import { useUser } from '@clerk/nextjs'
//import FileUpload from '../_components/FileUpload'
import { Loader } from 'lucide-react'
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
import FileUpload from '../_components/FileUpload'

function EditListing({ params }) {


    const { user } = useUser();
    const router = useRouter();
    const [listing, setListing] = useState([]);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {

        // console.log(params.split('/')[2]);
        user && verifyUserRecord();
    }, [user]);

    const verifyUserRecord = async () => {
        const { data, error } = await supabase
            .from('listing')
            .select('*, listing_images(listing_id, url)')
            .eq('created_by', user?.primaryEmailAddress.emailAddress)
            .eq('id', params.id);

        if (data) {
            console.log("hehehe");
            console.log(data);
            setListing(data[0]);
        }
        if (data?.length <= 0) {
            router.replace('/')
        }
    }

    const onSubmitHandler = async (formValue) => {
        setLoading(true);

        if (images?.length == 0) {
            setLoading(false);
            toast('Please add atleast 1 Image')
            return;
        }

        // Update the 'id' record of listing table in Supabase with all the form fields
        const { data, error } = await supabase
            .from('listing')
            .update(formValue) // this formValue will update the fields in 'listing' table
            .eq('id', params.id)
            .select();

        if (data) {
            console.log(data);
            toast('Listing Updated');
            setLoading(false)
        }

        for (const image of images) {
            setLoading(true)
            const file = image;
            const fileName = Date.now().toString();
            const fileExt = fileName.split('.').pop();

            // Storing images in Supabase
            const { data, error } = await supabase.storage
                .from('listing_images')
                .upload(`${fileName}`, file, {
                    contentType: `image/${fileExt}`,
                    upsert: false
                });

            if (error) {
                setLoading(false)
                toast('Error while uploading images')
            }

            else {
                const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL + fileName;

                // Storing image details in listing_images table of Supabase
                const { data, error } = await supabase
                    .from('listing_images')
                    .insert([
                        { url: imageUrl, listing_id: params?.id }
                    ])
                    .select();

                if (data) {
                    setLoading(false);

                }
                if (error) {
                    setLoading(false)
                }

            }
            setLoading(false);
        }

    }

    const publishBtnHandler = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('listing')
            .update({ active: true })
            .eq('id', params?.id)
            .select()

        if (data) {
            setLoading(false)
            toast('Listing Published!')
        }

    }

    return (
        <div className='px-10 md:px-36 my-10'>
            <h2 className='font-bold text-2xl'>Enter some more details about your listing</h2>

            <Formik
                initialValues={{
                    featured: false,
                    industry: '',
                    profile_image: user?.imageUrl,
                    username: user?.fullName
                }}
                onSubmit={(values) => {
                    console.log(values);
                    onSubmitHandler(values);
                }}
            >
                {({
                    values,
                    handleChange,
                    handleSubmit
                }) => (
                    <form onSubmit={handleSubmit}>
                        <div>
                            <div className='p-5 border rounded-lg shadow-md grid gap-7 mt-6'>
                                <div className='grid  grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10'>
                                    <div className='flex gap-2 flex-col'>
                                        <h2 className='text-gray-500'>Industry Type</h2>
                                        <Select
                                            onValueChange={(e) => values.industry = e}
                                            name="industry"
                                            defaultValue={listing?.industry}
                                        >
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue placeholder={listing?.industry ? listing?.industry : "Select Industry Type"} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="wedding">Wedding</SelectItem>
                                                <SelectItem value="fitness">Fitness</SelectItem>
                                                <SelectItem value="food">Food</SelectItem>
                                                <SelectItem value="technology">Technology</SelectItem>
                                                <SelectItem value="trades">Trades</SelectItem>
                                                <SelectItem value="clothing-retail">Clothing</SelectItem>
                                                <SelectItem value="immigration">Immigration</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className='flex gap-2 flex-col'>
                                        <h2 className='text-gray-500'>Category</h2>
                                        <Select
                                            onValueChange={(e) => values.category = e}
                                            name="category"
                                            defaultValue={listing?.category}
                                        >
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue placeholder={listing?.category ? listing?.category : "Select Category"} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="hair-makeup">Hair and Makeup</SelectItem>
                                                <SelectItem value="catering">Catering</SelectItem>
                                                <SelectItem value="restaurant">Restaurant</SelectItem>
                                                <SelectItem value="photography">Photography and Video</SelectItem>
                                                <SelectItem value="decoration">Flowers and Decoration</SelectItem>
                                                <SelectItem value="wedding-planner">Wedding Planner</SelectItem>
                                                <SelectItem value="wedding-cakes">Wedding Cakes</SelectItem>
                                                <SelectItem value="music">Music</SelectItem>
                                                <SelectItem value="mehndi">Mehndi</SelectItem>
                                                <SelectItem value="personal-training">Personal Training</SelectItem>
                                                <SelectItem value="web-development">Web App Development</SelectItem>
                                                <SelectItem value="electrical">Electrical</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className='flex gap-2 flex-col'   >
                                        <h2 className='text-gray-500'>In Business Since?</h2>
                                        <Input type="number" placeholder="Ex. 2018"
                                            onChange={handleChange}
                                            defaultValue={listing?.since} name="since"
                                        />
                                    </div>

                                </div>
                                <div className='grid  grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10'>
                                    <div className='flex gap-2 flex-col'>
                                        <h2 className='text-gray-500'>Hourly Price Range</h2>
                                        <Select
                                            onValueChange={(e) => values.price_range = e}
                                            name="price_range"
                                            defaultValue={listing?.price_range}
                                        >
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue placeholder={listing?.price_range ? listing?.price_range : "Select Price Range"} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="$100 and under">$ = $100 and under</SelectItem>
                                                <SelectItem value="$100-$250">$$ = $100-$250</SelectItem>
                                                <SelectItem value="$250-$500">$$$ = $250-$500</SelectItem>
                                                <SelectItem value="$500+">$$$$ = $500+</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className='flex gap-2 flex-col'>
                                        <h2 className='text-gray-500'>Name of your business</h2>
                                        <Input type="text" placeholder="ABC Inc."
                                            defaultValue={listing?.business_name}
                                            name="business_name"
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className='flex gap-2 flex-col'>
                                        <h2 className='text-gray-500'>Business Phone (without spaces or dashes)</h2>
                                        <Input type="text" placeholder="+16049999999"
                                            defaultValue={listing?.phone}
                                            name="phone"
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className='flex gap-2 flex-col'>
                                        <h2 className='text-gray-500'>Business Website</h2>
                                        <Input type="text" placeholder="https://www.google.com/"
                                            defaultValue={listing?.url}
                                            name="url"
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className='flex gap-2 flex-col'>
                                        <h2 className='text-gray-500'>Instagram</h2>
                                        <Input type="text" placeholder="https://www.instagram.com/google/"
                                            defaultValue={listing?.instagram_url}
                                            name="instagram_url"
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className='grid  grid-cols-1  gap-10'>
                                    <div className='flex gap-2 flex-col'>
                                        <h2 className='text-gray-500'>Write your detailed bio - what's speacial about your business? Talk about services you offer</h2>
                                        <Textarea placeholder="" name="description"
                                            onChange={handleChange}
                                            defaultValue={listing?.description} />
                                    </div>
                                </div>
                                <div>
                                    <h2 className='font-lg text-gray-500 my-2'>Upload Listing Images</h2>
                                    <FileUpload
                                        setImages={(value) => setImages(value)}
                                        imageList={listing?.listing_images}
                                    />
                                </div>
                                <div className='flex gap-7 justify-end'>
                                    <h2 className='text-gray-500'>Make sure to <strong className='text-green-500'>Save</strong> your listing before <strong className='text-red-500'>Publish</strong>-ing</h2>

                                    <Button variant="outline" className="text-primary border-primary">
                                        {loading ? <Loader className='animate-spin' /> : 'Save'}
                                    </Button>

                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button type="button" disabled={loading} className="">
                                                {loading ? <Loader className='animate-spin' /> : 'Publish'}
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Ready to Publish?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Do you really want to publish this listing?
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => publishBtnHandler()} >
                                                    {loading ? <Loader className='animate-spin' /> : 'Continue'}
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>


                                </div>
                            </div>
                        </div>
                    </form>)}
            </Formik>
        </div>
    )
}

export default EditListing