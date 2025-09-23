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
import { useSession } from 'next-auth/react'
import { generateListingSlug, generateSlug } from '@/lib/slug-utils'
import { 
    Loader, 
    Save, 
    Send, 
    Building, 
    MapPin, 
    Phone, 
    Globe, 
    Instagram, 
    DollarSign, 
    Calendar, 
    FileText, 
    Image as ImageIcon,
    AlertCircle,
    CheckCircle2,
    Factory,
    Filter,
    ArrowLeft,
    Mail,
    Map,
    Award,
    Clock,
    Star
} from 'lucide-react'
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
import {
    Alert,
    AlertDescription,
} from "@/components/ui/alert";
import FileUpload from '../_components/FileUpload'
import Link from 'next/link'

function EditListing({ params }) {
    // Unwrap params using React.use() for Next.js 15 compatibility
    const resolvedParams = React.use(params);

    const { data: session, status } = useSession();
    const user = session?.user;
    const router = useRouter();
    const [listing, setListing] = useState([]);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [saveLoading, setSaveLoading] = useState(false);
    const [publishLoading, setPublishLoading] = useState(false);
    const [hasLoadedInitially, setHasLoadedInitially] = useState(false);
    
    // Local storage key for form state
    const formStateKey = `edit-listing-${resolvedParams.id}-form-state`;
    
    // Load form state from localStorage
    const loadSavedFormState = () => {
        try {
            const saved = localStorage.getItem(formStateKey);
            return saved ? JSON.parse(saved) : null;
        } catch (error) {
            console.error('Error loading form state:', error);
            return null;
        }
    };

    // Save form state to localStorage
    const saveFormState = (formValues) => {
        try {
            localStorage.setItem(formStateKey, JSON.stringify(formValues));
        } catch (error) {
            console.error('Error saving form state:', error);
        }
    };

    // Clear saved form state
    const clearSavedFormState = () => {
        try {
            localStorage.removeItem(formStateKey);
        } catch (error) {
            console.error('Error clearing form state:', error);
        }
    };
    
    // Check authentication and authorization
    useEffect(() => {
        if (status === 'loading') return; // Still loading

        if (!session) {
            router.replace('/auth/signin');
            return;
        }

        // Check if user is admin (only admins should be able to edit listings)
        const isAdmin = user?.role === 'admin' || user?.isAdmin;
        if (!isAdmin) {
            toast.error('Only administrators can edit listings');
            router.replace('/');
            return;
        }

        if (user && resolvedParams.id && !hasLoadedInitially) {
            verifyUserRecord();
        }
    }, [session, status, user, router, resolvedParams.id, hasLoadedInitially]);

    const verifyUserRecord = async () => {
        try {
            setInitialLoading(true);
            setError('');
            
            const { data, error } = await supabase
                .from('listing')
                .select('*, listing_images(listing_id, url)')
                .eq('id', resolvedParams.id);

            if (error) {
                console.error('Error fetching listing:', error);
                setError('Failed to load listing data. Please try again.');
                toast.error('Failed to load listing');
                return;
            }

            if (data && data.length > 0) {
                setListing(data[0]);
                setHasLoadedInitially(true);
            } else {
                setError('Listing not found or you do not have permission to edit it.');
                toast.error('Listing not found');
                setTimeout(() => router.replace('/admin'), 2000);
            }
        } catch (err) {
            console.error('Unexpected error:', err);
            setError('An unexpected error occurred. Please try again.');
            toast.error('Failed to load listing');
        } finally {
            setInitialLoading(false);
        }
    }

    const validateForm = (formValue) => {
        const errors = [];
        
        if (!formValue.business_name?.trim()) {
            errors.push('Business name is required');
        }
        
        if (!formValue.industry) {
            errors.push('Industry selection is required');
        }
        
        if (!formValue.category) {
            errors.push('Category selection is required');
        }
        
        if (!formValue.description?.trim()) {
            errors.push('Business description is required');
        }
        
        if (formValue.phone && !/^[\d\s\-\(\)\+]+$/.test(formValue.phone)) {
            errors.push('Phone number format is invalid');
        }
        
        if (formValue.url && !/^https?:\/\/.+/.test(formValue.url)) {
            errors.push('Website URL must start with http:// or https://');
        }
        
        if (formValue.instagram_url && !/^https?:\/\/(www\.)?instagram\.com\/.+/.test(formValue.instagram_url)) {
            errors.push('Instagram URL must be a valid Instagram profile link');
        }
        
        if (formValue.business_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValue.business_email)) {
            errors.push('Business email must be a valid email address');
        }
        
        return errors;
    };

    const onSubmitHandler = async (formValue) => {
        setSaveLoading(true);
        setError('');
        setSuccess('');

        try {
            // Validate form
            const validationErrors = validateForm(formValue);
            if (validationErrors.length > 0) {
                setError(validationErrors.join('. '));
                toast.error('Please fix the form errors');
                setSaveLoading(false);
                return;
            }

            // Check if we have at least one image (existing or new)
            const hasExistingImages = listing?.listing_images && listing.listing_images.length > 0;
            const hasNewImages = images && images.length > 0;
            
            if (!hasExistingImages && !hasNewImages) {
                setError('Please add at least 1 image for your listing');
                toast.error('At least one image is required');
                setSaveLoading(false);
                return;
            }

            // Generate slug if business name is provided
            let slug = null;
            if (formValue.business_name && formValue.business_name.trim()) {
                try {
                    // First, get existing slugs to check for conflicts
                    const { data: existingSlugs, error: slugError } = await supabase
                        .from('listing')
                        .select('slug')
                        .neq('id', resolvedParams.id);
                    
                    if (slugError) {
                        console.warn('Error fetching existing slugs:', slugError);
                        // If slug column doesn't exist yet, just generate a basic slug
                        slug = generateSlug(formValue.business_name);
                    } else {
                        const slugs = existingSlugs?.map(item => item.slug).filter(Boolean) || [];
                        slug = generateListingSlug(formValue.business_name, resolvedParams.id, slugs);
                    }
                } catch (err) {
                    console.warn('Error generating slug:', err);
                    // Fallback to basic slug generation
                    slug = generateSlug(formValue.business_name);
                }
            }

            // Update the listing data - only include fields that exist in the database
            const updateData = {
                business_name: formValue.business_name || '',
                industry: formValue.industry || null,
                category: formValue.category || null,
                since: formValue.since ? parseInt(formValue.since) : null,
                price_range: formValue.price_range || null,
                phone: formValue.phone || null,
                url: formValue.url || null,
                instagram_url: formValue.instagram_url || null,
                business_email: formValue.business_email || null,
                description: formValue.description || '',
                featured: formValue.featured || false,
                listing_type: formValue.featured ? 'premium' : 'basic',
                show_map: formValue.show_map || false,
                social_proof_enabled: formValue.social_proof_enabled || false,
                urgency_enabled: formValue.urgency_enabled || false,
                ...(slug && { slug }) // Only include slug if generated
            };

            
            const { data, error } = await supabase
                .from('listing')
                .update(updateData)
                .eq('id', resolvedParams.id)
                .select();

            if (error) {
                console.error('Database error details:', error);
                console.error('Error message:', error.message);
                console.error('Error hint:', error.hint);
                console.error('Error details:', error.details);
                setError(`Failed to update listing: ${error.message || 'Unknown error'}`);
                toast.error('Failed to update listing');
                setSaveLoading(false);
                return;
            }

            // Upload new images if any
            if (images && images.length > 0) {
                for (const image of images) {
                    const file = image;
                    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}`;

                    // Upload to Supabase storage
                    const { data: uploadData, error: uploadError } = await supabase.storage
                        .from('listing_images')
                        .upload(fileName, file, {
                            contentType: file.type,
                            upsert: false
                        });

                    if (uploadError) {
                        console.error('Upload error:', uploadError);
                        setError('Error uploading images. Please try again.');
                        toast.error('Failed to upload images');
                        setSaveLoading(false);
                        return;
                    }

                    const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL + fileName;

                    // Store image reference in database
                    const { error: dbError } = await supabase
                        .from('listing_images')
                        .insert([{
                            url: imageUrl,
                            listing_id: resolvedParams.id
                        }]);

                    if (dbError) {
                        console.error('Database image error:', dbError);
                        setError('Error saving image references. Please try again.');
                        toast.error('Failed to save image references');
                        setSaveLoading(false);
                        return;
                    }
                }
            }

            setSuccess('Listing updated successfully! Your changes have been saved.');
            toast.success('Listing updated successfully');
            
            // Clear saved form state since changes are now saved
            clearSavedFormState();
            
            // Refresh the listing data
            await verifyUserRecord();
            
            // Clear the new images array since they're now saved
            setImages([]);

        } catch (error) {
            console.error('Unexpected error:', error);
            setError('An unexpected error occurred. Please try again.');
            toast.error('Failed to update listing');
        } finally {
            setSaveLoading(false);
        }
    }

    const publishBtnHandler = async () => {
        setPublishLoading(true);
        setError('');
        setSuccess('');

        try {
            // Validate that listing has minimum required data
            if (!listing?.business_name || !listing?.industry || !listing?.category || !listing?.description) {
                setError('Please complete all required fields before publishing.');
                toast.error('Complete all required fields first');
                setPublishLoading(false);
                return;
            }

            // Check for images
            const hasImages = listing?.listing_images && listing.listing_images.length > 0;
            if (!hasImages) {
                setError('Please add at least one image before publishing.');
                toast.error('At least one image is required');
                setPublishLoading(false);
                return;
            }

            const { data, error } = await supabase
                .from('listing')
                .update({ active: true })
                .eq('id', resolvedParams.id)
                .select();

            if (error) {
                console.error('Publish error:', error);
                setError('Failed to publish listing. Please try again.');
                toast.error('Failed to publish listing');
                setPublishLoading(false);
                return;
            }

            if (data) {
                setSuccess('Listing published successfully! It is now live and visible to users.');
                toast.success('Listing Published!');
                
                // Clear saved form state since listing is now published
                clearSavedFormState();
                
                // Refresh listing data
                await verifyUserRecord();
                
                // Redirect to view listing after a short delay
                setTimeout(() => {
                    router.push(`/view-listing/${resolvedParams.id}`);
                }, 2000);
            }

        } catch (error) {
            console.error('Unexpected publish error:', error);
            setError('An unexpected error occurred while publishing. Please try again.');
            toast.error('Failed to publish listing');
        } finally {
            setPublishLoading(false);
        }
    }

    // Show loading state while checking authentication
    if (status === 'loading' || initialLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
                <div className="text-center">
                    <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
                    <p className="text-muted-foreground">Loading listing...</p>
                </div>
            </div>
        );
    }

    // Show error state
    if (error && !listing?.id) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
                <div className="text-center max-w-md mx-auto px-6">
                    <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-foreground mb-4">Unable to Load Listing</h1>
                    <p className="text-muted-foreground mb-6">{error}</p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button asChild variant="outline">
                            <Link href="/admin">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Admin
                            </Link>
                        </Button>
                        <Button onClick={() => window.location.reload()}>
                            Try Again
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
            {/* Header Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20 pb-16">
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.1)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px] animate-pulse opacity-30"></div>
                
                <div className="relative mx-auto max-w-6xl px-6 pt-20 lg:px-8">
                    <div className="mb-8">
                        <Link href="/admin" className="inline-flex items-center text-primary hover:text-primary/80 transition-colors mb-6">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Admin Panel
                        </Link>
                        
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-6">
                                    <Building className="w-8 h-8 text-primary" />
                                </div>
                                
                                <h1 className="text-4xl lg:text-5xl font-black text-foreground leading-tight mb-4">
                                    Edit Listing
                                </h1>
                                
                                <p className="text-xl text-muted-foreground max-w-2xl">
                                    Update business details, photos, and contact information for {listing?.business_name || 'this listing'}.
                                </p>
                            </div>
                            
                            {listing?.active && (
                                <div className="hidden lg:block">
                                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-cyber/10 text-cyber font-semibold">
                                        <div className="w-2 h-2 bg-cyber rounded-full mr-2 animate-pulse"></div>
                                        Published Listing
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="relative -mt-8 z-10">
                <div className="max-w-6xl mx-auto px-6 lg:px-8">
                    <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 shadow-xl">

                        {/* Error Display */}
                        {error && (
                            <div className="p-6 border-b border-border/50">
                                <Alert className="border-destructive/20 bg-destructive/5">
                                    <AlertCircle className="h-4 w-4 text-destructive" />
                                    <AlertDescription className="text-destructive">
                                        {error}
                                    </AlertDescription>
                                </Alert>
                            </div>
                        )}

                        {/* Success Display */}
                        {success && (
                            <div className="p-6 border-b border-border/50">
                                <Alert className="border-cyber/20 bg-cyber/5">
                                    <CheckCircle2 className="h-4 w-4 text-cyber" />
                                    <AlertDescription className="text-cyber">
                                        {success}
                                    </AlertDescription>
                                </Alert>
                            </div>
                        )}

            <Formik
                initialValues={(() => {
                    const savedState = loadSavedFormState();
                    return savedState || {
                        business_name: listing?.business_name || '',
                        industry: listing?.industry || '',
                        category: listing?.category || '',
                        since: listing?.since || '',
                        price_range: listing?.price_range || '',
                        phone: listing?.phone || '',
                        url: listing?.url || '',
                        instagram_url: listing?.instagram_url || '',
                        business_email: listing?.business_email || '',
                        description: listing?.description || '',
                        featured: listing?.featured || false,
                        listing_type: listing?.listing_type || (listing?.featured ? 'premium' : 'basic'),
                        show_map: listing?.show_map || false,
                        social_proof_enabled: listing?.social_proof_enabled || false,
                        urgency_enabled: listing?.urgency_enabled || false,
                        profile_image: user?.imageUrl,
                        username: user?.fullName
                    };
                })()}
                enableReinitialize={true}
                onSubmit={(values) => {
                    onSubmitHandler(values);
                }}
            >
                {({
                    values,
                    handleChange,
                    handleSubmit,
                    setFieldValue
                }) => {
                    // Save form state whenever values change
                    // Note: We can't use useEffect here due to Rules of Hooks
                    // Form state saving will be handled differently

                    return (
                    <form onSubmit={handleSubmit}>
                        <div className="p-8">
                            <div className="space-y-8">
                                {/* Basic Information Section */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 mb-6">
                                        <Factory className="w-6 h-6 text-primary" />
                                        <h2 className="text-2xl font-bold text-foreground">Basic Information</h2>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-foreground flex items-center gap-2">
                                                <Factory className="w-4 h-4" />
                                                Industry Type *
                                            </label>
                                            <Select
                                                onValueChange={(value) => setFieldValue('industry', value)}
                                                value={values.industry}
                                            >
                                                <SelectTrigger className="h-12">
                                                    <SelectValue placeholder="Select Industry Type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="automobile">Automobile</SelectItem>
                                                    <SelectItem value="child-care">Child Care</SelectItem>
                                                    <SelectItem value="decoration">Decoration</SelectItem>
                                                    <SelectItem value="farming">Farming</SelectItem>
                                                    <SelectItem value="fitness">Fitness</SelectItem>
                                                    <SelectItem value="food">Food</SelectItem>
                                                    <SelectItem value="hair-services">Hair Services</SelectItem>
                                                    <SelectItem value="handicraft">Handicraft</SelectItem>
                                                    <SelectItem value="housekeeping">Housekeeping</SelectItem>
                                                    <SelectItem value="immigration">Immigration</SelectItem>
                                                    <SelectItem value="makeup-services">Makeup Services</SelectItem>
                                                    <SelectItem value="personal-care">Personal Care Services</SelectItem>
                                                    <SelectItem value="pet-services">Pet Services</SelectItem>
                                                    <SelectItem value="photography">Photography</SelectItem>
                                                    <SelectItem value="real-estate">Real Estate</SelectItem>
                                                    <SelectItem value="technology">Technology</SelectItem>
                                                    <SelectItem value="trades">Trades</SelectItem>
                                                    <SelectItem value="tutoring">Tutoring</SelectItem>
                                                    <SelectItem value="videography">Videography</SelectItem>
                                                    <SelectItem value="wedding">Wedding</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-foreground flex items-center gap-2">
                                                <Filter className="w-4 h-4" />
                                                Category *
                                            </label>
                                            <Select
                                                onValueChange={(value) => setFieldValue('category', value)}
                                                value={values.category}
                                            >
                                                <SelectTrigger className="h-12">
                                                    <SelectValue placeholder="Select Category" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="auto-repair">Auto Repair</SelectItem>
                                                    <SelectItem value="bridal-wear">Bridal Wear</SelectItem>
                                                    <SelectItem value="catering">Catering</SelectItem>
                                                    <SelectItem value="custom-cakes">Custom Cakes</SelectItem>
                                                    <SelectItem value="custom-cookies">Custom Cookies</SelectItem>
                                                    <SelectItem value="custom-food">Custom Food / Delicacy</SelectItem>
                                                    <SelectItem value="dog-sitter">Dog Sitter</SelectItem>
                                                    <SelectItem value="electrician">Electrician</SelectItem>
                                                    <SelectItem value="eyebrows">Eyebrows</SelectItem>
                                                    <SelectItem value="facials">Facials</SelectItem>
                                                    <SelectItem value="family-photos">Family Photography</SelectItem>
                                                    <SelectItem value="decoration">Flowers & Decoration</SelectItem>
                                                    <SelectItem value="hair-dresser">Hair Dresser</SelectItem>
                                                    <SelectItem value="home-cook">Home Cook</SelectItem>
                                                    <SelectItem value="house-cleaner">House Cleaner</SelectItem>
                                                    <SelectItem value="lashes">Lashes</SelectItem>
                                                    <SelectItem value="lifestyle-photos">Lifestyle Photography</SelectItem>
                                                    <SelectItem value="mehndi">Mehndi</SelectItem>
                                                    <SelectItem value="misc">Misc</SelectItem>
                                                    <SelectItem value="music">Music</SelectItem>
                                                    <SelectItem value="nails">Nails</SelectItem>
                                                    <SelectItem value="nutrition">Nutrition</SelectItem>
                                                    <SelectItem value="other">Other</SelectItem>
                                                    <SelectItem value="personal-trainer">Personal Trainer</SelectItem>
                                                    <SelectItem value="pet-groomer">Pet Groomer</SelectItem>
                                                    <SelectItem value="plumber">Plumber</SelectItem>
                                                    <SelectItem value="restaurant">Restaurant</SelectItem>
                                                    <SelectItem value="web-development">Web Development</SelectItem>
                                                    <SelectItem value="wedding-sweets">Wedding Cakes & Sweets</SelectItem>
                                                    <SelectItem value="wedding-makeup-hair">Wedding Hair & Makeup</SelectItem>
                                                    <SelectItem value="wedding-photos-videos">Wedding Photos / Videos</SelectItem>
                                                    <SelectItem value="wedding-planner">Wedding Planner</SelectItem>
                                                    <SelectItem value="wedding-wear">Wedding Wear</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-foreground flex items-center gap-2">
                                                <Calendar className="w-4 h-4" />
                                                In Business Since
                                            </label>
                                            <Input 
                                                type="number" 
                                                placeholder="e.g. 2018"
                                                onChange={handleChange}
                                                value={values.since || listing?.since || ''}
                                                name="since"
                                                className="h-12"
                                            />
                                        </div>
                                    </div>
                                </div>
                                {/* Business Details Section */}
                                <div className="space-y-6">
                                    <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
                                    <div className="flex items-center gap-3 mb-6">
                                        <Building className="w-6 h-6 text-primary" />
                                        <h2 className="text-2xl font-bold text-foreground">Business Details</h2>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-foreground flex items-center gap-2">
                                                <Building className="w-4 h-4" />
                                                Business Name *
                                            </label>
                                            <Input 
                                                type="text" 
                                                placeholder="Your Business Name"
                                                value={values.business_name || listing?.business_name || ''}
                                                name="business_name"
                                                onChange={handleChange}
                                                className="h-12"
                                            />
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-foreground flex items-center gap-2">
                                                <DollarSign className="w-4 h-4" />
                                                Hourly Price Range
                                            </label>
                                            <Select
                                                onValueChange={(value) => setFieldValue('price_range', value)}
                                                name="price_range"
                                                value={values.price_range}
                                            >
                                                <SelectTrigger className="h-12">
                                                    <SelectValue placeholder="Select Price Range" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="$100 and under">$ = $100 and under</SelectItem>
                                                    <SelectItem value="$100-$250">$$ = $100-$250</SelectItem>
                                                    <SelectItem value="$250-$500">$$$ = $250-$500</SelectItem>
                                                    <SelectItem value="$500+">$$$$ = $500+</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    
                                    {/* Display Options Toggles */}
                                    <div className="mt-6 space-y-4">
                                        {/* Map Display Toggle */}
                                        <div className="bg-muted/30 rounded-xl p-6">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <Map className="w-6 h-6 text-primary" />
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-foreground">Map Display</h3>
                                                        <p className="text-sm text-muted-foreground">
                                                            Show the "Find On Map" section on your listing page
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            className="sr-only peer"
                                                            checked={values.show_map || false}
                                                            onChange={(e) => setFieldValue('show_map', e.target.checked)}
                                                        />
                                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="mt-3 text-xs text-muted-foreground">
                                                {values.show_map 
                                                    ? "✓ Map section will be visible to visitors" 
                                                    : "Map section will be hidden from visitors"
                                                }
                                            </div>
                                        </div>

                                        {/* Social Proof Toggle */}
                                        <div className="bg-muted/30 rounded-xl p-6">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <Award className="w-6 h-6 text-green-600" />
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-foreground">Social Proof Section</h3>
                                                        <p className="text-sm text-muted-foreground">
                                                            Show "Trusted by Community" section with ratings and reviews
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            className="sr-only peer"
                                                            checked={values.social_proof_enabled || false}
                                                            onChange={(e) => setFieldValue('social_proof_enabled', e.target.checked)}
                                                        />
                                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-600/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="mt-3 text-xs text-muted-foreground">
                                                {values.social_proof_enabled 
                                                    ? "✓ Social proof section will be visible to visitors" 
                                                    : "Social proof section will be hidden from visitors"
                                                }
                                            </div>
                                        </div>

                                        {/* Urgency/Scarcity Toggle */}
                                        <div className="bg-muted/30 rounded-xl p-6">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <Clock className="w-6 h-6 text-orange-600" />
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-foreground">Urgency Section</h3>
                                                        <p className="text-sm text-muted-foreground">
                                                            Show "Limited Availability" section to create urgency
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            className="sr-only peer"
                                                            checked={values.urgency_enabled || false}
                                                            onChange={(e) => setFieldValue('urgency_enabled', e.target.checked)}
                                                        />
                                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-600/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="mt-3 text-xs text-muted-foreground">
                                                {values.urgency_enabled 
                                                    ? "✓ Urgency section will be visible to visitors" 
                                                    : "Urgency section will be hidden from visitors"
                                                }
                                            </div>
                                        </div>

                                        {/* Premium Listing Toggle */}
                                        <div className="bg-gradient-to-r from-pink-500/10 to-rose-500/10 border-2 border-pink-500/20 rounded-xl p-6">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg flex items-center justify-center">
                                                        <Star className="w-5 h-5 text-white" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-bold text-foreground">Premium Listing</h3>
                                                        <p className="text-sm text-muted-foreground">
                                                            Upgrade to Premium for full features, contact information, and enhanced visibility
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            className="sr-only peer"
                                                            checked={values.featured || false}
                                                            onChange={(e) => {
                                                                setFieldValue('featured', e.target.checked);
                                                                setFieldValue('listing_type', e.target.checked ? 'premium' : 'basic');
                                                            }}
                                                        />
                                                        <div className="w-12 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-500/20 rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-pink-500 peer-checked:to-rose-500"></div>
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="mt-4 p-4 bg-pink-500/5 rounded-lg border border-pink-500/10">
                                                <div className="text-sm text-muted-foreground">
                                                    {values.featured ? (
                                                        <div className="flex items-center gap-2 text-pink-600 dark:text-pink-400">
                                                            <Star className="w-4 h-4 fill-current" />
                                                            <span className="font-medium">Premium features enabled: Full contact info, business description, map location, and enhanced visibility</span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-2">
                                                            <span>Basic listing: Limited features, upgrade to Premium for full functionality</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Contact Information Section */}
                                <div className="space-y-6">
                                    <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
                                    <div className="flex items-center gap-3 mb-6">
                                        <Phone className="w-6 h-6 text-primary" />
                                        <h2 className="text-2xl font-bold text-foreground">Contact Information</h2>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-foreground flex items-center gap-2">
                                                <Phone className="w-4 h-4" />
                                                Business Phone
                                            </label>
                                            <Input 
                                                type="text" 
                                                placeholder="778-111-0000"
                                                value={values.phone || listing?.phone || ''}
                                                name="phone"
                                                onChange={handleChange}
                                                className="h-12"
                                            />
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-foreground flex items-center gap-2">
                                                <Mail className="w-4 h-4" />
                                                Business Email
                                            </label>
                                            <Input 
                                                type="email" 
                                                placeholder="contact@yourbusiness.com"
                                                value={values.business_email || ''}
                                                name="business_email"
                                                onChange={handleChange}
                                                className="h-12"
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                This email will be displayed as the contact email for this listing
                                            </p>
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-foreground flex items-center gap-2">
                                                <Globe className="w-4 h-4" />
                                                Business Website
                                            </label>
                                            <Input 
                                                type="text" 
                                                placeholder="https://www.example.com"
                                                value={values.url || listing?.url || ''}
                                                name="url"
                                                onChange={handleChange}
                                                className="h-12"
                                            />
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-foreground flex items-center gap-2">
                                                <Instagram className="w-4 h-4" />
                                                Instagram URL
                                            </label>
                                            <Input 
                                                type="text" 
                                                placeholder="https://www.instagram.com/yourbusiness"
                                                value={values.instagram_url || listing?.instagram_url || ''}
                                                name="instagram_url"
                                                onChange={handleChange}
                                                className="h-12"
                                            />
                                        </div>
                                    </div>
                                </div>
                                {/* Description Section */}
                                <div className="space-y-6">
                                    <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
                                    <div className="flex items-center gap-3 mb-6">
                                        <FileText className="w-6 h-6 text-primary" />
                                        <h2 className="text-2xl font-bold text-foreground">Business Description</h2>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">
                                            Tell us about your business *
                                        </label>
                                        <p className="text-sm text-muted-foreground mb-3">
                                            Describe what makes your business special, the services you offer, your experience, and what customers can expect.
                                        </p>
                                        <Textarea 
                                            placeholder="Write a detailed description of your business, services, and what makes you unique..."
                                            name="description"
                                            onChange={handleChange}
                                            value={values.description || listing?.description || ''}
                                            className="min-h-32 resize-y"
                                        />
                                    </div>
                                </div>
                                {/* Images Section */}
                                <div className="space-y-6">
                                    <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
                                    <div className="flex items-center gap-3 mb-6">
                                        <ImageIcon className="w-6 h-6 text-primary" />
                                        <h2 className="text-2xl font-bold text-foreground">Business Images</h2>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                                            <p className="text-sm text-foreground/80 mb-2">
                                                <strong>Upload high-quality images</strong> that showcase your business, services, or products.
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                Maximum 2 new images can be uploaded. Existing images will remain unless you delete them.
                                            </p>
                                        </div>
                                        
                                        <FileUpload
                                            setImages={(value) => setImages(value)}
                                            imageList={listing?.listing_images}
                                            onImageDeleted={verifyUserRecord}
                                        />
                                    </div>
                                </div>
                                {/* Action Buttons Section */}
                                <div className="space-y-6">
                                    <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
                                    
                                    <div className="bg-muted/30 rounded-xl p-6">
                                        <p className="text-sm text-muted-foreground mb-4 text-center">
                                            Make sure to <strong className="text-cyber">Save</strong> your changes before <strong className="text-primary">Publishing</strong> the listing.
                                        </p>
                                        
                                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                            <Button 
                                                type="submit"
                                                variant="outline" 
                                                disabled={saveLoading || publishLoading}
                                                className="h-12 text-lg font-semibold border-2 border-cyber text-cyber hover:bg-cyber/10 transition-all duration-300"
                                            >
                                                {saveLoading ? (
                                                    <div className="flex items-center gap-2">
                                                        <Loader className="w-5 h-5 animate-spin" />
                                                        Saving...
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2">
                                                        <Save className="w-5 h-5" />
                                                        Save Changes
                                                    </div>
                                                )}
                                            </Button>

                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button 
                                                        type="button" 
                                                        disabled={saveLoading || publishLoading || !listing?.active && (!listing?.business_name || !listing?.industry || !listing?.category || !listing?.description)}
                                                        className="h-12 text-lg font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:transform-none disabled:opacity-50"
                                                    >
                                                        {publishLoading ? (
                                                            <div className="flex items-center gap-2">
                                                                <Loader className="w-5 h-5 animate-spin" />
                                                                Publishing...
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center gap-2">
                                                                <Send className="w-5 h-5" />
                                                                {listing?.active ? 'Update & Republish' : 'Publish Listing'}
                                                            </div>
                                                        )}
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent className="sm:max-w-md">
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle className="text-xl font-bold">
                                                            {listing?.active ? 'Update Published Listing?' : 'Ready to Publish?'}
                                                        </AlertDialogTitle>
                                                        <AlertDialogDescription className="text-base">
                                                            {listing?.active 
                                                                ? 'This will update the live listing with your changes. All users will see the updated information immediately.'
                                                                : 'Once published, your listing will be live and visible to all users on LakhStack. Make sure all information is correct.'}
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction 
                                                            onClick={() => publishBtnHandler()}
                                                            className="bg-primary hover:bg-primary/90"
                                                        >
                                                            {publishLoading ? (
                                                                <Loader className="w-4 h-4 animate-spin mr-2" />
                                                            ) : (
                                                                <Send className="w-4 h-4 mr-2" />
                                                            )}
                                                            {listing?.active ? 'Update Listing' : 'Publish Listing'}
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                    );
                }}
            </Formik>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditListing