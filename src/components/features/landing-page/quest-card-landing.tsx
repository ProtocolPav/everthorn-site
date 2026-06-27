// components/features/landing-page/quest-card-landing.tsx
import {NumberSquareOneIcon, NumberSquareTwoIcon} from '@phosphor-icons/react'
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

    return (
        <div className={cn("relative shrink-0", className)}>
            <img
                src="/textures/book.png"
                alt="Minecraft Book Page"
                className="block w-full h-auto select-none pointer-events-none"
            />

            <div className="absolute inset-0 py-2 px-1 text-black font-minecraft-seven">
                <div className="px-4 pl-5 py-4 space-y-1">
                    <p className="font-minecraft-seven text-[9px] uppercase tracking-widest text-yellow-950 m-0">
                        {quest.quest_type} QUEST
                    </p>

                    <p className="font-minecraft-ten text-sm md:text-[15px] font-normal leading-snug m-0">
                        {quest.title}
                    </p>

                    {quest.tags?.length > 0 && (
                        <div className="flex gap-1 py-1">
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

                    <div className="w-full h-px bg-yellow-950"/>

                    <p className="font-minecraft-seven text-[10px] leading-snug line-clamp-3 text-yellow-950">
                        {quest.description}
                    </p>

                    <div className="w-full h-px bg-yellow-950"/>

                    <div className="flex items-start gap-1 pt-1">
                        <NumberSquareOneIcon
                            weight="bold"
                            className="size-4 shrink-0 fill-yellow-950"
                        />
                        <p className="font-minecraft-seven text-[10px] leading-snug line-clamp-3 text-yellow-950">
                            {quest.objectives[0].display ?? quest.objectives[0].description}
                        </p>
                    </div>

                    <div className="flex items-start gap-1">
                        <NumberSquareTwoIcon
                            weight="bold"
                            className="size-4 shrink-0 fill-yellow-950"
                        />
                        <p className="font-minecraft-seven text-[10px] leading-snug line-clamp-3 text-yellow-950">
                            {quest.objectives[1].display ?? quest.objectives[1].description}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

function QuestCardSkeleton({ className }: { className?: string }) {
    return (
        <div className={cn("relative shrink-0", className)}>
            <img
                src="/textures/book.png"
                alt="Minecraft Book Page"
                className="block w-full h-auto select-none pointer-events-none"
            />

            <div className="absolute inset-0 py-6 px-8" />
        </div>
    )
}