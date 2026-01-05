// @/components/features/quests/quest-card.tsx
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { QuestModel } from '@/types/quests'
import { useUpdateQuest } from '@/hooks/use-quests'
import { cn } from '@/lib/utils'
import {
    ClockIcon,
    TargetIcon,
    TrophyIcon,
    DotsThreeVerticalIcon,
    DownloadIcon,
    CaretRightIcon,
    TagIcon,
} from '@phosphor-icons/react'
import { toast } from 'sonner'

interface QuestCardProps {
    quest: QuestModel
    className?: string
}

// Status configuration helpers (outside component)
function getStatusConfig(isActive: boolean, isScheduled: boolean, isPast: boolean) {
    if (isActive) {
        return {
            label: 'Active',
            color: 'text-emerald-700 dark:text-emerald-400',
            bgColor: 'bg-emerald-500/15 dark:bg-emerald-500/20 border-emerald-500/30',
            dotColor: 'bg-emerald-500',
        }
    } else if (isScheduled) {
        return {
            label: 'Scheduled',
            color: 'text-blue-700 dark:text-blue-400',
            bgColor: 'bg-blue-500/15 dark:bg-blue-500/20 border-blue-500/30',
            dotColor: 'bg-blue-500',
        }
    } else if (isPast) {
        return {
            label: 'Expired',
            color: 'text-orange-700 dark:text-orange-400',
            bgColor: 'bg-orange-500/15 dark:bg-orange-500/20 border-orange-500/30',
            dotColor: 'bg-orange-500',
        }
    } else {
        return {
            label: 'UNKNOWN',
            color: 'text-slate-700 dark:text-slate-400',
            bgColor: 'bg-slate-500/15 dark:bg-slate-500/20 border-slate-500/30',
            dotColor: 'bg-slate-500',
        }
    }
}

function formatDateLong(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    })
}

function getTotalRewards(objectives: QuestModel['objectives']) {
    return objectives.reduce((total, obj) => {
        return total + (obj.rewards?.length || 0)
    }, 0)
}

