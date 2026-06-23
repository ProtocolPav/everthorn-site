// components/features/landing-page/quest-card-landing.tsx
import { CrosshairIcon } from '@phosphor-icons/react'
import { useGetQuestV1GuildsMeQuestsQuestIdGet } from "@/api/nexuscore/quests/quests.ts"
import {ImageCard} from "@/components/common/image-card.tsx";

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
        <ImageCard
            src="/textures/book.png"
            alt="Minecraft Book Page"
            contentClassName={'py-6 px-8 text-black font-minecraft-seven'}
        >
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
        </ImageCard>
    )
}

function QuestCardSkeleton() {
    return (
        <ImageCard
            src="/textures/book.png"
            alt="Minecraft Book Page"
            contentClassName={'py-6 px-8 text-black font-minecraft-seven'}
        >

        </ImageCard>
    )
}