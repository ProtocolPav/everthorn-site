import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { QuestTypeBadge } from '@/components/features/quests/quest-type-badge'
import { PencilSimpleIcon, ArrowLeftIcon, UsersIcon, RepeatIcon } from '@phosphor-icons/react'
import { QuestStatisticsOut } from '@/api/nexuscore/model'

interface QuestStatsHeaderProps {
    stats: QuestStatisticsOut
    questId: number
}

export function QuestStatsHeader({ stats, questId }: QuestStatsHeaderProps) {
    // Use pre-computed rates from the API directly — no need to recalculate
    const completionPct = (stats.completion_rate * 100).toFixed(1)
    const startedPct    = (stats.started_rate * 100).toFixed(1)

    return (
        <div className="rounded-xl border bg-card p-4 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex flex-col gap-2 min-w-0">
                    {/* Back link */}
                    {/* @ts-ignore */}
                    <Link to="/admin/quests" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors w-fit">
                        <ArrowLeftIcon className="h-3 w-3" />
                        All Quests
                    </Link>

                    {/* Title + badges */}
                    <div className="flex flex-wrap items-center gap-2">
                        <h1 className="text-lg font-bold leading-tight truncate">{stats.title}</h1>
                        <div className="flex items-center gap-1.5 shrink-0">
                            <QuestTypeBadge type={stats.quest_type} />
                        </div>
                    </div>

                    {/* Quick stats row */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                            <UsersIcon className="h-3.5 w-3.5" />
                            <span className="font-semibold text-foreground">{stats.unique_players.toLocaleString()}</span> unique players
                        </span>
                        <span className="flex items-center gap-1">
                            <RepeatIcon className="h-3.5 w-3.5" />
                            <span className="font-semibold text-foreground">{stats.repeat_attempt_players.toLocaleString()}</span> repeat attempts
                        </span>
                        {/* Started rate */}
                        <span className="flex items-center gap-1 font-medium">
                            <span
                                className={`font-bold ${
                                    parseFloat(startedPct) >= 70
                                        ? 'text-emerald-500'
                                        : parseFloat(startedPct) >= 40
                                        ? 'text-amber-500'
                                        : 'text-red-500'
                                }`}
                            >
                                {startedPct}%
                            </span>
                            <span>start rate</span>
                        </span>
                        {/* Completion rate */}
                        <span className="flex items-center gap-1 font-medium">
                            <span
                                className={`font-bold ${
                                    parseFloat(completionPct) >= 60
                                        ? 'text-emerald-500'
                                        : parseFloat(completionPct) >= 30
                                        ? 'text-amber-500'
                                        : 'text-red-500'
                                }`}
                            >
                                {completionPct}%
                            </span>
                            <span>completion rate</span>
                        </span>
                    </div>
                </div>

                {/* Edit button */}
                {/* @ts-ignore */}
                <Link to={`/admin/quests/editor/${questId}`} className="shrink-0">
                    <Button size="sm" className="gap-1.5 w-full sm:w-auto">
                        <PencilSimpleIcon className="h-4 w-4" />
                        Edit Quest
                    </Button>
                </Link>
            </div>
        </div>
    )
}
