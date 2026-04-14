import Link from 'next/link'

function Footer() {
    return (
        <footer className="border-t border-border/50 bg-white/60 backdrop-blur-sm">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                {/* Left: brand + copyright */}
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="font-black text-sm text-foreground font-display">LakhStack</span>
                    <span className="text-border">·</span>
                    <span>© {new Date().getFullYear()} All rights reserved.</span>
                </div>

                {/* Right: nav links */}
                <nav className="flex items-center gap-5 text-xs font-medium text-muted-foreground">
                    <Link href="/" className="hover:text-foreground transition-colors">Featured</Link>
                    <Link href="/all-listings" className="hover:text-foreground transition-colors">All Vendors</Link>
                    <Link href="/notes" className="hover:text-foreground transition-colors">Notes</Link>
                </nav>
            </div>
        </footer>
    )
}

export default Footer
