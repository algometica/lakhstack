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
    console.log('searchedAddress:', searchedAddress)
    console.log('coordinates:', coordinates)

    let query = supabase
      .from('listing')
      .select('*, listing_images(url, listing_id)')
      .eq('active', true);

    // Apply location-based filtering if coordinates are available
    if (coordinates && coordinates.lat && coordinates.lng) {
      // Use PostgreSQL's earth distance calculation for geographical filtering
      // This filters listings within approximately 50km radius
      const radiusInKm = 50;
      
      // Using PostGIS ST_DWithin function for distance filtering
      // Note: We need to convert coordinates to Point format
      query = query.rpc('get_listings_within_radius', {
        search_lat: coordinates.lat,
        search_lng: coordinates.lng,
        radius_km: radiusInKm
      });
    } else {
      // Fallback to address text search if no coordinates
      const searchTerm = searchedAddress?.value?.structured_formatting?.main_text || 
                        searchedAddress?.label;
      
      if (searchTerm) {
        // Try multiple fields for better matching
        query = query.or(`address.ilike.%${searchTerm}%,business_name.ilike.%${searchTerm}%,desc.ilike.%${searchTerm}%`);
      }
      
      query = query.order('id', { ascending: false });
    }

    // Apply additional filters
    if (industryType) {
      query = query.eq('industry', industryType)
    }
    if (categoryType) {
      query = query.eq('category', categoryType)
    }

    const { data, error } = await query;

    if (error) {
      console.error('Database query error:', error);
      // Fallback to simple query if RPC function doesn't exist
      if (error.code === '42883') { // Function does not exist
        console.log('Falling back to simple coordinate filtering');
        await handleSearchClickFallback();
        return;
      }
      toast('Error searching listings');
      return;
    }

    if (data) {
      console.log('Found listings:', data.length);
      setListing(data)
    }
  }

  // Fallback method using basic coordinate comparison
  const handleSearchClickFallback = async () => {
    console.log('Using fallback coordinate filtering');
    
    let query = supabase
      .from('listing')
      .select('*, listing_images(url, listing_id)')
      .eq('active', true);

    // Apply text-based location search as fallback
    if (coordinates || searchedAddress) {
      const searchTerm = searchedAddress?.value?.structured_formatting?.main_text || 
                        searchedAddress?.label;
      
      if (searchTerm) {
        query = query.or(`address.ilike.%${searchTerm}%,business_name.ilike.%${searchTerm}%`);
      }
    }

    if (industryType) {
      query = query.eq('industry', industryType)
    }
    if (categoryType) {
      query = query.eq('category', categoryType)
    }

    query = query.order('id', { ascending: false });

    const { data, error } = await query;

    if (data) {
      // If we have coordinates, do client-side distance filtering
      if (coordinates && coordinates.lat && coordinates.lng) {
        const filteredData = data.filter(listing => {
          if (!listing.coordinates || !listing.coordinates.lat || !listing.coordinates.lng) {
            return false; // Skip listings without coordinates
          }
          
          // Calculate distance using Haversine formula
          const distance = calculateDistance(
            coordinates.lat, coordinates.lng,
            listing.coordinates.lat, listing.coordinates.lng
          );
          
          return distance <= 50; // 50km radius
        });
        
        console.log(`Filtered ${data.length} listings to ${filteredData.length} within 50km`);
        setListing(filteredData);
      } else {
        setListing(data);
      }
    }

    if (error) {
      console.error('Fallback query error:', error);
      toast('Error searching listings');
    }
  }

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