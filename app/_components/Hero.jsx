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
                    <h1 className="font-display text-4xl font-black tracking-tight text-foreground sm:text-6xl md:text-7xl lg:text-8xl leading-none mt-6">
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
                    <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
                        <Link href="/all-listings">
                            <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg font-semibold bg-foreground text-background hover:bg-foreground/90 transition-all duration-300 transform hover:-translate-y-0.5">
                                Explore Vendors
                            </Button>
                        </Link>
                        <Link href="/add-new-listing">
                            <Button variant="outline" size="lg" className="w-full sm:w-auto h-14 px-8 text-lg font-semibold border-2 border-accent text-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-300 transform hover:-translate-y-0.5">
                                List Your Business
                            </Button>
                        </Link>
                    </div>

                    {/* Trust Indicators */}
                    <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
                        <div className="rounded-3xl border border-border/70 bg-white/90 p-5 text-center shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
                            <div className="text-lg font-semibold text-foreground">Vetted</div>
                            <div className="text-xs text-muted-foreground mt-1">Quality-first listings</div>
                        </div>
                        <div className="rounded-3xl border border-border/70 bg-white/90 p-5 text-center shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
                            <div className="text-lg font-semibold text-foreground">Local</div>
                            <div className="text-xs text-muted-foreground mt-1">Built for real communities</div>
                        </div>
                        <div className="rounded-3xl border border-border/70 bg-white/90 p-5 text-center shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
                            <div className="text-lg font-semibold text-foreground">Trusted</div>
                            <div className="text-xs text-muted-foreground mt-1">No ad-driven rankings</div>
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
