"use client"

import React, { useState } from 'react'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Expand } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

function ImageCarousel({ imageList }) {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    // Keyboard navigation for expanded view
    React.useEffect(() => {
        const handleKeyDown = (event) => {
            if (!isDialogOpen) return
            
            if (event.key === 'ArrowLeft') {
                event.preventDefault()
                setSelectedImageIndex(prev => 
                    prev === 0 ? imageList.length - 1 : prev - 1
                )
            } else if (event.key === 'ArrowRight') {
                event.preventDefault()
                setSelectedImageIndex(prev => 
                    prev === imageList.length - 1 ? 0 : prev + 1
                )
            }
        }

        if (isDialogOpen) {
            document.addEventListener('keydown', handleKeyDown)
            return () => document.removeEventListener('keydown', handleKeyDown)
        }
    }, [isDialogOpen, imageList.length])

    if (!imageList || imageList.length === 0) {
        return (
            <div className='bg-gradient-to-br from-muted/50 to-muted rounded-2xl p-8 text-center border border-border/50'>
                <p className="text-muted-foreground">No images available for this listing</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Main Image Display */}
            <div className="relative group">
                <div className="relative h-64 sm:h-80 md:h-96 lg:h-[500px] w-full overflow-hidden rounded-2xl border border-border/50 shadow-lg">
                    <Image
                        src={imageList[selectedImageIndex]?.url}
                        fill
                        alt={`Business image ${selectedImageIndex + 1}`}
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        priority
                    />
                    
                    {/* Expand Button */}
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm border-border/50 hover:bg-background opacity-0 group-hover:opacity-100 transition-all duration-300"
                            >
                                <Expand className="h-4 w-4" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl w-[95vw] sm:w-full p-0 bg-transparent border-none">
                            <DialogTitle className="sr-only">Business Image Gallery</DialogTitle>
                            <div className="relative w-full h-[60vh] sm:h-[70vh] md:h-[80vh] group">
                                <Image
                                    src={imageList[selectedImageIndex]?.url}
                                    fill
                                    alt={`Business image ${selectedImageIndex + 1} - Full size`}
                                    className="object-contain"
                                />
                                
                                {/* Navigation Controls in Expanded View */}
                                {imageList.length > 1 && (
                                    <>
                                        {/* Previous Button */}
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-background/90 backdrop-blur-sm border-border/50 hover:bg-background opacity-80 hover:opacity-100 transition-all duration-300 z-10"
                                            onClick={() => setSelectedImageIndex(prev => 
                                                prev === 0 ? imageList.length - 1 : prev - 1
                                            )}
                                        >
                                            <ChevronLeft className="h-5 w-5" />
                                        </Button>
                                        
                                        {/* Next Button */}
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-background/90 backdrop-blur-sm border-border/50 hover:bg-background opacity-80 hover:opacity-100 transition-all duration-300 z-10"
                                            onClick={() => setSelectedImageIndex(prev => 
                                                prev === imageList.length - 1 ? 0 : prev + 1
                                            )}
                                        >
                                            <ChevronRight className="h-5 w-5" />
                                        </Button>
                                    </>
                                )}

                                {/* Image Counter in Expanded View */}
                                <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 bg-background/90 backdrop-blur-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 border border-border/50 opacity-80 hover:opacity-100 transition-opacity duration-300">
                                    <span className="text-sm font-medium text-foreground">
                                        {selectedImageIndex + 1} / {imageList.length}
                                    </span>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>

                    {/* Navigation Arrows for Main Image */}
                    {imageList.length > 1 && (
                        <>
                            <Button
                                variant="outline"
                                size="icon"
                                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm border-border/50 hover:bg-background opacity-0 group-hover:opacity-100 transition-all duration-300"
                                onClick={() => setSelectedImageIndex(prev => 
                                    prev === 0 ? imageList.length - 1 : prev - 1
                                )}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm border-border/50 hover:bg-background opacity-0 group-hover:opacity-100 transition-all duration-300"
                                onClick={() => setSelectedImageIndex(prev => 
                                    prev === imageList.length - 1 ? 0 : prev + 1
                                )}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </>
                    )}

                    {/* Image Counter */}
                    <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 border border-border/50">
                        <span className="text-sm font-medium text-foreground">
                            {selectedImageIndex + 1} / {imageList.length}
                        </span>
                    </div>
                </div>
            </div>

            {/* Thumbnail Carousel */}
            {imageList.length > 1 && (
                <div className="space-y-3">
                    <h3 className="text-base sm:text-lg font-semibold text-foreground">All Images</h3>
                    <Carousel className="w-full">
                        <CarouselContent className="-ml-1 sm:-ml-2">
                            {imageList.map((item, index) => (
                                <CarouselItem key={index} className="pl-1 sm:pl-2 basis-1/4 sm:basis-1/4 md:basis-1/5 lg:basis-1/6">
                                    <div 
                                        className={`relative h-16 sm:h-20 w-full overflow-hidden rounded-lg sm:rounded-xl cursor-pointer border-2 transition-all duration-300 ${
                                            selectedImageIndex === index 
                                                ? 'border-primary shadow-lg ring-2 ring-primary/20' 
                                                : 'border-border/50 hover:border-primary/50'
                                        }`}
                                        onClick={() => setSelectedImageIndex(index)}
                                    >
                                        <Image
                                            src={item.url}
                                            fill
                                            alt={`Thumbnail ${index + 1}`}
                                            className="object-cover transition-transform duration-300 hover:scale-110"
                                        />
                                        {selectedImageIndex === index && (
                                            <div className="absolute inset-0 bg-primary/10" />
                                        )}
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="bg-background/80 backdrop-blur-sm border-border/50 hover:bg-background" />
                        <CarouselNext className="bg-background/80 backdrop-blur-sm border-border/50 hover:bg-background" />
                    </Carousel>
                </div>
            )}
        </div>
    )
}

export default ImageCarousel