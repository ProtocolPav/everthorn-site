// components/features/landing-page/quest-card-landing.tsx
import { CrosshairIcon } from '@phosphor-icons/react'
import { useGetQuestV1GuildsMeQuestsQuestIdGet } from "@/api/nexuscore/quests/quests.ts"
import {cn} from "@/lib/utils.ts";

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
        <div className={cn("relative shrink-0", className)}>
            <img
                src="/textures/book.png"
                alt="Minecraft Book Page"
                className="block w-full h-auto select-none pointer-events-none"
            />

            <div className="absolute inset-0 py-6 px-8 text-black font-minecraft-seven">
                <div className="px-4 pl-5 py-4 space-y-3">
                    <p
                        className="font-minecraft-seven text-[9px] uppercase tracking-widest"
                        style={{ color: '#5a3e1b' }}
                    >
                        {quest.quest_type}
                    </p>

                    <h3
                        className="font-minecraft-ten text-sm md:text-[15px] leading-snug"
                        style={{
                            color: '#2d1a00',
                            textShadow: '1px 1px 0px rgba(255,255,255,0.3)',
                        }}
                    >
                        {quest.title}
                    </h3>

                    <div
                        className="w-full h-[2px]"
                        style={{
                            background: 'linear-gradient(to right, #7a6445, #c8b99a)',
                            boxShadow: '0 1px 0 0 rgba(255,255,255,0.3)',
                        }}
                    />

                    <p
                        className="font-minecraft-seven text-[10px] md:text-[11px] leading-relaxed line-clamp-3"
                        style={{ color: '#3d2b10' }}
                    >
                        {quest.description}
                    </p>

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
        <div className={clsx("relative shrink-0", className)}>
            <img
                src="/textures/book.png"
                alt="Minecraft Book Page"
                className="block w-full h-auto select-none pointer-events-none"
            />

            <div className="absolute inset-0 py-6 px-8" />
        </div>
    )
}