"use client";

import { MapPin, X } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

function GoogleAddressSearch({ selectedAddress, setCoordinates, clearTrigger }) {
    const [inputValue, setInputValue] = useState('');
    const [predictions, setPredictions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showPredictions, setShowPredictions] = useState(false);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const debounceRef = useRef(null);

    // Clear search when parent triggers it
    useEffect(() => {
        if (clearTrigger > 0) {
            clearSelection();
        }
    }, [clearTrigger]);

    // Use Google Places API (New) REST endpoints directly
    const searchPlaces = async (input) => {
        if (!input.trim()) {
            setPredictions([]);
            setShowPredictions(false);
            return;
        }

        setIsLoading(true);

        try {
            // Try autocomplete first, fallback to text search
            let response = await fetch('/api/places/autocomplete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    input: input.trim(),
                }),
            });

            // If autocomplete fails, try text search as fallback
            if (!response.ok) {
                response = await fetch('/api/places/textsearch', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        input: input.trim(),
                    }),
                });
            }

            if (!response.ok) {
                const errorData = await response.json();
                console.error('API Error:', errorData);
                throw new Error(errorData.error || 'Failed to fetch places');
            }

            const data = await response.json();
            
            if (data.suggestions && Array.isArray(data.suggestions)) {
                setPredictions(data.suggestions);
                setShowPredictions(true);
            } else {
                setPredictions([]);
                setShowPredictions(false);
            }
        } catch (error) {
            console.error('Error fetching place predictions:', error);
            setPredictions([]);
            setShowPredictions(false);
            
            // Show user-friendly error for timeout/network issues
            if (error.message.includes('timeout') || error.message.includes('network') || error.name === 'AbortError') {
                // Could add a toast notification here if needed
                console.log('Location search temporarily unavailable due to network issues');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setInputValue(value);

        // Clear previous debounce timer
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        // Debounce the search
        debounceRef.current = setTimeout(() => {
            searchPlaces(value);
        }, 300);
    };

    const handlePlaceSelect = async (prediction) => {
        setInputValue(prediction.placePrediction?.text?.text || prediction.displayName || '');
        setShowPredictions(false);
        setSelectedPlace(prediction);

        try {
            // Get place details using the new Places API (New)
            const response = await fetch('/api/places/details', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    placeId: prediction.placePrediction?.placeId || prediction.place,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch place details');
            }

            const placeDetails = await response.json();
            
            if (placeDetails && placeDetails.location) {
                const coordinates = {
                    lat: placeDetails.location.latitude,
                    lng: placeDetails.location.longitude
                };
                
                // Create address object similar to the old library format
                const addressObject = {
                    label: placeDetails.formattedAddress || prediction.placePrediction?.text?.text || prediction.displayName,
                    value: prediction
                };

                setCoordinates(coordinates);
                selectedAddress(addressObject);
            }
        } catch (error) {
            console.error('Error fetching place details:', error);
            
            // Show user-friendly error for timeout/network issues
            if (error.message.includes('timeout') || error.message.includes('network') || error.name === 'AbortError') {
                console.log('Location details temporarily unavailable due to network issues');
            }
        }
    };

    const clearSelection = () => {
        setInputValue('');
        setSelectedPlace(null);
        setShowPredictions(false);
        setPredictions([]);
        selectedAddress(null);
        setCoordinates(null);
    };

    return (
        <div className='flex items-center w-full relative'>
            <MapPin className='absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary z-10' />
            
            <div className='relative flex-1'>
                <Input
                    type="text"
                    placeholder="Search By Location"
                    value={inputValue}
                    onChange={handleInputChange}
                    className="pl-10 pr-10 h-12 border-border/50 focus:border-primary bg-background/50"
                    onFocus={() => {
                        if (predictions.length > 0) {
                            setShowPredictions(true);
                        }
                    }}
                />
                
                {inputValue && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted/50"
                        onClick={clearSelection}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                )}

                {/* Predictions Dropdown */}
                {showPredictions && (predictions.length > 0 || isLoading) && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border/50 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                        {isLoading && (
                            <div className="p-3 text-center text-muted-foreground flex items-center justify-center">
                                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                                <span className="ml-2">Searching...</span>
                            </div>
                        )}
                        
                        {!isLoading && predictions.map((prediction, index) => (
                            <div
                                key={prediction.placePrediction?.placeId || prediction.place || index}
                                className="p-3 hover:bg-muted/50 cursor-pointer border-b border-border/30 last:border-b-0 transition-colors"
                                onClick={() => handlePlaceSelect(prediction)}
                            >
                                <div className="flex items-start gap-3">
                                    <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-foreground truncate">
                                            {prediction.placePrediction?.text?.text || 
                                             prediction.placePrediction?.structuredFormat?.mainText?.text ||
                                             prediction.displayName || 
                                             'Unknown location'}
                                        </p>
                                        <p className="text-sm text-muted-foreground truncate">
                                            {prediction.placePrediction?.structuredFormat?.secondaryText?.text || ''}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default GoogleAddressSearch