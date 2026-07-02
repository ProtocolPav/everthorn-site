import type { PrizeTiersBlock as PrizeTiersBlockType } from '@/api/nexuscore/model'
import { IconResolver } from '../icon-resolver'
import { cn } from '@/lib/utils'

interface PrizeTiersBlockProps {
    block: PrizeTiersBlockType
}

const colorTints: Record<string, { bg: string; border: string }> = {
    'text-amber-500': { bg: 'bg-amber-500/10', border: 'border-amber-500/30 hover:border-amber-500/50' },
    'text-zinc-400': { bg: 'bg-zinc-400/10', border: 'border-zinc-400/30 hover:border-zinc-400/50' },
    'text-orange-600': { bg: 'bg-orange-600/10', border: 'border-orange-600/30 hover:border-orange-600/50' },
    'text-orange-500': { bg: 'bg-orange-500/10', border: 'border-orange-500/30 hover:border-orange-500/50' },
    'text-red-500': { bg: 'bg-red-500/10', border: 'border-red-500/30 hover:border-red-500/50' },
    'text-yellow-500': { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30 hover:border-yellow-500/50' },
    'text-emerald-500': { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30 hover:border-emerald-500/50' },
    'text-green-500': { bg: 'bg-green-500/10', border: 'border-green-500/30 hover:border-green-500/50' },
    'text-teal-500': { bg: 'bg-teal-500/10', border: 'border-teal-500/30 hover:border-teal-500/50' },
    'text-blue-500': { bg: 'bg-blue-500/10', border: 'border-blue-500/30 hover:border-blue-500/50' },
    'text-blue-400': { bg: 'bg-blue-400/10', border: 'border-blue-400/30 hover:border-blue-400/50' },
    'text-indigo-500': { bg: 'bg-indigo-500/10', border: 'border-indigo-500/30 hover:border-indigo-500/50' },
    'text-violet-500': { bg: 'bg-violet-500/10', border: 'border-violet-500/30 hover:border-violet-500/50' },
    'text-purple-500': { bg: 'bg-purple-500/10', border: 'border-purple-500/30 hover:border-purple-500/50' },
    'text-pink-500': { bg: 'bg-pink-500/10', border: 'border-pink-500/30 hover:border-pink-500/50' },
    'text-rose-500': { bg: 'bg-rose-500/10', border: 'border-rose-500/30 hover:border-rose-500/50' },
}

function getTierTint(color?: string) {
    if (color && colorTints[color]) return colorTints[color]
    return { bg: 'bg-primary/5', border: 'border-primary/20 hover:border-primary/40' }
}

export function PrizeTiersBlock({ block }: PrizeTiersBlockProps) {
    return (
        <section className="py-10 md:py-14">
            <div className="max-w-5xl mx-auto px-5 md:px-10">
                {block.heading && (
                    <h2 className="text-2xl md:text-3xl font-bold mb-8">{block.heading}</h2>
                )}

                <div
                    className={cn(
                        'grid gap-5',
                        block.tiers.length === 1 && 'grid-cols-1 max-w-sm',
                        block.tiers.length === 2 && 'sm:grid-cols-2',
                        block.tiers.length === 3 && 'sm:grid-cols-2 lg:grid-cols-3',
                        block.tiers.length >= 4 && 'sm:grid-cols-2 lg:grid-cols-4'
                    )}
                >
                    {block.tiers.map((tier, i) => {
                        const tint = getTierTint(tier.color!)
                        return (
                            <div
                                key={i}
                                className={cn(
                                    'p-5 rounded-xl border transition-all',
                                    tint.bg,
                                    tint.border
                                )}
                            >
                                <div className="flex items-center gap-2.5 mb-4">
                                    {tier.icon && (
                                        <IconResolver
                                            name={tier.icon}
                                            className={cn('w-6 h-6', tier.color || 'text-primary')}
                                            weight="duotone"
                                        />
                                    )}
                                    <p className="font-bold leading-tight">{tier.rank_label}</p>
                                </div>
                                <ul className="space-y-1.5">
                                    {tier.items.map((reward, j) => (
                                        <li key={j} className="flex items-start gap-2 text-sm">
                                            <span
                                                className={cn(
                                                    'mt-0.5 text-base leading-none',
                                                    tier.color || 'text-primary'
                                                )}
                                            >
                                                •
                                            </span>
                                            <span className="text-muted-foreground">{reward}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}