import React from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

function Hero() {
    return (
        <section className="relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(241,99,74,0.14),transparent_55%),radial-gradient(circle_at_85%_10%,rgba(24,98,97,0.10),transparent_60%)]"></div>
            <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.95),rgba(255,255,255,0.6))]"></div>
            
            <div className="relative mx-auto max-w-6xl px-6 py-24 sm:py-28 lg:px-8">
                <div className="mx-auto max-w-3xl text-center">
                    <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-white/90 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                        Trusted event vendors
                    </div>
                    
                    {/* Main Heading - Bold and Authoritative */}
                    <h1 className="font-display text-4xl font-black tracking-tight sm:text-6xl md:text-7xl lg:text-8xl leading-none mt-6 bg-gradient-to-br from-accent via-orange-500 to-orange-700 bg-clip-text text-transparent">
                        LakhStack
                    </h1>
                    
                    {/* Subheading */}
                    <h2 className="mt-6 text-xl font-semibold text-foreground sm:text-2xl lg:text-3xl">
                        Plan your event with vendors you can trust
                    </h2>

                    {/* Value Proposition */}
                    <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto sm:text-xl">
                        Discover vetted photographers, planners, venues, and more. Curated for real events, not ad rankings.
                    </p>

                    {/* CTA Buttons */}
                    <div className="mt-10 flex justify-center">
                        <Link href="/all-listings">
                            <Button size="lg" className="h-14 px-10 text-lg font-semibold bg-foreground text-background hover:bg-foreground/90 transition-all duration-300 transform hover:-translate-y-0.5">
                                Explore Vendors
                            </Button>
                        </Link>
                    </div>

                    {/* Trust Indicators */}
                    <div className="mt-10 flex flex-row justify-center gap-3 sm:gap-4 flex-wrap">
                        <div className="flex items-center gap-2 rounded-full border border-border/70 bg-white/90 px-4 py-2.5 shadow-[0_6px_18px_rgba(15,23,42,0.07)] sm:flex-col sm:rounded-3xl sm:px-8 sm:py-5 sm:gap-1 sm:min-w-[120px]">
                            <span className="text-sm font-semibold text-foreground sm:text-lg">Vetted</span>
                            <span className="text-[11px] text-muted-foreground sm:text-xs">Quality-first listings</span>
                        </div>
                        <div className="flex items-center gap-2 rounded-full border border-border/70 bg-white/90 px-4 py-2.5 shadow-[0_6px_18px_rgba(15,23,42,0.07)] sm:flex-col sm:rounded-3xl sm:px-8 sm:py-5 sm:gap-1 sm:min-w-[120px]">
                            <span className="text-sm font-semibold text-foreground sm:text-lg">Local</span>
                            <span className="text-[11px] text-muted-foreground sm:text-xs">Built for real communities</span>
                        </div>
                        <div className="flex items-center gap-2 rounded-full border border-border/70 bg-white/90 px-4 py-2.5 shadow-[0_6px_18px_rgba(15,23,42,0.07)] sm:flex-col sm:rounded-3xl sm:px-8 sm:py-5 sm:gap-1 sm:min-w-[120px]">
                            <span className="text-sm font-semibold text-foreground sm:text-lg">Trusted</span>
                            <span className="text-[11px] text-muted-foreground sm:text-xs">No ad-driven rankings</span>
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
