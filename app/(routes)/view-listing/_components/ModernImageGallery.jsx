"use client"

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

function ModernImageGallery({ imageList }) {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0)
    const [isFullscreen, setIsFullscreen] = useState(false)

    // Ensure selectedImageIndex is within bounds when imageList changes
    useEffect(() => {
        if (imageList && imageList.length > 0 && selectedImageIndex >= imageList.length) {
            setSelectedImageIndex(0)
        }
    }, [imageList, selectedImageIndex])

    if (!imageList || imageList.length === 0) {
        return (
            <div className="bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-700">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                    <Expand className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-lg">No images available for this listing</p>
            </div>
        )
    }

    const nextImage = () => {
        setSelectedImageIndex((prev) => 
            prev === (imageList?.length || 1) - 1 ? 0 : prev + 1
        )
    }

    const prevImage = () => {
        setSelectedImageIndex((prev) => 
            prev === 0 ? (imageList?.length || 1) - 1 : prev - 1
        )
    }

    return (
        <div className="space-y-6">
            {/* Main Image Display */}
            <div className="relative group">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xl">
                    <Image
                        src={imageList?.[selectedImageIndex]?.url || '/placeholder.svg'}
                        fill
                        alt={`${imageList?.[selectedImageIndex]?.alt || 'Business image'} ${selectedImageIndex + 1}`}
                        className="object-cover transition-all duration-500 group-hover:scale-105"
                        priority
                    />
                    
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Navigation Arrows */}
                    {imageList && imageList.length > 1 && (
                        <>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg"
                                onClick={prevImage}
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg"
                                onClick={nextImage}
                            >
                                <ChevronRight className="w-5 h-5" />
                            </Button>
                        </>
                    )}

                    {/* Fullscreen Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-4 right-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg"
                        onClick={() => setIsFullscreen(true)}
                    >
                        <Expand className="w-5 h-5" />
                    </Button>

                    {/* Image Counter */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full px-4 py-2 border border-slate-200 dark:border-slate-700 shadow-lg">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            {selectedImageIndex + 1} / {imageList?.length || 0}
                        </span>
                    </div>
                </div>
            </div>

            {/* Thumbnail Gallery */}
            {imageList && imageList.length > 1 && (
                <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Gallery</h3>
                    <div className="flex gap-2 overflow-x-auto pb-1">
                        {imageList.map((image, index) => (
                            <button
                                key={index}
                                onClick={() => setSelectedImageIndex(index)}
                                className={cn(
                                    "relative flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-300 hover:scale-105",
                                    selectedImageIndex === index
                                        ? "border-blue-500 shadow-lg ring-2 ring-blue-500/20"
                                        : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                                )}
                            >
                                <Image
                                    src={image.url || '/placeholder.svg'}
                                    fill
                                    alt={`Thumbnail ${index + 1}`}
                                    className="object-cover"
                                />
                                {selectedImageIndex === index && (
                                    <div className="absolute inset-0 bg-blue-500/20" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Fullscreen Modal */}
            {isFullscreen && (
                <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="relative max-w-7xl max-h-full w-full h-full flex items-center justify-center">
                        <Image
                            src={imageList?.[selectedImageIndex]?.url || '/placeholder.svg'}
                            alt={`Fullscreen ${selectedImageIndex + 1}`}
                            width={1200}
                            height={800}
                            className="object-contain max-w-full max-h-full rounded-2xl"
                        />
                        
                        {/* Close Button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-4 right-4 bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white"
                            onClick={() => setIsFullscreen(false)}
                        >
                            <X className="w-6 h-6" />
                        </Button>

                        {/* Navigation in Fullscreen */}
                        {imageList && imageList.length > 1 && (
                            <>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white"
                                    onClick={prevImage}
                                >
                                    <ChevronLeft className="w-8 h-8" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white"
                                    onClick={nextImage}
                                >
                                    <ChevronRight className="w-8 h-8" />
                                </Button>
                            </>
                        )}

                        {/* Counter in Fullscreen */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
                            <span className="text-white font-medium">
                                {selectedImageIndex + 1} / {imageList?.length || 0}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ModernImageGallery
