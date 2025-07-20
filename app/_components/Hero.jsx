import React from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

function Hero() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.1)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px] animate-pulse opacity-30"></div>
            
            <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
                <div className="mx-auto max-w-4xl text-center">
                    
                    {/* Main Heading - Bold and Authoritative */}
                    <h1 className="text-6xl font-black tracking-tight text-foreground sm:text-8xl md:text-9xl lg:text-[10rem] leading-none">
                        <span style={{ color: '#db4a2b' }}>LakhStack</span>
                    </h1>
                    
                    {/* Subheading */}
                    <h2 className="mt-8 text-xl font-semibold text-muted-foreground sm:text-2xl lg:text-3xl">
                        Your unbiased local business-listing platform
                    </h2>

                    {/* Value Proposition */}
                    <p className="mt-8 text-lg leading-8 text-foreground/70 max-w-2xl mx-auto sm:text-xl">
                        Discover authentic local businesses. No biased rankings. 
                        <strong className="text-primary font-semibold"> Just real recommendations.</strong>
                    </p>

                    {/* CTA Buttons */}
                    <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
                        <Link href="/all-listings">
                            <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg font-semibold bg-foreground text-background hover:bg-foreground/90 transition-all duration-300 transform hover:scale-105">
                                Explore All Listings
                            </Button>
                        </Link>
                        <Link href="/add-new-listing">
                            <Button variant="outline" size="lg" className="w-full sm:w-auto h-14 px-8 text-lg font-semibold border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 transform hover:scale-105">
                                List Your Business
                            </Button>
                        </Link>
                    </div>

                    {/* Trust Indicators */}
                    <div className="mt-16 flex flex-row justify-center items-center gap-4 sm:gap-6 lg:gap-8 max-w-4xl mx-auto">
                        <div className="text-center flex-1 min-w-0">
                            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary">100%</div>
                            <div className="text-xs sm:text-sm font-medium text-muted-foreground">Unbiased</div>
                        </div>
                        <div className="text-center flex-1 min-w-0">
                            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-cyber">Local</div>
                            <div className="text-xs sm:text-sm font-medium text-muted-foreground">Community Focus</div>
                        </div>
                        <div className="text-center flex-1 min-w-0">
                            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-neural">Verified</div>
                            <div className="text-xs sm:text-sm font-medium text-muted-foreground">Authentic Reviews</div>
                        </div>
                    </div>

                    {/* <div className="mt-8 flex flex-wrap justify-center gap-4">
                        <a
                            className="block w-full rounded bg-primary px-12 py-3 text-sm font-medium text-white shadow hover:bg-red-700 focus:outline-none focus:ring active:bg-red-500 sm:w-auto"
                            href="#"
                        >
                            Get Started
                        </a>

                        <a
                            className="block w-full rounded bg-primary px-12 py-3 text-sm font-medium text-white shadow hover:bg-red-700 focus:outline-none focus:ring active:bg-red-500 sm:w-auto"
                            href="#"
                        >
                            Get Started
                        </a>

                        <a
                            className="block w-full rounded bg-primary px-12 py-3 text-sm font-medium text-white shadow hover:bg-red-700 focus:outline-none focus:ring active:bg-red-500 sm:w-auto"
                            href="#"
                        >
                            Get Started
                        </a>

                        <a
                            className="block w-full rounded bg-primary px-12 py-3 text-sm font-medium text-white shadow hover:bg-red-700 focus:outline-none focus:ring active:bg-red-500 sm:w-auto"
                            href="#"
                        >
                            Get Started
                        </a>

                        <a
                            className="block w-full rounded bg-primary px-12 py-3 text-sm font-medium text-white shadow hover:bg-red-700 focus:outline-none focus:ring active:bg-red-500 sm:w-auto"
                            href="#"
                        >
                            Get Started
                        </a>

                        <a
                            className="block w-full rounded px-12 py-3 text-sm font-medium text-red-600 shadow hover:text-red-700 focus:outline-none focus:ring active:text-red-500 sm:w-auto"
                            href="#"
                        >
                            Learn More
                        </a>
                    </div> */}
                </div>
            </div>
        </section>
    )
}

export default Hero