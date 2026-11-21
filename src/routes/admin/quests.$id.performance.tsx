import { createFileRoute } from '@tanstack/react-router'
import { WarningCircleIcon } from '@phosphor-icons/react'
import {
    useGetQuestStatisticsV1GuildsMeQuestsQuestIdStatisticsGet,
    useGetQuestV1GuildsMeQuestsQuestIdGet,
} from '@/api/nexuscore/quests/quests'
import { QuestBreadcrumb } from '@/components/features/quests/quest-breadcrumb'
import { QuestSubpageHeader } from '@/components/features/quests/hub/quest-subpage-header'
import { QuestPerformanceTab } from '@/components/features/quests/detail/quest-performance-tab'
import { QuestTimeline } from '@/components/features/quests/dashboard/quest-timeline'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

export const Route = createFileRoute('/admin/quests/$id/performance')({
    staticData: {
        pageTitle: <QuestBreadcrumb suffix="Performance" />,
    },
    component: QuestPerformancePage,
})

function QuestPerformancePage() {
    const { id } = Route.useParams()
    const questId = parseInt(id, 10)

    const questQuery = useGetQuestV1GuildsMeQuestsQuestIdGet(questId)
    const statsQuery = useGetQuestStatisticsV1GuildsMeQuestsQuestIdStatisticsGet(questId)
    const quest = questQuery.data

    return (
        <div className="flex flex-col">
            <QuestSubpageHeader
                questId={id}
                eyebrow="Performance"
                title={quest?.title ?? '…'}
                description={quest ? <QuestTimeline quest={quest} className="max-w-md" /> : null}
            />

            <div className="px-6 py-6">
                {statsQuery.isLoading ? (
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        <Skeleton className="h-80 rounded-xl" />
                        <Skeleton className="h-80 rounded-xl" />
                    </div>
                ) : statsQuery.isError || !statsQuery.data ? (
                    <Alert variant="destructive" className="max-w-md bg-destructive/5">
                        <WarningCircleIcon />
                        <AlertTitle>Couldn't load statistics</AlertTitle>
                        <AlertDescription>
                            <p>
                                {statsQuery.error instanceof Error
                                    ? statsQuery.error.message
                                    : 'Something went wrong.'}
                            </p>
                            <Button size="sm" variant="outline" className="mt-2" onClick={() => statsQuery.refetch()}>
                                Try again
                            </Button>
                        </AlertDescription>
                    </Alert>
                ) : (
                    <QuestPerformanceTab stats={statsQuery.data} />
                )}
            </div>
        </div>
    )
}
