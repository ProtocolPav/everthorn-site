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
    TrophyIcon,
    DotsThreeVerticalIcon,
    CaretRightIcon,
    TagIcon,
    CrosshairIcon,
    XCircleIcon,
    ArrowCounterClockwiseIcon,
    PlayIcon,
    DownloadSimpleIcon,
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import {formatDate} from "date-fns";
import {QuestTypeBadge} from "@/components/features/quests/quest-type-badge.tsx";
import {QuestStatusBadge} from "@/components/features/quests/quest-status-badge.tsx";

interface QuestCardProps {
    quest: QuestModel
    className?: string
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

    const totalRewards = getTotalRewards(quest.objectives)

    // Tag display logic
    const displayTags = quest.tags?.slice(0, 2) || []
    const remainingTagsCount = (quest.tags?.length || 0) - 2

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
                'hover:shadow-sm hover:border-foreground/15 transition-all duration-200 p-0 group overflow-hidden relative h-full flex flex-col',
                className
            )}
        >
            <a href={`/admin/quests/editor/${quest.quest_id}`} className="flex flex-col h-full">
                {/* Compact Header */}
                <div className={cn(
                    "px-2.5 py-1.5 bg-muted/30 backdrop-blur-sm border-b flex items-center justify-between shrink-0",
                )}>
                    <div className="flex gap-1.5 items-center min-w-0">
                        <QuestStatusBadge status={isActive ? 'active' : isScheduled ? 'scheduled' : 'expired'}/>
                        <QuestTypeBadge type={quest.quest_type}/>
                    </div>

                    {/* Quick Actions */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 hover:bg-accent/60 transition-all duration-200 hover:scale-105"
                                onClick={(e) => e.preventDefault()}
                            >
                                <DotsThreeVerticalIcon className="h-4 w-4 text-muted-foreground" weight="bold" />
                                <span className="sr-only">Quest actions</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-52">
                            {isActive && (
                                <>
                                    <DropdownMenuItem
                                        onClick={(e) => handleQuickAction(e, 'extend')}
                                        className="gap-3 cursor-pointer"
                                    >
                                        <ClockIcon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" weight="duotone" />
                                        <div className="flex flex-col gap-0.5 flex-1">
                                            <span className="text-sm">Extend Quest</span>
                                            <span className="text-xs text-muted-foreground">Add 7 more days</span>
                                        </div>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={(e) => handleQuickAction(e, 'expire_now')}
                                        className="gap-3 cursor-pointer text-destructive focus:text-destructive"
                                    >
                                        <XCircleIcon className="h-4 w-4" weight="duotone" />
                                        <div className="flex flex-col gap-0.5 flex-1">
                                            <span className="text-sm font-medium">Expire Now</span>
                                        </div>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                </>
                            )}
                            {isPast && (
                                <>
                                    <DropdownMenuItem
                                        onClick={(e) => handleQuickAction(e, 'resume')}
                                        className="gap-3 cursor-pointer"
                                    >
                                        <ArrowCounterClockwiseIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" weight="duotone" />
                                        <div className="flex flex-col gap-0.5 flex-1">
                                            <span className="text-sm">Reactivate Quest</span>
                                            <span className="text-xs text-muted-foreground">Run for 7 more days</span>
                                        </div>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                </>
                            )}
                            {isScheduled && (
                                <>
                                    <DropdownMenuItem
                                        onClick={(e) => handleQuickAction(e, 'start_now')}
                                        className="gap-3 cursor-pointer"
                                    >
                                        <PlayIcon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" weight="duotone" />
                                        <div className="flex flex-col gap-0.5 flex-1">
                                            <span className="text-sm">Start Now</span>
                                            <span className="text-xs text-muted-foreground">Begin immediately</span>
                                        </div>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                </>
                            )}
                            <DropdownMenuItem
                                onClick={(e) => handleQuickAction(e, 'export_json')}
                                className="gap-3 cursor-pointer"
                            >
                                <DownloadSimpleIcon className="h-4 w-4 text-muted-foreground" weight="duotone" />
                                <span className="text-sm">Export as JSON</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Compact Main Content */}
                <CardContent className="p-2.5 flex flex-col flex-1">
                    {/* Title */}
                    <h4 className="font-semibold text-sm leading-tight line-clamp-1 group-hover:text-primary transition-colors mb-1">
                        {quest.title}
                    </h4>

                    {/*<div className="flex items-center gap-0.5 pt-1 text-[11px]">*/}
                    {/*    <TagIcon className="h-3.5 w-3.5 text-muted-foreground" weight="duotone" />*/}
                    {/*    {displayTags.length > 0 && (*/}
                    {/*        <div className="flex flex-wrap gap-1">*/}
                    {/*            {displayTags.map((tag) => (*/}
                    {/*                <Badge*/}
                    {/*                    key={tag}*/}
                    {/*                    variant="secondary"*/}
                    {/*                    className="text-[10px] px-1.5 py-0 h-4 font-normal bg-muted/50 hover:bg-muted border-0"*/}
                    {/*                >*/}
                    {/*                    {tag}*/}
                    {/*                </Badge>*/}
                    {/*            ))}*/}
                    {/*            {remainingTagsCount > 0 && (*/}
                    {/*                <Badge*/}
                    {/*                    variant="secondary"*/}
                    {/*                    className="text-[10px] px-1.5 py-0 h-4 font-medium bg-muted hover:bg-muted/80 border-0"*/}
                    {/*                >*/}
                    {/*                    +{remainingTagsCount}*/}
                    {/*                </Badge>*/}
                    {/*            )}*/}
                    {/*        </div>*/}
                    {/*    )}*/}
                    {/*</div>*/}

                    {/* Description */}
                    <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed my-2">
                        {quest.description || 'No description provided'}
                    </p>

                    {/* Spacer */}
                    <div className="flex-1" />

                    {/* Compact Time Info */}
                    <div className="flex items-center gap-1.5 mb-2 px-2 py-1 rounded bg-muted/30 border border-border/30">
                        <ClockIcon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" weight="duotone" />
                        <span className="text-[11px] text-muted-foreground">
                            {isPast ? 'Ended' : isScheduled ? 'Starts' : 'Ends'}
                        </span>
                        <span className="text-[11px] font-medium">
                            {formatDate(isPast || !isScheduled ? quest.end_time : quest.start_time, "LLL do 'at' h:mmaaa")}
                        </span>
                    </div>

                    {/* Compact Footer Stats */}
                    <div className="flex items-center justify-between pt-1.5 border-t border-border/40">
                        <div className="flex items-center gap-2.5">
                            <div className="flex items-center gap-1 text-[11px]">
                                <CrosshairIcon className="h-3.5 w-3.5 text-muted-foreground" weight="duotone" />
                                <span className="font-semibold">{quest.objectives.length}</span>
                            </div>

                            {totalRewards > 0 && (
                                <div className="flex items-center gap-1 text-[11px]">
                                    <TrophyIcon className="h-3.5 w-3.5 text-muted-foreground" weight="duotone" />
                                    <span className="font-semibold">{totalRewards}</span>
                                </div>
                            )}
                        </div>

                        <CaretRightIcon
                            size={12}
                            weight="bold"
                            className="text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-0.5 transition-all"
                        />
                    </div>
                </CardContent>
            </a>
        </Card>
    )
}
