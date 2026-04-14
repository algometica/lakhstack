import Link from 'next/link'

function Footer() {
    return (
        <footer className="mt-20 border-t border-border/60 bg-white/70 backdrop-blur-sm">
            <div className="mx-auto max-w-7xl px-6 lg:px-10 py-10 sm:py-12">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                    {/* Brand */}
                    <div className="space-y-1">
                        <span className="text-lg font-black text-foreground font-display tracking-tight">LakhStack</span>
                        <p className="text-sm text-muted-foreground">Trusted event vendors, curated for real celebrations.</p>
                    </div>

                    {/* Links */}
                    <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-muted-foreground">
                        <Link href="/" className="hover:text-foreground transition-colors">Featured</Link>
                        <Link href="/all-listings" className="hover:text-foreground transition-colors">All Vendors</Link>
                        <Link href="/auth/signin" className="hover:text-foreground transition-colors">Admin Login</Link>
                    </nav>
                </div>

                <div className="mt-8 pt-6 border-t border-border/40 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-muted-foreground">
                    <p>© {new Date().getFullYear()} LakhStack. All rights reserved.</p>
                    <p>Curated vendors · No ad-driven rankings</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer
