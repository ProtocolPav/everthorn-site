import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import {
    ClockIcon,
    TrophyIcon,
    DotsThreeVerticalIcon,
    CrosshairIcon,
    XCircleIcon,
    ArrowCounterClockwiseIcon,
    PlayIcon,
    DownloadSimpleIcon,
    ChartBarIcon,
    PencilSimpleIcon,
    HashIcon,
    CopySimpleIcon,
    WarningCircleIcon,
} from '@phosphor-icons/react'
import { formatDate } from 'date-fns'
import { QuestTypeBadge } from '@/components/features/quests/quest-type-badge.tsx'
import { QuestStatusBadge } from '@/components/features/quests/quest-status-badge.tsx'
import { useQuestActions } from '@/hooks/use-quest-actions.ts'
import { formatDurationCompact, getQuestLifecycle, getQuestUrgency, type QuestUrgency } from '@/lib/quest-lifecycle.ts'
import { QUEST_EXTENSION_DAYS } from '@/config/quests/constants.ts'
import { Link } from '@tanstack/react-router'
import type { QuestOut } from '@/api/nexuscore/model'

interface QuestCardProps {
    quest: QuestOut
    className?: string
}

function getTotalRewards(objectives: QuestOut['objectives']) {
    return objectives.reduce((total, obj) => total + (obj.rewards?.length || 0), 0)
}

const urgencyText: Record<QuestUrgency, string> = {
    none: 'text-foreground',
    soon: 'text-amber-600 dark:text-amber-400',
    imminent: 'text-rose-600 dark:text-rose-400',
}

