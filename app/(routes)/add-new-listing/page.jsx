"use client";

import GoogleAddressSearch from '@/app/_components/GoogleAddressSearch'
import { Button } from '@/components/ui/button'
import { supabase } from '@/utils/supabase/client';
import { useSession } from 'next-auth/react';
import { Loader, MapPin, ArrowRight, AlertCircle, CheckCircle2, Building } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react'
import { toast } from 'sonner';
import { generateListingSlug } from '@/lib/slug-utils';
import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert";

function AddNewListing() {
    const [selectedAddress, setSelectedAddress] = useState();
    const [coordinates, setCoordinates] = useState();
    const [loader, setLoader] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { data: session, status } = useSession();
    const user = session?.user;
    const router = useRouter();

    // Check if user is authenticated and authorized
    useEffect(() => {
        if (status === 'loading') return; // Still loading

        if (!session) {
            router.replace('/auth/signin');
            return;
        }

        // Check if user is admin (only admins should be able to create listings)
        const isAdmin = user?.role === 'admin' || user?.isAdmin;
        if (!isAdmin) {
            toast.error('Only administrators can create listings');
            router.replace('/');
            return;
        }
    }, [session, status, user, router]);

    const validateInput = () => {
        setError('');
        
        if (!selectedAddress) {
            setError('Please select an address from the search suggestions');
            return false;
        }
        
        if (!coordinates) {
            setError('Unable to get coordinates for this address. Please try a different address.');
            return false;
        }

        if (!selectedAddress.label || selectedAddress.label.trim() === '') {
            setError('Selected address is invalid. Please choose a valid address.');
            return false;
        }

        return true;
    };

    const parseAddressComponents = (addressLabel) => {
        if (!addressLabel) return { city: '', country: '' };
        
        const parts = addressLabel.split(', ');
        let city = '';
        let country = '';

        if (parts.length >= 3) {
            // Try to extract city (usually second to last or third to last)
            city = parts.at(-3) || parts.at(-2) || '';
            // Country is typically the last part
            country = parts.at(-1) || '';
        } else if (parts.length === 2) {
            city = parts[0] || '';
            country = parts[1] || '';
        }

        return { city: city.trim(), country: country.trim() };
    };

    const nextHandler = async () => {
        if (!validateInput()) {
            return;
        }

        setLoader(true);
        setError('');
        setSuccess('');

        try {
            const { city, country } = parseAddressComponents(selectedAddress.label);

            // First, check if there are existing listings with the same address
            const { data: existingListings, error: checkError } = await supabase
                .from('listing')
                .select('id, business_name, created_by, active')
                .eq('address', selectedAddress.label);

            if (checkError) {
                console.error('Error checking existing listings:', checkError);
            } else if (existingListings && existingListings.length > 0) {
                // Show warning but still allow creation
                console.log(`Found ${existingListings.length} existing listing(s) with the same address:`, existingListings);
                toast.info(`Found ${existingListings.length} existing listing(s) with this address. Creating new listing anyway.`);
            }

            // Generate a temporary slug for the new listing
            // We'll use a timestamp-based slug since we don't have business_name yet
            const tempSlug = `listing-${Date.now()}`;

            const listingData = {
                address: selectedAddress.label,
                coordinates: coordinates,
                city: city,
                country: country,
                created_by: user?.email,
                active: false, // Start as inactive until fully configured
                featured: false, // Default to basic (not premium)
                listing_type: 'basic', // Default to basic listing
                show_map: false, // Default to hidden map
                social_proof_enabled: false, // Default to hidden social proof
                urgency_enabled: false, // Default to hidden urgency
                slug: tempSlug // Add the required slug field
            };

            const { data, error } = await supabase
                .from('listing')
                .insert([listingData])
                .select();

            if (error) {
                console.error('Database error:', error);
                
                if (error.code === '23505') {
                    // Unique constraint violation
                    if (error.message.includes('address')) {
                        setError('This address already has a listing. As an admin, you should be able to create multiple listings. Please contact support to fix database constraints.');
                    } else {
                        setError('A listing with these details already exists. Please check your input or contact support if this is unexpected.');
                    }
                } else if (error.code === '23503') {
                    // Foreign key constraint
                    setError('There was an issue with your account. Please try signing in again.');
                } else {
                    setError('Failed to create listing. Please check your connection and try again.');
                }
                
                toast.error('Failed to create listing');
                return;
            }

            if (data && data[0]) {
                setSuccess('Address added successfully! Redirecting to listing details...');
                toast.success('New listing created successfully');
                
                // Add small delay for better UX
                setTimeout(() => {
                    router.replace('/edit-listing/' + data[0].id);
                }, 1500);
            } else {
                setError('Unexpected error occurred. Please try again.');
            }

        } catch (error) {
            console.error('Unexpected error:', error);
            setError('An unexpected error occurred. Please try again.');
            toast.error('Failed to create listing');
        } finally {
            setLoader(false);
        }
    };

    const handleAddressChange = (address) => {
        setSelectedAddress(address);
        setError(''); // Clear error when user makes a change
        setSuccess(''); // Clear success message
    };

    const handleCoordinatesChange = (coords) => {
        setCoordinates(coords);
        setError(''); // Clear error when coordinates are set
    };

    // Show loading state while checking authentication
    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
                <div className="text-center">
                    <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
            {/* Header Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20 pb-16">
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.1)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px] animate-pulse opacity-30"></div>
                
                <div className="relative mx-auto max-w-4xl px-6 pt-20 lg:px-8">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-6">
                            <Building className="w-8 h-8 text-primary" />
                        </div>
                        
                        <h1 className="text-4xl lg:text-5xl font-black text-foreground leading-tight mb-4">
                            Create New Listing
                        </h1>
                        
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Add a new business to LakhStack's directory. Start by entering the exact address of your business location.
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="relative -mt-8 z-10">
                <div className="max-w-2xl mx-auto px-6 lg:px-8">
                    <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 shadow-xl p-8">
                        
                        {/* Address Selection Section */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
                                <MapPin className="w-6 h-6 text-primary" />
                                Business Address
                            </h2>
                            
                            <div className="space-y-4">
                                <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                                    <p className="text-sm text-foreground/80 mb-2">
                                        <strong>Important:</strong> Enter the exact business address, including street number and name.
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        For home-based businesses, use your residential address. This ensures accurate location mapping.
                                    </p>
                                </div>

                                <GoogleAddressSearch
                                    selectedAddress={handleAddressChange}
                                    setCoordinates={handleCoordinatesChange}
                                />
                            </div>
                        </div>

                        {/* Selected Address Display */}
                        {selectedAddress && (
                            <div className="mb-6 p-4 bg-cyber/5 border border-cyber/20 rounded-xl">
                                <div className="flex items-start gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-cyber mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="font-medium text-foreground">Selected Address:</p>
                                        <p className="text-sm text-muted-foreground">{selectedAddress.label}</p>
                                        {coordinates && (
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Coordinates: {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Error Display */}
                        {error && (
                            <Alert className="mb-6 border-destructive/20 bg-destructive/5">
                                <AlertCircle className="h-4 w-4 text-destructive" />
                                <AlertDescription className="text-destructive">
                                    {error}
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* Success Display */}
                        {success && (
                            <Alert className="mb-6 border-cyber/20 bg-cyber/5">
                                <CheckCircle2 className="h-4 w-4 text-cyber" />
                                <AlertDescription className="text-cyber">
                                    {success}
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* Action Button */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button
                                onClick={nextHandler}
                                disabled={!selectedAddress || !coordinates || loader}
                                className="flex-1 h-12 text-lg font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:transform-none disabled:opacity-50"
                            >
                                {loader ? (
                                    <div className="flex items-center gap-2">
                                        <Loader className="w-5 h-5 animate-spin" />
                                        Creating Listing...
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        Continue to Details
                                        <ArrowRight className="w-5 h-5" />
                                    </div>
                                )}
                            </Button>
                        </div>

                        {/* Help Text */}
                        <div className="mt-6 text-center">
                            <p className="text-sm text-muted-foreground">
                                After selecting an address, you'll be able to add business details, photos, and contact information.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddNewListing