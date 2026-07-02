import type { NarrativeBlock as NarrativeBlockType } from '@/api/nexuscore/model'

interface NarrativeBlockProps {
    block: NarrativeBlockType
}

export function NarrativeBlock({ block }: NarrativeBlockProps) {
    return (
        <section className="py-10 md:py-14">
            <div className="max-w-5xl mx-auto px-5 md:px-10">
                <div className="max-w-3xl space-y-4">
                    {block.heading && (
                        <h2 className="text-2xl md:text-3xl font-bold leading-tight">{block.heading}</h2>
                    )}
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                        {block.markdown}
                    </p>
                </div>
            </div>
        </section>
    )
}