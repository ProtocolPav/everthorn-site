import type { HighlightGridBlock as HighlightGridBlockType } from '@/api/nexuscore/model'
import { IconResolver } from '../icon-resolver'
import { cn } from '@/lib/utils'

interface HighlightGridBlockProps {
    block: HighlightGridBlockType
}

export function HighlightGridBlock({ block }: HighlightGridBlockProps) {
    return (
        <section className="py-10 md:py-14">
            <div className="max-w-5xl mx-auto px-5 md:px-10">
                {(block.heading || block.subheading) && (
                    <div className="mb-8">
                        {block.heading && (
                            <h2 className="text-2xl md:text-3xl font-bold">{block.heading}</h2>
                        )}
                        {block.subheading && (
                            <p className="text-muted-foreground mt-1.5">{block.subheading}</p>
                        )}
                    </div>
                )}
                <div
                    className={cn(
                        'grid gap-4',
                        block.columns === 2 && 'sm:grid-cols-2',
                        (block.columns === 3 || !block.columns) && 'sm:grid-cols-2 lg:grid-cols-3',
                        block.columns === 4 && 'sm:grid-cols-2 lg:grid-cols-4'
                    )}
                >
                    {block.items.map((item, i) => (
                        <div
                            key={i}
                            className="p-5 rounded-xl border bg-card hover:border-primary/30 hover:bg-muted/20 transition-all group"
                        >
                            {item.icon && (
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/15 transition-colors">
                                    <IconResolver
                                        name={item.icon}
                                        className="w-5 h-5 text-primary"
                                        weight="duotone"
                                    />
                                </div>
                            )}
                            <h3 className="font-bold mb-1">{item.title}</h3>
                            {item.description && (
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {item.description}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
