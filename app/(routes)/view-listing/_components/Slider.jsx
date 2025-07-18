import React from 'react'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import Image from 'next/image'


function Slider({ imageList }) {
    return (
        <div className="w-full h-full">
            {imageList && imageList.length > 0 ?
                <Carousel className="w-full h-full">
                    <CarouselContent>
                        {imageList.map((item, index) => (
                            <CarouselItem key={index}>
                                <div className="relative h-[60vh] w-full overflow-hidden">
                                    <Image
                                        src={item.url} 
                                        fill
                                        alt={`Business image ${index + 1}`}
                                        className='object-cover'
                                        priority={index === 0}
                                    />
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-4 bg-background/80 backdrop-blur-sm border-border hover:bg-background" />
                    <CarouselNext className="right-4 bg-background/80 backdrop-blur-sm border-border hover:bg-background" />
                </Carousel> 
                : 
                <div className='w-full h-[60vh] bg-gradient-to-br from-muted/50 to-muted animate-pulse relative'>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-muted-foreground/50 text-lg font-medium">Loading images...</div>
                    </div>
                </div>
            }
        </div>
    )
}

export default Slider