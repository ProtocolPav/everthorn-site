import { createFileRoute, Link } from '@tanstack/react-router'
import { useGetQuestStatisticsV1GuildsMeQuestsQuestIdStatisticsGet } from '@/api/nexuscore/quests/quests'
import { QuestStatsHeader } from '@/components/features/quests/stats/quest-stats-header'
import { FunnelCard } from '@/components/features/quests/stats/funnel-card'
import { SankeyCard } from '@/components/features/quests/stats/sankey-card'
import { TimingCard } from '@/components/features/quests/stats/timing-card'
import { DailyActivityChart } from '@/components/features/quests/stats/daily-activity-chart'
import { CompletionCDF } from '@/components/features/quests/stats/completion-cdf'
import { ObjectivesFunnelTable } from '@/components/features/quests/stats/objectives-funnel-table'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { WarningCircleIcon, PencilSimpleIcon } from '@phosphor-icons/react'

export const Route = createFileRoute('/admin/quests/$id')({
    staticData: {
        pageTitle: 'Quest Statistics',
        headerActions: <HeaderActions />,
    },
    component: QuestStatsPage,
})

function HeaderActions() {
    const { id } = Route.useParams()
    return (
        // @ts-ignore
        <Link to={`/admin/quests/editor/${id}`}>
            <Button size="sm" className="gap-1.5">
                <PencilSimpleIcon className="h-4 w-4" />
                Edit Quest
            </Button>
        </Link>
    )
}

function QuestStatsPage() {
    const { id } = Route.useParams()
    const questId = parseInt(id, 10)

    const { data: stats, isLoading, isError, error } =
        useGetQuestStatisticsV1GuildsMeQuestsQuestIdStatisticsGet(questId)

    if (isError) {
        return (
            <div className="flex h-[60vh] items-center justify-center p-6">
                <Alert variant="destructive" className="max-w-md bg-destructive/5">
                    <WarningCircleIcon className="h-4 w-4" />
                    <AlertTitle>Unable to Load Statistics</AlertTitle>
                    <AlertDescription>
                        {error instanceof Error ? error.message : 'An unexpected error occurred.'}
                    </AlertDescription>
                </Alert>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-4 p-6 pt-4">
            {/* Header */}
            {isLoading ? (
                <div className="rounded-xl border bg-card p-4 flex items-start justify-between">
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-4 w-64" />
                    </div>
                    <Skeleton className="h-9 w-28" />
                </div>
            ) : (
                <QuestStatsHeader stats={stats!} questId={questId} />
            )}

            {/* Top row: Funnel + Timing */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {isLoading ? (
                    <>
                        <Skeleton className="h-56 rounded-xl" />
                        <Skeleton className="h-56 rounded-xl" />
                    </>
                ) : (
                    <>
                        <FunnelCard stats={stats!} />
                        <TimingCard stats={stats!} />
                    </>
                )}
            </div>

            {/* Daily activity */}
            {isLoading ? <Skeleton className="h-72 rounded-xl" /> : (
                <DailyActivityChart data={stats!.daily_activity} />
            )}

            {/* Completion speed CDF */}
            {isLoading ? <Skeleton className="h-64 rounded-xl" /> : (
                <CompletionCDF
                    buckets={stats!.completion_time_histogram}
                    avg={stats!.avg_completion_time_seconds}
                    median={stats!.median_completion_time_seconds}
                />
            )}

            {/* Objective breakdown */}
            {isLoading ? <Skeleton className="h-48 rounded-xl" /> : (
                <ObjectivesFunnelTable objectives={stats!.objectives} />
            )}

            {/* TODO: experimental — remove or promote after review */}
            {isLoading ? <Skeleton className="h-72 rounded-xl" /> : (
                <SankeyCard stats={stats!} />
            )}
        </div>
    )
}
