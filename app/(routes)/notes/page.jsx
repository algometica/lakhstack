import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import Link from 'next/link'

const NOTES_DIR = path.join(process.cwd(), 'content/notes')

function getNotes() {
    const files = fs.readdirSync(NOTES_DIR).filter(f => f.endsWith('.mdx'))
    return files
        .map(file => {
            const slug = file.replace(/\.mdx$/, '')
            const { data } = matter(fs.readFileSync(path.join(NOTES_DIR, file), 'utf8'))
            return { slug, ...data }
        })
        .sort((a, b) => new Date(b.date) - new Date(a.date))
}

export const metadata = {
    title: 'Notes | LakhStack',
    description: 'Thoughts, checklists, and industry notes from LakhStack.',
}

export default function NotesPage() {
    const notes = getNotes()

    return (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
            <div className="mb-10">
                <h1 className="text-3xl sm:text-4xl font-black text-foreground mb-2">Notes</h1>
                <p className="text-muted-foreground text-base">Thoughts, checklists, and industry notes.</p>
            </div>

            <ul className="divide-y divide-border/50">
                {notes.map(note => (
                    <li key={note.slug}>
                        <Link
                            href={`/notes/${note.slug}`}
                            className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 py-4 group"
                        >
                            <div className="flex items-center gap-3 shrink-0">
                                <time className="text-xs text-muted-foreground w-24 shrink-0">{note.date}</time>
                                {note.tag && (
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-secondary/70 text-muted-foreground font-medium shrink-0">
                                        {note.tag}
                                    </span>
                                )}
                            </div>
                            <span className="text-sm sm:text-base font-medium text-foreground group-hover:text-accent transition-colors duration-150">
                                {note.title}
                            </span>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}
