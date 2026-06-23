// components/features/landing-page/quest-card-landing.tsx
import { cn } from '@/lib/utils'
import { CrosshairIcon } from '@phosphor-icons/react'
import { useGetQuestV1GuildsMeQuestsQuestIdGet } from "@/api/nexuscore/quests/quests.ts"

interface LandingQuestCardProps {
    questId: number
    className?: string
}

export function LandingQuestCard({ questId, className }: LandingQuestCardProps) {
    const { data: quest, isLoading, isError } = useGetQuestV1GuildsMeQuestsQuestIdGet(questId)

    if (isLoading) return <QuestCardSkeleton className={className} />
    if (isError || !quest) return null

    const firstObjective = quest.objectives?.[0]

    return (
        <div className={cn('relative w-64 md:w-72 flex-shrink-0 select-none', className)}>
            {/* Pin */}
            <div
                className="absolute -top-2 left-1/2 -translate-x-1/2 z-20 w-3 h-3"
                style={{
                    backgroundColor: '#c6a84b',
                    boxShadow: `
                        0 -2px 0 0 #e8c86a,
                        0 2px 0 0 #8a6f28,
                        -2px 0 0 0 #b8952e,
                        2px 0 0 0 #b8952e,
                        0 0 0 2px #3b2e0a
                    `,
                    imageRendering: 'pixelated',
                }}
            />

            {/* Minecraft book UI panel */}
            <div
                className="relative mt-3"
                style={{
                    /*
                     * Minecraft GUI panel border — stacked box-shadow pixel construction
                     * Layer 1 (outermost): #373737 dark outer edge — 1px
                     * Layer 2: #8b8b8b mid gray — 1px
                     * Layer 3: #ffffff white highlight top-left, #555555 shadow bottom-right
                     * Inner: #c6c6c6 panel face
                     */
                    backgroundColor: '#c8b99a',         /* parchment face */
                    boxShadow: `
                        0 0 0 2px #373737,
                        0 0 0 3px #8b8b8b,
                        0 0 0 4px #ffffff,
                        inset 0 0 0 1px #7a6445
                    `,
                    imageRendering: 'pixelated',
                }}
            >
                {/* Book spine line — left edge accent */}
                <div
                    className="absolute left-0 top-0 bottom-0 w-[3px]"
                    style={{ backgroundColor: '#a0845c' }}
                />

                {/* Content */}
                <div className="px-4 pl-5 py-4 space-y-3">
                    {/* Quest type label */}
                    <p
                        className="font-minecraft-seven text-[9px] uppercase tracking-widest"
                        style={{ color: '#5a3e1b' }}
                    >
                        {quest.quest_type}
                    </p>

                    {/* Title */}
                    <h3
                        className="font-minecraft-ten text-sm md:text-[15px] leading-snug"
                        style={{
                            color: '#2d1a00',
                            textShadow: '1px 1px 0px rgba(255,255,255,0.3)',
                        }}
                    >
                        {quest.title}
                    </h3>

                    {/* Divider — pixel style */}
                    <div
                        className="w-full h-[2px]"
                        style={{
                            background: 'linear-gradient(to right, #7a6445, #c8b99a)',
                            boxShadow: '0 1px 0 0 rgba(255,255,255,0.3)',
                        }}
                    />

                    {/* Description */}
                    <p
                        className="font-minecraft-seven text-[10px] md:text-[11px] leading-relaxed line-clamp-3"
                        style={{ color: '#3d2b10' }}
                    >
                        {quest.description}
                    </p>

                    {/* First objective */}
                    {firstObjective && (
                        <div
                            className="flex items-start gap-2 pt-2"
                            style={{
                                borderTop: '1px solid #7a6445',
                                borderBottom: '1px solid rgba(255,255,255,0.3)',
                            }}
                        >
                            <CrosshairIcon
                                weight="bold"
                                className="w-3 h-3 mt-0.5 shrink-0"
                                style={{ color: '#5a3e1b' }}
                            />
                            <p
                                className="font-minecraft-seven text-[10px] leading-relaxed line-clamp-2"
                                style={{ color: '#4a3318' }}
                            >
                                {firstObjective.display ?? firstObjective.description}
                            </p>
                        </div>
                    )}

                    {/* Tags */}
                    {quest.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                            {quest.tags.slice(0, 3).map(tag => (
                                <span
                                    key={tag}
                                    className="font-minecraft-seven text-[8px] uppercase tracking-wide px-1.5 py-0.5"
                                    style={{
                                        backgroundColor: '#7a6445',
                                        color: '#f0d9a0',
                                        boxShadow: '0 0 0 1px #3b2e0a, inset 0 0 0 1px rgba(255,255,255,0.1)',
                                    }}
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

function QuestCardSkeleton({ className }: { className?: string }) {
    return (
        <div className={cn('relative w-64 md:w-72 flex-shrink-0', className)}>
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-20 w-3 h-3 bg-amber-600/40" />
            <div
                className="relative mt-3 px-4 pl-5 py-4 space-y-3"
                style={{
                    backgroundColor: '#c8b99a',
                    boxShadow: `0 0 0 2px #373737, 0 0 0 3px #8b8b8b, 0 0 0 4px #ffffff, inset 0 0 0 1px #7a6445`,
                }}
            >
                <div className="h-2 w-1/4 rounded-none animate-pulse" style={{ backgroundColor: '#7a6445' }} />
                <div className="h-4 w-3/4 rounded-none animate-pulse" style={{ backgroundColor: '#7a6445' }} />
                <div className="h-[2px] w-full" style={{ backgroundColor: '#7a6445' }} />
                <div className="h-2 w-full rounded-none animate-pulse" style={{ backgroundColor: '#a08060', opacity: 0.6 }} />
                <div className="h-2 w-2/3 rounded-none animate-pulse" style={{ backgroundColor: '#a08060', opacity: 0.6 }} />
            </div>
        </div>
    )
}