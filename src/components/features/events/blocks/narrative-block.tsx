import type { NarrativeBlock as NarrativeBlockType } from '@/api/nexuscore/model'
import { cn } from '@/lib/utils'

interface NarrativeBlockProps {
    block: NarrativeBlockType
}

const alignClass = {
    left: 'text-left',
    center: 'text-center mx-auto',
    right: 'text-right ml-auto',
}

export function NarrativeBlock({ block }: NarrativeBlockProps) {
    const align = block.alignment ?? 'left'
    return (
        <section className="py-10 md:py-14">
            <div className="max-w-5xl mx-auto px-5 md:px-10">
                <div className={cn('max-w-3xl space-y-4', alignClass[align])}>
                    {block.eyebrow && (
                        <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                            {block.eyebrow}
                        </p>
                    )}
                    {block.heading && (
                        <h2 className="text-2xl md:text-3xl font-bold leading-tight">{block.heading}</h2>
                    )}
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{block.body}</p>
                </div>
            </div>
        </section>
    )
}
