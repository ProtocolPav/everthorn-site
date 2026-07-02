import type { PrizeTiersBlock as PrizeTiersBlockType } from '@/api/nexuscore/model'
import { IconResolver } from '../icon-resolver'
import { cn } from '@/lib/utils'

interface PrizeTiersBlockProps {
    block: PrizeTiersBlockType
}

const tierAccents = [
    'from-amber-500/10 border-amber-500/30 hover:border-amber-500/50',
    'from-zinc-400/10 border-zinc-400/30 hover:border-zinc-400/50',
    'from-orange-600/10 border-orange-500/30 hover:border-orange-500/50',
]

const tierIconColors = [
    'text-amber-500',
    'text-zinc-400',
    'text-orange-600',
]

export function PrizeTiersBlock({ block }: PrizeTiersBlockProps) {
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

                <div className="grid md:grid-cols-3 gap-5">
                    {block.tiers.map((tier, i) => (
                        <div
                            key={i}
                            className={cn(
                                'p-5 rounded-xl border bg-gradient-to-br to-transparent transition-all',
                                tierAccents[i] ?? 'from-primary/5 border-primary/20 hover:border-primary/40'
                            )}
                        >
                            <div className="flex items-center gap-2.5 mb-4">
                                {tier.icon && (
                                    <IconResolver
                                        name={tier.icon}
                                        className={cn(
                                            'w-6 h-6',
                                            tierIconColors[i] ?? 'text-primary'
                                        )}
                                        weight="duotone"
                                    />
                                )}
                                <div>
                                    <p className="font-bold leading-tight">{tier.title}</p>
                                    {tier.subtitle && (
                                        <p className="text-xs text-muted-foreground">{tier.subtitle}</p>
                                    )}
                                </div>
                            </div>
                            <ul className="space-y-1.5">
                                {tier.rewards.map((reward, j) => (
                                    <li key={j} className="flex items-start gap-2 text-sm">
                                        <span
                                            className={cn(
                                                'mt-0.5 text-base leading-none',
                                                tierIconColors[i] ?? 'text-primary'
                                            )}
                                        >
                                            •
                                        </span>
                                        <span className="text-muted-foreground">{reward}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