export function QuestCard({ quest, className }: QuestCardProps) {
    const updateQuest = useUpdateQuest()

    const now = new Date()
    const startTime = new Date(quest.start_time)
    const endTime = new Date(quest.end_time)
    const isActive = now >= startTime && now <= endTime
    const isScheduled = now < startTime
    const isPast = now > endTime

    const statusConfig = getStatusConfig(isActive, isScheduled, isPast)
    const totalRewards = getTotalRewards(quest.objectives)

    const handleQuickAction = (e: React.MouseEvent, action: string) => {
        e.preventDefault()
        e.stopPropagation()

        switch (action) {
            case 'expire_now':
                updateQuest.mutate(
                    { questId: String(quest.quest_id), payload: { end_time: new Date().toISOString() } },
                    {
                        onSuccess: () => toast.success(`Quest "${quest.title}" has been expired`),
                        onError: () => toast.error('Failed to expire quest'),
                    }
                )
                break
            case 'extend':
                const dateEnd = new Date(quest.end_time)
                dateEnd.setDate(dateEnd.getDate() + 7)
                updateQuest.mutate(
                    { questId: String(quest.quest_id), payload: { end_time: dateEnd.toISOString() } },
                    {
                        onSuccess: () => toast.success(`Quest "${quest.title}" extended by 7 days`),
                        onError: () => toast.error('Failed to extend quest'),
                    }
                )
                break
            case 'resume':
                const dateNow = new Date()
                dateNow.setDate(dateNow.getDate() + 7)
                updateQuest.mutate(
                    { questId: String(quest.quest_id), payload: { end_time: dateNow.toISOString() } },
                    {
                        onSuccess: () => toast.success(`Quest "${quest.title}" resumed for 7 days`),
                        onError: () => toast.error('Failed to resume quest'),
                    }
                )
                break
            case 'start_now':
                updateQuest.mutate(
                    { questId: String(quest.quest_id), payload: { start_time: new Date().toISOString() } },
                    {
                        onSuccess: () => toast.success(`Quest "${quest.title}" will start now`),
                        onError: () => toast.error('Failed to start quest'),
                    }
                )
                break
            case 'export_json':
                navigator.clipboard.writeText(JSON.stringify(quest, null, 2))
                toast.info('Copied to clipboard!')
                break
        }
    }

    return (
        <Card
            className={cn(
                'hover:border-foreground/16 hover:shadow-md transition-all duration-300 p-0 group overflow-hidden relative h-full flex flex-col',
                className
            )}
        >
            <a href={`/admin/quests/editor/${quest.quest_id}`} className="flex flex-col h-full">
                {/* Status Banner */}
                <div className="px-3 py-2 bg-muted/50 dark:bg-muted/30 backdrop-blur-sm border-b border-border/50 flex items-center justify-between relative flex-shrink-0">
                    <div className="flex gap-2 items-center">
                        <Badge
                            variant="secondary"
                            className={cn(
                                'text-xs font-semibold px-2 border transition-colors duration-200',
                                statusConfig.bgColor,
                                statusConfig.color
                            )}
                        >
                            <span className={cn('w-1.5 h-1.5 rounded-full mr-1.5', statusConfig.dotColor, isActive && 'animate-pulse')} />
                            {statusConfig.label}
                        </Badge>
                        <Badge variant="outline" className="text-xs capitalize">
                            {quest.quest_type}
                        </Badge>
                    </div>

                    {/* Quick Actions Dropdown - larger for mobile */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 hover:bg-accent"
                                onClick={(e) => e.preventDefault()}
                            >
                                <DotsThreeVerticalIcon className="h-4 w-4" weight="bold" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            {isActive && (
                                <>
                                    <DropdownMenuItem onClick={(e) => handleQuickAction(e, 'expire_now')} className="text-xs">
                                        <ClockIcon className="mr-2 h-4 w-4" />
                                        <span>Expire Now</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={(e) => handleQuickAction(e, 'extend')} className="text-xs">
                                        <ClockIcon className="mr-2 h-4 w-4" />
                                        <span>Extend +1 Week</span>
                                    </DropdownMenuItem>
                                </>
                            )}
                            {isPast && (
                                <DropdownMenuItem onClick={(e) => handleQuickAction(e, 'resume')} className="text-xs">
                                    <ClockIcon className="mr-2 h-4 w-4" />
                                    <span>Resume +1 Week</span>
                                </DropdownMenuItem>
                            )}
                            {isScheduled && (
                                <DropdownMenuItem onClick={(e) => handleQuickAction(e, 'start_now')} className="text-xs">
                                    <ClockIcon className="mr-2 h-4 w-4" />
                                    <span>Start Now</span>
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={(e) => handleQuickAction(e, 'export_json')} className="text-xs">
                                <DownloadIcon className="mr-2 h-4 w-4" />
                                <span>Export JSON</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Main Content */}
                <CardContent className="p-3 flex flex-col flex-1">
                    {/* Title */}
                    <h4 className="font-semibold text-sm leading-tight line-clamp-1 group-hover:text-primary transition-colors duration-200 mb-1.5">
                        {quest.title}
                    </h4>

                    {/* Description */}
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-4 mb-3">
                        {quest.description || 'No description provided'}
                    </p>

                    {/* Time Info */}
                    <div className="flex items-start gap-1.5 mb-3 p-2 rounded-md bg-muted/30 border border-border/40">
                        <ClockIcon className="h-4 w-4 mt-0.5 flex-shrink-0 text-muted-foreground" weight="duotone" />
                        <div className="text-xs leading-snug min-w-0 flex-1">
                            <span className="text-muted-foreground">
                                {isPast ? 'Ended ' : isScheduled ? 'Starts ' : 'Ends '}
                            </span>
                            <span className="font-medium text-foreground">
                                {formatDateLong(isPast || !isScheduled ? quest.end_time : quest.start_time)}
                            </span>
                        </div>
                    </div>

                    {/* Footer Stats */}
                    <div className="flex items-center justify-between pt-2 border-t border-border/50 mt-auto">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5 text-xs">
                                <TargetIcon className="h-4 w-4 text-muted-foreground" weight="duotone" />
                                <span className="font-semibold">{quest.objectives.length}</span>
                                <span className="text-muted-foreground">Objectives</span>
                            </div>
                            {totalRewards > 0 && (
                                <div className="flex items-center gap-1.5 text-xs">
                                    <TrophyIcon className="h-4 w-4 text-muted-foreground" weight="duotone" />
                                    <span className="font-semibold">{totalRewards}</span>
                                    <span className="text-muted-foreground">Rewards</span>
                                </div>
                            )}
                        </div>

                        {/* Tags indicator */}
                        {quest.tags && quest.tags.length > 0 && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <TagIcon className="h-3.5 w-3.5" />
                                <span>{quest.tags.length}</span>
                            </div>
                        )}

                        <CaretRightIcon
                            size={16}
                            weight="bold"
                            className="text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-200"
                        />
                    </div>
                </CardContent>
            </a>
        </Card>
    )
}
