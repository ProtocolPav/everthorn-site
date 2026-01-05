// @/components/features/quests/quest-card.tsx
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { QuestModel } from '@/types/quests'

interface QuestCardProps {
    quest: QuestModel
    className?: string
    onClick?: (quest: QuestModel) => void
}

const getQuestTypeColor = (type: string) => {
    switch (type) {
        case 'story':
            return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
        case 'side':
            return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
        case 'minor':
            return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
        default:
            return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
}

export function QuestCard({ quest, className, onClick }: QuestCardProps) {
    const startDate = new Date(quest.start_time).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    })
    const endDate = new Date(quest.end_time).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    })

    return (
        <Card
            className={`min-w-[20rem] w-sm group overflow-hidden transition-colors hover:border-secondary-foreground/25 cursor-pointer p-0 ${className || ''}`}
            onClick={() => onClick?.(quest)}
        >
            <div className="relative aspect-video overflow-hidden bg-black">
                {/* Gradient background based on quest type */}
                <div className={`w-full h-full ${
                    quest.quest_type === 'story' 
                        ? 'bg-gradient-to-br from-purple-900/80 via-purple-800/60 to-indigo-900/80'
                        : quest.quest_type === 'side'
                        ? 'bg-gradient-to-br from-blue-900/80 via-blue-800/60 to-cyan-900/80'
                        : 'bg-gradient-to-br from-gray-800/80 via-gray-700/60 to-gray-900/80'
                }`} />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/70 dark:from-black/95 via-black/50 to-transparent opacity-90 group-hover:opacity-95 transition-opacity duration-300" />

                {/* Quest type badge - top right */}
                <div className="absolute top-2.5 right-2.5">
                    <Badge variant="outline" className={getQuestTypeColor(quest.quest_type)}>
                        {quest.quest_type}
                    </Badge>
                </div>

                {/* Tags badge - top left */}
                {quest.tags && quest.tags.length > 0 && (
                    <div className="absolute top-2.5 left-2.5 flex gap-1">
                        {quest.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="secondary" className="bg-black/50 text-white/90">
                                {tag}
                            </Badge>
                        ))}
                        {quest.tags.length > 2 && (
                            <Badge variant="secondary" className="bg-black/50 text-white/90">
                                +{quest.tags.length - 2}
                            </Badge>
                        )}
                    </div>
                )}

                {/* Content overlay - bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-2.5 grid gap-1">
                    {/* Title */}
                    <h3 className="text-base md:text-lg font-semibold leading-tight text-white line-clamp-1">
                        {quest.title}
                    </h3>

                    {/* Description */}
                    <p className="m-0! font-normal text-[11px] md:text-xs text-white/85 line-clamp-2 leading-relaxed">
                        {quest.description}
                    </p>

                    {/* Meta footer */}
                    <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-3 text-[10px] md:text-xs text-white/70">
                            {/* Objectives count */}
                            <div className="flex items-center gap-1.5">
                                <span className="font-medium">
                                    {quest.objectives.length} objective{quest.objectives.length !== 1 ? 's' : ''}
                                </span>
                            </div>

                            {/* Date range */}
                            <div className="flex items-center gap-1.5">
                                <span>{startDate} - {endDate}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    )
}
