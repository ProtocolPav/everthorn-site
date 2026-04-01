import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { QuestModel } from '@/types/quests'
import { cn } from '@/lib/utils'
import {
    ClockIcon,
    TrophyIcon,
    DotsThreeVerticalIcon,
    CaretRightIcon,
    CrosshairIcon,
    XCircleIcon,
    ArrowCounterClockwiseIcon,
    PlayIcon,
    DownloadSimpleIcon,
} from '@phosphor-icons/react'
import {formatDate} from "date-fns";
import {QuestTypeBadge} from "@/components/features/quests/quest-type-badge.tsx";
import {QuestStatusBadge} from "@/components/features/quests/quest-status-badge.tsx";
import {useQuestActions} from "@/hooks/use-quest-actions.ts";

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
    const { expireNow, extend, resume, startNow, exportJson } = useQuestActions(quest);

    const now = new Date()
    const startTime = new Date(quest.start_time)
    const endTime = new Date(quest.end_time)
    const isActive = now >= startTime && now <= endTime
    const isScheduled = now < startTime
    const isPast = now > endTime

    const totalRewards = getTotalRewards(quest.objectives)

    const handleQuickAction = (e: React.MouseEvent, action: () => void) => {
        e.preventDefault()
        e.stopPropagation()
        action()
    }

    return (
        <Card
            className={cn(
                'hover:shadow-sm hover:border-foreground/15 transition-all duration-200 p-0 group overflow-hidden relative h-full flex flex-col',
                className
            )}
        >
            <a href={`/admin/quests/editor/${quest.quest_id}`} className="flex flex-col h-full">
                <div className={cn(
                    "px-2.5 py-1.5 bg-muted/30 backdrop-blur-sm border-b flex items-center justify-between shrink-0",
                )}>
                    <div className="flex gap-1.5 items-center min-w-0">
                        <QuestStatusBadge status={isActive ? 'active' : isScheduled ? 'scheduled' : 'expired'}/>
                        <QuestTypeBadge type={quest.quest_type}/>
                    </div>

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
                                        onClick={(e) => handleQuickAction(e, extend)}
                                        className="gap-3 cursor-pointer"
                                    >
                                        <ClockIcon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" weight="duotone" />
                                        <div className="flex flex-col gap-0.5 flex-1">
                                            <span className="text-sm">Extend Quest</span>
                                            <span className="text-xs text-muted-foreground">Add 7 more days</span>
                                        </div>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={(e) => handleQuickAction(e, expireNow)}
                                        className="gap-3 cursor-pointer text-destructive focus:text-destructive"
                                    >
                                        <XCircleIcon className="h-4 w-4" weight="duotone" />
                                        <div className="flex flex-col gap-0.5 flex-1">
                                            <span className="text-sm font-medium">Expire Now</span>
                                        </div>
                                    </DropdownMenuItem>
                                </>
                            )}
                            {isPast && (
                                <>
                                    <DropdownMenuItem
                                        onClick={(e) => handleQuickAction(e, resume)}
                                        className="gap-3 cursor-pointer"
                                    >
                                        <ArrowCounterClockwiseIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" weight="duotone" />
                                        <div className="flex flex-col gap-0.5 flex-1">
                                            <span className="text-sm">Reactivate Quest</span>
                                            <span className="text-xs text-muted-foreground">Run for 7 more days</span>
                                        </div>
                                    </DropdownMenuItem>
                                </>
                            )}
                            {isScheduled && (
                                <>
                                    <DropdownMenuItem
                                        onClick={(e) => handleQuickAction(e, startNow)}
                                        className="gap-3 cursor-pointer"
                                    >
                                        <PlayIcon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" weight="duotone" />
                                        <div className="flex flex-col gap-0.5 flex-1">
                                            <span className="text-sm">Start Now</span>
                                            <span className="text-xs text-muted-foreground">Begin immediately</span>
                                        </div>
                                    </DropdownMenuItem>
                                </>
                            )}

                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                                onClick={(e) => handleQuickAction(e, exportJson)}
                                className="gap-3 cursor-pointer"
                            >
                                <DownloadSimpleIcon className="h-4 w-4 text-muted-foreground" weight="duotone" />
                                <span className="text-sm">Export as JSON</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <CardContent className="p-2.5 flex flex-col flex-1">
                    <h4 className="font-semibold text-sm leading-tight line-clamp-1 group-hover:text-primary transition-colors mb-1">
                        {quest.title}
                    </h4>

                    <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed my-2">
                        {quest.description || 'No description provided'}
                    </p>

                    <div className="flex-1" />

                    <div className="flex items-center gap-1.5 mb-2 px-2 py-1 rounded bg-muted/30 border border-border/30">
                        <ClockIcon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" weight="duotone" />
                        <span className="text-[11px] text-muted-foreground">
                            {isPast ? 'Ended' : isScheduled ? 'Starts' : 'Ends'}
                        </span>
                        <span className="text-[11px] font-medium line-clamp-1">
                            {formatDate(isPast || !isScheduled ? quest.end_time : quest.start_time, "LLL do yyyy 'at' h:mmaaa")}
                        </span>
                    </div>

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
