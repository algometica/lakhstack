import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

const NOTES_DIR = path.join(process.cwd(), 'content/notes')

function getNote(slug) {
    const filePath = path.join(NOTES_DIR, `${slug}.mdx`)
    if (!fs.existsSync(filePath)) return null
    const { data, content } = matter(fs.readFileSync(filePath, 'utf8'))
    return { data, content }
}

export async function generateStaticParams() {
    const files = fs.readdirSync(NOTES_DIR).filter(f => f.endsWith('.mdx'))
    return files.map(file => ({ slug: file.replace(/\.mdx$/, '') }))
}

export async function generateMetadata({ params }) {
    const { slug } = await params
    const note = getNote(slug)
    if (!note) return {}
    return {
        title: `${note.data.title} | LakhStack Notes`,
        description: note.data.description,
    }
}

export default async function NotePage({ params }) {
    const { slug } = await params
    const note = getNote(slug)
    if (!note) notFound()

    const { data, content } = note

    return (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
            <Link
                href="/notes"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10"
            >
                <ArrowLeft className="w-4 h-4" />
                All Notes
            </Link>

            <header className="mb-10">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                    <time className="text-xs text-muted-foreground">{data.date}</time>
                    {data.tag && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-secondary/70 text-muted-foreground font-medium">
                            {data.tag}
                        </span>
                    )}
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-foreground leading-tight mb-3">
                    {data.title}
                </h1>
                {data.description && (
                    <p className="text-base text-muted-foreground leading-relaxed">{data.description}</p>
                )}
            </header>

            <article className="prose prose-neutral max-w-none prose-headings:font-bold prose-headings:text-foreground prose-p:text-foreground/80 prose-a:text-accent prose-li:text-foreground/80">
                <MDXRemote source={content} />
            </article>
        </div>
    )
}