export function QuestCard({ quest, className }: QuestCardProps) {
    const { expireNow, extend, resume, startNow, exportJson } = useQuestActions(quest)

    const lifecycle = getQuestLifecycle(quest)
    const urgency = getQuestUrgency(quest)
    const totalRewards = getTotalRewards(quest.objectives)
    const id = `${quest.quest_id}`

    const boundary = new Date(lifecycle === 'scheduled' ? quest.start_time : quest.end_time)
    const exactDate = formatDate(boundary, "LLL do yyyy 'at' h:mmaaa")

    function copyId() {
        navigator.clipboard.writeText(id)
        toast.success('Quest ID copied to clipboard')
    }

    return (
        <Card
            className={cn(
                '@container isolate group/card hover:shadow-sm hover:border-foreground/15 transition-[border-color,box-shadow] duration-200 p-0 gap-0 overflow-hidden relative h-full flex flex-col',
                className
            )}
        >
            <Link
                to="/admin/quests/$id"
                params={{ id }}
                aria-label={`View ${quest.title} details`}
                className="card-link absolute inset-0 z-0 rounded-xl outline-none focus-visible:ring-[3px] focus-visible:ring-inset focus-visible:ring-ring/50"
            />

            <div className="px-2.5 py-1.5 bg-muted/30 backdrop-blur-sm border-b flex items-center justify-between shrink-0">
                <div className="flex gap-1.5 items-center min-w-0">
                    <QuestStatusBadge status={lifecycle} />
                    <QuestTypeBadge type={quest.quest_type} />
                </div>
                <div className="h-6 w-6 shrink-0" aria-hidden="true" />
            </div>

            <CardContent className="p-2.5 flex flex-col flex-1">
                <h4 className="font-semibold text-sm leading-tight line-clamp-1 mb-1">{quest.title}</h4>

                <p className="text-[11px] text-muted-foreground line-clamp-2 @max-xs:line-clamp-1 @max-2xs:hidden leading-relaxed my-2">
                    {quest.description || 'No description provided'}
                </p>

                <div className="flex-1" />

                <div className="flex items-center justify-between gap-2 mb-2 min-h-4">
                    <div className="flex min-w-0 flex-wrap items-center gap-1">
                        {quest.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="secondary" className="px-1.5 py-0 text-[10px] font-normal">
                                {tag}
                            </Badge>
                        ))}
                        {quest.tags.length > 2 && (
                            <span className="text-[10px] text-muted-foreground">+{quest.tags.length - 2}</span>
                        )}
                    </div>
                    {quest.created_by?.username && (
                        <span className="shrink-0 truncate text-[10px] text-muted-foreground @max-2xs:hidden">
                            by {quest.created_by.username}
                        </span>
                    )}
                </div>

                <div
                    className="flex items-center gap-1.5 mb-2 px-2 py-1 rounded bg-muted/30 border border-border/30"
                    title={exactDate}
                >
                    <ClockIcon
                        className={cn('h-3.5 w-3.5 shrink-0', urgency === 'none' ? 'text-muted-foreground' : urgencyText[urgency])}
                        weight="duotone"
                    />
                    <span className="text-[11px] text-muted-foreground">
                        {lifecycle === 'expired' ? 'Ended' : lifecycle === 'scheduled' ? 'Starts' : 'Ends'}
                    </span>
                    <span className={cn('text-[11px] font-medium line-clamp-1', urgencyText[urgency])}>
                        {lifecycle === 'expired'
                            ? formatDate(boundary, 'LLL do yyyy')
                            : `in ${formatDurationCompact(boundary.getTime() - Date.now())}`}
                    </span>
                </div>

                <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-border/40">
                    {quest.objectives.length === 0 ? (
                        <span className="flex items-center gap-1 text-[11px] font-medium text-amber-600 dark:text-amber-400">
                            <WarningCircleIcon className="h-3.5 w-3.5" weight="fill" />
                            No objectives
                        </span>
                    ) : (
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
                    )}

                    <div className="relative z-10 flex items-center gap-0.5">
                        <Button variant="ghost" size="xs" asChild>
                            <Link to="/admin/quests/editor/$id" params={{ id }} aria-label={`Edit ${quest.title}`}>
                                <PencilSimpleIcon weight="bold" />
                                <span className="hidden @2xs:inline">Edit</span>
                            </Link>
                        </Button>
                        <Button
                            variant="ghost"
                            size="xs"
                            asChild
                            className="group-has-[.card-link:hover]/card:bg-accent group-has-[.card-link:hover]/card:text-accent-foreground"
                        >
                            <Link to="/admin/quests/$id" params={{ id }} aria-label={`View ${quest.title} details`}>
                                <ChartBarIcon weight="bold" />
                                <span className="hidden @2xs:inline">Details</span>
                            </Link>
                        </Button>
                    </div>
                </div>
            </CardContent>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1.5 z-10 h-6 w-6 p-0 hover:bg-accent/60 transition-all duration-200 hover:scale-105"
                    >
                        <DotsThreeVerticalIcon className="h-4 w-4 text-muted-foreground" weight="bold" />
                        <span className="sr-only">Quest actions</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                    {lifecycle === 'active' && (
                        <>
                            <DropdownMenuItem onClick={extend} className="gap-3 cursor-pointer">
                                <ClockIcon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" weight="duotone" />
                                <div className="flex flex-col gap-0.5 flex-1">
                                    <span className="text-sm">Extend Quest</span>
                                    <span className="text-xs text-muted-foreground">Add {QUEST_EXTENSION_DAYS} more days</span>
                                </div>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={expireNow}
                                className="gap-3 cursor-pointer text-destructive focus:text-destructive"
                            >
                                <XCircleIcon className="h-4 w-4" weight="duotone" />
                                <div className="flex flex-col gap-0.5 flex-1">
                                    <span className="text-sm font-medium">Expire Now</span>
                                </div>
                            </DropdownMenuItem>
                        </>
                    )}
                    {lifecycle === 'expired' && (
                        <DropdownMenuItem onClick={resume} className="gap-3 cursor-pointer">
                            <ArrowCounterClockwiseIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" weight="duotone" />
                            <div className="flex flex-col gap-0.5 flex-1">
                                <span className="text-sm">Reactivate Quest</span>
                                <span className="text-xs text-muted-foreground">Run for {QUEST_EXTENSION_DAYS} more days</span>
                            </div>
                        </DropdownMenuItem>
                    )}
                    {lifecycle === 'scheduled' && (
                        <DropdownMenuItem onClick={startNow} className="gap-3 cursor-pointer">
                            <PlayIcon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" weight="duotone" />
                            <div className="flex flex-col gap-0.5 flex-1">
                                <span className="text-sm">Start Now</span>
                                <span className="text-xs text-muted-foreground">Begin immediately</span>
                            </div>
                        </DropdownMenuItem>
                    )}

                    <DropdownMenuSeparator />

                    <DropdownMenuItem asChild className="gap-3 cursor-pointer">
                        <Link to="/admin/quests/editor/$id" params={{ id: 'new' }} search={{ from: quest.quest_id }}>
                            <CopySimpleIcon className="h-4 w-4 text-muted-foreground" weight="duotone" />
                            <span className="text-sm">Duplicate Quest</span>
                        </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={copyId} className="gap-3 cursor-pointer">
                        <HashIcon className="h-4 w-4 text-muted-foreground" weight="duotone" />
                        <span className="text-sm">Copy Quest ID</span>
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={exportJson} className="gap-3 cursor-pointer">
                        <DownloadSimpleIcon className="h-4 w-4 text-muted-foreground" weight="duotone" />
                        <span className="text-sm">Export as JSON</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </Card>
    )
}
