"use client";

import React, { useEffect, useState, useCallback } from 'react'
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
    handleSearchClick();
  }, [coordinates, searchedAddress, industryType, categoryType])

  const getLatestListing = useCallback(async () => {
    const { data, error } = await supabase
      .from('listing')
      .select('*, listing_images(url, listing_id)')
      .eq('active', true)
      .in('featured', featured)
      .order('id', { ascending: false })

    if (data) {
      setListing(data);
    }
    if (error) {
      toast('Server Side Error')
    }
  }, [featured])

  const handleSearchClick = useCallback(async () => {
    if (!searchedAddress && !coordinates && !industryType && !categoryType) {
      getLatestListing();
      return;
    }

    // Get all active listings first
    let query = supabase
      .from('listing')
      .select('*, listing_images(url, listing_id)')
      .eq('active', true);

    // Apply industry and category filters at database level
    if (industryType) {
      query = query.eq('industry', industryType)
    }
    if (categoryType) {
      query = query.eq('category', categoryType)
    }

    query = query.order('id', { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error('Database query error:', error);
      toast('Error searching listings');
      return;
    }

    if (data) {
      let filteredListings = data;
      
      // Apply geographical filtering if coordinates are available
      if (coordinates && coordinates.lat && coordinates.lng) {
        filteredListings = data.filter(listing => {
          // Skip listings without coordinates
          if (!listing.coordinates || !listing.coordinates.lat || !listing.coordinates.lng) {
            return false;
          }
          
          // Calculate distance using Haversine formula
          const distance = calculateDistance(
            coordinates.lat, coordinates.lng,
            listing.coordinates.lat, listing.coordinates.lng
          );
          
          // Include listings within 50km radius
          return distance <= 50;
        });
        
      } else if (searchedAddress) {
        // Text-based filtering as fallback
        const searchTerm = searchedAddress?.value?.structured_formatting?.main_text || 
                          searchedAddress?.label;
        
        if (searchTerm) {
          filteredListings = data.filter(listing => {
            const matchesAddress = listing.address && listing.address.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesName = listing.business_name && listing.business_name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesDesc = listing.business_desc && listing.business_desc.toLowerCase().includes(searchTerm.toLowerCase());
            
            return matchesAddress || matchesName || matchesDesc;
          });
        }
      }
      
      setListing(filteredListings);
    }
  }, [searchedAddress, coordinates, industryType, categoryType])


  // Haversine formula to calculate distance between two points
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; // Distance in kilometers
    return distance;
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