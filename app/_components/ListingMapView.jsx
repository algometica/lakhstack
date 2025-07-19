"use client";

import React, { useEffect, useState } from 'react'
import Listing from './Listing'
import { supabase } from '@/utils/supabase/client'
import { toast } from 'sonner';
import GoogleMapSection from './GoogleMapSection';

function ListingMapView({ featured }) {

  const [listing, setListing] = useState([]);
  const [searchedAddress, setSearchedAddress] = useState([]);
  const [coordinates, setCoordinates] = useState();
  const [industryType, setIndustryType] = useState();
  const [categoryType, setCategoryType] = useState();


  useEffect(() => {
    getLatestListing();
  }, [featured])

  useEffect(() => {
    if (industryType !== undefined || categoryType !== undefined) {
      handleSearchClick();
    }
  }, [industryType, categoryType, searchedAddress])

  const getLatestListing = async () => {
    const { data, error } = await supabase
      .from('listing')
      .select('*, listing_images(url, listing_id)')
      .eq('active', true)
      .in('featured', featured)
      .order('id', { ascending: false })

    if (data) {
      console.log(data)
      setListing(data);
    }
    if (error) {
      toast('Server Side Error')
    }
  }

  const handleSearchClick = async () => {

    console.log('handleSearchClick')
    console.log(searchedAddress)

    const searchTerm = searchedAddress?.value?.structured_formatting?.main_text
    console.log(searchTerm);

    let query;
    if (searchTerm) {
      query = supabase
        .from('listing')
        .select('*, listing_images(url, listing_id)')
        .eq('active', true)
        //.in('featured', featured)
        .like('address', '%' + searchTerm + '%')
        .order('id', { ascending: false });
    } else {
      query = supabase
        .from('listing')
        .select('*, listing_images(url, listing_id)')
        .eq('active', true)
        //.in('featured', featured)
        .order('id', { ascending: false });
    }

    if (industryType) {
      query = query.eq('industry', industryType)
    }
    if (categoryType) {
      query = query.eq('category', categoryType)
    }

    const { data, error } = await query;

    if (data) {
      setListing(data)
    }
  }

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
      <div className='bg-muted/20 min-h-screen -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-6'>
        <Listing listing={listing}
          handleSearchClick={handleSearchClick}
          searchedAddress={(value) => setSearchedAddress(value)} 
          setCoordinates={setCoordinates}
          setIndustryType={setIndustryType}
          setCategoryType={setCategoryType}
        />
      </div>
      {/* <div className='fixed right-10 h-full md:w-[390px] lg:w-[490px] xl:w-[650px]'>
        <GoogleMapSection
          listing={listing}
          coordinates={coordinates}
         />
      </div> */}
    </div>
  )
}

export default ListingMapView