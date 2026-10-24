import { useMemo } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { WarningCircleIcon } from '@phosphor-icons/react'
import {
    useGetQuestStatisticsV1GuildsMeQuestsQuestIdStatisticsGet,
    useGetQuestV1GuildsMeQuestsQuestIdGet,
} from '@/api/nexuscore/quests/quests'
import { QuestBreadcrumb } from '@/components/features/quests/quest-breadcrumb'
import { QuestHubHeader } from '@/components/features/quests/hub/quest-hub-header'
import { QuestPlayers } from '@/components/features/quests/hub/quest-players'
import { QuestGlance } from '@/components/features/quests/hub/quest-glance'
import { PreviewNotice } from '@/components/features/quests/hub/preview-notice'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { getQuestLifecycle } from '@/lib/quest-lifecycle'
import { getPreviewPlayers } from '@/lib/quest-progress-preview'

export const Route = createFileRoute('/admin/quests/$id/')({
    staticData: {
        pageTitle: <QuestBreadcrumb />,
    },
    component: QuestHubPage,
})

function QuestHubPage() {
    const { id } = Route.useParams()
    const questId = parseInt(id, 10)

    const questQuery = useGetQuestV1GuildsMeQuestsQuestIdGet(questId)
    const statsQuery = useGetQuestStatisticsV1GuildsMeQuestsQuestIdStatisticsGet(questId)

    const quest = questQuery.data
    const players = useMemo(() => (quest ? getPreviewPlayers(quest) : []), [quest])

    if (questQuery.isError) {
        return (
            <div className="flex h-[60vh] items-center justify-center p-6">
                <Alert variant="destructive" className="max-w-md bg-destructive/5">
                    <WarningCircleIcon />
                    <AlertTitle>Couldn't load this quest</AlertTitle>
                    <AlertDescription>
                        <p>{questQuery.error instanceof Error ? questQuery.error.message : 'Something went wrong.'}</p>
                        <Button size="sm" variant="outline" className="mt-2" onClick={() => questQuery.refetch()}>
                            Try again
                        </Button>
                    </AlertDescription>
                </Alert>
            </div>
        )
    }

    if (!quest) {
        return (
            <div className="flex flex-col gap-5 p-6">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-9 w-2/3 max-w-xl" />
                <Skeleton className="h-4 w-full max-w-2xl" />
                <Skeleton className="h-[92px] w-full" />
                <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
                    <div className="flex flex-col gap-3">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <Skeleton key={index} className="h-14 w-full" />
                        ))}
                    </div>
                    <Skeleton className="h-64 w-full" />
                </div>
            </div>
        )
    }

    const lifecycle = getQuestLifecycle(quest)
    const inProgress = players.filter(
        (player) => player.progress.status === 'pending' || player.progress.status === 'active',
    )
    const finished = players.filter(
        (player) => player.progress.status === 'completed' || player.progress.status === 'failed',
    )

    return (
        <div className="flex flex-col">
            <QuestHubHeader quest={quest} stats={statsQuery.data} statsLoading={statsQuery.isLoading} />

            <div className="grid gap-x-10 gap-y-8 px-6 py-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
                <div className="flex min-w-0 flex-col gap-5">
                    <PreviewNotice>
                        Player progress is preview data. There's no endpoint that lists a quest's players yet — these rows
                        use the quest's own objectives to show what the hub will look like.
                    </PreviewNotice>

                    {lifecycle === 'scheduled' ? (
                        <p className="py-6 text-sm font-light text-muted-foreground">
                            This quest hasn't started yet. Players will appear here once it opens.
                        </p>
                    ) : (
                        <QuestPlayers quest={quest} inProgress={inProgress} finished={finished} />
                    )}
                </div>

                <aside className="min-w-0">
                    <QuestGlance quest={quest} />
                </aside>
            </div>
        </div>
    )
}
