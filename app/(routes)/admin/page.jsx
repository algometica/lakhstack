"use client";

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { supabase } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
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
} from "@/components/ui/alert-dialog";
import { 
  Trash, 
  Edit, 
  Eye, 
  Users, 
  Building, 
  Star, 
  Search, 
  Filter,
  Plus,
  MapPin,
  Calendar,
  Phone,
  Globe,
  Instagram,
  DollarSign,
  Briefcase
} from 'lucide-react';
import Link from 'next/link';

const INDUSTRIES = [
  'wedding', 'fitness', 'personal-care', 'food', 'photography', 
  'pets', 'housekeeping', 'handicraft', 'technology', 'trades', 'immigration'
];

const PRICE_RANGES = ['$100 and under', '$100-$250', '$250-$500', '$500+'];

export default function AdminPanel() {
  const { data: session, status } = useSession();
  const user = session?.user;
  const isAdmin = user?.role === 'admin' || user?.isAdmin;
  
  // Debug logging
  console.log('Admin page - Session:', session);
  console.log('Admin page - User:', user);
  console.log('Admin page - Status:', status);
  console.log('Admin page - isAdmin:', isAdmin);
  
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('listings');
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [industryFilter, setIndustryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [featuredFilter, setFeaturedFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin]);

  useEffect(() => {
    filterListings();
  }, [listings, searchTerm, industryFilter, statusFilter, featuredFilter, priceFilter]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load listings with images
      const { data: listingsData } = await supabase
        .from('listing')
        .select('*, listing_images(url, listing_id)')
        .order('created_at', { ascending: false });

      // Load users
      const { data: usersData } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      setListings(listingsData || []);
      setUsers(usersData || []);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const filterListings = () => {
    let filtered = listings;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(listing => 
        listing.business_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.created_by?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Industry filter
    if (industryFilter) {
      filtered = filtered.filter(listing => listing.industry === industryFilter);
    }

    // Status filter
    if (statusFilter) {
      filtered = filtered.filter(listing => 
        statusFilter === 'active' ? listing.active : !listing.active
      );
    }

    // Featured filter
    if (featuredFilter) {
      filtered = filtered.filter(listing => 
        featuredFilter === 'featured' ? listing.featured : !listing.featured
      );
    }

    // Price filter
    if (priceFilter) {
      filtered = filtered.filter(listing => listing.price_range === priceFilter);
    }

    setFilteredListings(filtered);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setIndustryFilter('');
    setStatusFilter('');
    setFeaturedFilter('');
    setPriceFilter('');
  };

  const deleteListing = async (id) => {
    try {
      // Delete images first
      await supabase
        .from('listing_images')
        .delete()
        .eq('listing_id', id);

      // Delete listing
      await supabase
        .from('listing')
        .delete()
        .eq('id', id);

      toast.success('Listing deleted successfully');
      loadData();
    } catch (error) {
      toast.error('Failed to delete listing');
    }
  };

  const toggleListingStatus = async (id, currentStatus) => {
    try {
      await supabase
        .from('listing')
        .update({ active: !currentStatus })
        .eq('id', id);

      toast.success(`Listing ${!currentStatus ? 'activated' : 'deactivated'}`);
      loadData();
    } catch (error) {
      toast.error('Failed to update listing status');
    }
  };

  const toggleFeaturedStatus = async (id, currentFeatured) => {
    try {
      await supabase
        .from('listing')
        .update({ featured: !currentFeatured })
        .eq('id', id);

      toast.success(`Listing ${!currentFeatured ? 'marked as featured' : 'removed from featured'}`);
      loadData();
    } catch (error) {
      toast.error('Failed to update featured status');
    }
  };

  const deleteUser = async (id) => {
    try {
      await supabase
        .from('users')
        .delete()
        .eq('id', id);

      toast.success('User deleted successfully');
      loadData();
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  // Show loading while checking authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Check if user is authenticated
  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center bg-card p-6 sm:p-8 rounded-lg shadow-md border border-border max-w-md mx-4">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-4">Authentication Required</h1>
          <p className="text-muted-foreground mb-6">Please sign in to access the admin panel.</p>
          <Button asChild className="w-full sm:w-auto">
            <Link href="/auth/signin">Sign In</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Check admin permissions - Allow access for any authenticated user for now
  const ADMIN_EMAILS = [
    'harshkumaryadavg@gmail.com',
    'escoemelyn@gmail.com', 
    'lakhstack@gmail.com',
    'lakhstack.dev@gmail.com'
  ];

  const isAuthorizedAdmin = user?.email && ADMIN_EMAILS.includes(user.email);

  if (!isAuthorizedAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="text-center bg-card p-6 sm:p-8 rounded-lg shadow-md border border-border max-w-md w-full">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-6">You don't have permission to access this page.</p>
          <div className="text-sm text-muted-foreground mb-4 p-4 bg-muted/50 rounded border border-border/50">
            <p><strong>Debug info:</strong></p>
            <p>Email: {user?.email || 'None'}</p>
            <p>Role: {user?.role || 'None'}</p>
            <p>isAdmin (from token): {isAdmin ? 'Yes' : 'No'}</p>
            <p>isAuthorizedAdmin: {isAuthorizedAdmin ? 'Yes' : 'No'}</p>
            <p>Session status: {status}</p>
          </div>
          <Button asChild className="w-full sm:w-auto">
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">Welcome back, {user?.name}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-card p-4 sm:p-6 rounded-lg shadow-sm border border-border">
            <div className="flex items-center">
              <Building className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">Total Listings</p>
                <p className="text-xl sm:text-2xl font-bold text-foreground">{listings.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-card p-4 sm:p-6 rounded-lg shadow-sm border border-border">
            <div className="flex items-center">
              <Star className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-500" />
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">Featured</p>
                <p className="text-xl sm:text-2xl font-bold text-foreground">
                  {listings.filter(l => l.featured).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-card p-4 sm:p-6 rounded-lg shadow-sm border border-border">
            <div className="flex items-center">
              <div className="h-6 w-6 sm:h-8 sm:w-8 bg-green-500/20 rounded-full flex items-center justify-center">
                <div className="h-3 w-3 sm:h-4 sm:w-4 bg-green-500 rounded-full"></div>
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">Active</p>
                <p className="text-xl sm:text-2xl font-bold text-foreground">
                  {listings.filter(l => l.active).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-card p-4 sm:p-6 rounded-lg shadow-sm border border-border">
            <div className="flex items-center">
              <Users className="h-6 w-6 sm:h-8 sm:w-8 text-purple-500" />
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">Total Users</p>
                <p className="text-xl sm:text-2xl font-bold text-foreground">{users.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-border mb-6 sm:mb-8">
          <nav className="-mb-px flex space-x-4 sm:space-x-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab('listings')}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'listings'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
              }`}
            >
              <Building className="inline-block w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Listings</span>
              <span className="sm:hidden">Lists</span>
              <span className="ml-1">({listings.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'users'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
              }`}
            >
              <Users className="inline-block w-4 h-4 mr-2" />
              Users ({users.length})
            </button>
          </nav>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading...</p>
          </div>
        ) : (
          <>
            {/* Listings Tab */}
            {activeTab === 'listings' && (
              <div className="space-y-6">
                {/* Search and Filters */}
                <div className="bg-card p-4 sm:p-6 rounded-lg shadow-sm border border-border">
                  <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between mb-4">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 flex-1">
                      <div className="relative flex-1 sm:max-w-xs">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search listings..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center justify-center sm:justify-start"
                      >
                        <Filter className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">Filters</span>
                        <span className="sm:hidden">Filter</span>
                      </Button>
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                      <Button onClick={clearFilters} variant="outline" size="sm" className="w-full sm:w-auto">
                        Clear All
                      </Button>
                      <span className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
                        {filteredListings.length} of {listings.length} listings
                      </span>
                    </div>
                  </div>

                  {/* Filter Options */}
                  {showFilters && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Industry
                        </label>
                        <select
                          value={industryFilter}
                          onChange={(e) => setIndustryFilter(e.target.value)}
                          className="w-full rounded-md border-border shadow-sm focus:border-primary focus:ring-primary"
                        >
                          <option value="">All Industries</option>
                          {INDUSTRIES.map(industry => (
                            <option key={industry} value={industry}>
                              {industry.charAt(0).toUpperCase() + industry.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Status
                        </label>
                        <select
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                          className="w-full rounded-md border-border shadow-sm focus:border-primary focus:ring-primary"
                        >
                          <option value="">All Status</option>
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Featured
                        </label>
                        <select
                          value={featuredFilter}
                          onChange={(e) => setFeaturedFilter(e.target.value)}
                          className="w-full rounded-md border-border shadow-sm focus:border-primary focus:ring-primary"
                        >
                          <option value="">All Listings</option>
                          <option value="featured">Featured</option>
                          <option value="regular">Regular</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Price Range
                        </label>
                        <select
                          value={priceFilter}
                          onChange={(e) => setPriceFilter(e.target.value)}
                          className="w-full rounded-md border-border shadow-sm focus:border-primary focus:ring-primary"
                        >
                          <option value="">All Prices</option>
                          {PRICE_RANGES.map(range => (
                            <option key={range} value={range}>{range}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                {/* Listings Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                  {filteredListings.map((listing) => (
                    <div key={listing.id} className="bg-card rounded-lg shadow-sm border overflow-hidden">
                      {/* Image */}
                      <div className="h-48 bg-muted relative">
                        {listing.listing_images && listing.listing_images.length > 0 ? (
                          <img
                            src={listing.listing_images[0].url}
                            alt={listing.business_name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            <Building className="h-16 w-16" />
                          </div>
                        )}
                        {/* Status badges */}
                        <div className="absolute top-2 right-2 space-y-1">
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              listing.active
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {listing.active ? 'Active' : 'Inactive'}
                          </span>
                          {listing.featured && (
                            <span className="block px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              Featured
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4 sm:p-6">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-semibold text-foreground truncate">
                            {listing.business_name || 'Unnamed Business'}
                          </h3>
                          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                            {listing.industry}
                          </span>
                        </div>

                        <div className="space-y-2 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2" />
                            <span className="truncate">{listing.address}</span>
                          </div>
                          <div className="flex items-center">
                            <Briefcase className="h-4 w-4 mr-2" />
                            <span>{listing.category}</span>
                          </div>
                          {listing.price_range && (
                            <div className="flex items-center">
                              <DollarSign className="h-4 w-4 mr-2" />
                              <span>{listing.price_range}</span>
                            </div>
                          )}
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            <span>{new Date(listing.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>

                        <div className="text-xs text-muted-foreground mb-4">
                          Created by: {listing.created_by}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row flex-wrap gap-2">
                          <Link href={`/view-listing/${listing.id}`}>
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                          </Link>
                          <Link href={`/edit-listing/${listing.id}`}>
                            <Button size="sm" variant="outline">
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleListingStatus(listing.id, listing.active)}
                          >
                            {listing.active ? 'Deactivate' : 'Activate'}
                          </Button>
                          <Button
                            size="sm"
                            variant={listing.featured ? "default" : "outline"}
                            onClick={() => toggleFeaturedStatus(listing.id, listing.featured)}
                            className={listing.featured ? "bg-yellow-500 hover:bg-yellow-600" : ""}
                          >
                            <Star className="w-4 h-4 mr-1" />
                            {listing.featured ? 'Unfeature' : 'Feature'}
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="destructive"
                              >
                                <Trash className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Listing</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this listing for "{listing.business_name}"? 
                                  This action cannot be undone and will permanently remove the listing and all associated images.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => deleteListing(listing.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete Listing
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredListings.length === 0 && (
                  <div className="text-center py-12">
                    <Building className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No listings found matching your criteria.</p>
                  </div>
                )}
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="bg-card shadow rounded-lg border border-border">
                <div className="px-4 sm:px-6 py-4 border-b border-border">
                  <h2 className="text-base sm:text-lg font-medium text-foreground">All Users</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-border">
                    <thead className="bg-muted/20">
                      <tr>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider hidden sm:table-cell">
                          Email
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider hidden md:table-cell">
                          Created
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-card divide-y divide-border">
                      {users.map((userItem) => (
                        <tr key={userItem.id}>
                          <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-8 w-8 sm:h-10 sm:w-10 bg-muted rounded-full flex items-center justify-center">
                                {userItem.image ? (
                                  <img
                                    src={userItem.image}
                                    alt={userItem.name}
                                    className="h-8 w-8 sm:h-10 sm:w-10 rounded-full"
                                  />
                                ) : (
                                  <span className="text-muted-foreground font-medium text-xs sm:text-sm">
                                    {userItem.name?.charAt(0).toUpperCase()}
                                  </span>
                                )}
                              </div>
                              <div className="ml-2 sm:ml-4">
                                <div className="text-sm font-medium text-foreground">
                                  {userItem.name}
                                </div>
                                <div className="text-xs text-muted-foreground sm:hidden">
                                  {userItem.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-muted-foreground hidden sm:table-cell">
                            {userItem.email}
                          </td>
                          <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                userItem.role === 'admin'
                                  ? 'bg-purple-500/20 text-purple-600 dark:text-purple-400'
                                  : 'bg-muted text-muted-foreground'
                              }`}
                            >
                              {userItem.role || 'user'}
                            </span>
                          </td>
                          <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-muted-foreground hidden md:table-cell">
                            {new Date(userItem.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {userItem.role !== 'admin' && (
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => deleteUser(userItem.id)}
                              >
                                <Trash className="w-4 h-4" />
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}