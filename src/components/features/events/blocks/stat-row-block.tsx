import type { StatRowBlock as StatRowBlockType } from '@/api/nexuscore/model'
import { IconResolver } from '../icon-resolver'
import { cn } from '@/lib/utils'

interface StatRowBlockProps {
    block: StatRowBlockType
}

export function StatRowBlock({ block }: StatRowBlockProps) {
    return (
        <section className="py-6 border-y bg-muted/20">
            <div className="max-w-5xl mx-auto px-5 md:px-10">
                <div
                    className={cn(
                        'grid gap-4',
                        block.stats.length <= 2 && 'grid-cols-2',
                        block.stats.length === 3 && 'grid-cols-3',
                        block.stats.length >= 4 && 'grid-cols-2 md:grid-cols-4'
                    )}
                >
                    {block.stats.map((stat, i) => (
                        <div
                            key={i}
                            className="flex flex-col items-center text-center p-4 rounded-xl bg-card border hover:border-primary/30 transition-colors"
                        >
                            {stat.icon && (
                                <IconResolver
                                    name={stat.icon}
                                    className="w-6 h-6 text-primary mb-2"
                                    weight="duotone"
                                />
                            )}
                            <span className="text-2xl md:text-3xl font-bold">{stat.value}</span>
                            <span className="text-xs text-muted-foreground mt-1 font-medium uppercase tracking-wide">
                                {stat.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
