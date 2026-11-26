import { useMemo } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { z } from 'zod'
import { ChartBarIcon, UsersThreeIcon, WarningCircleIcon } from '@phosphor-icons/react'
import {
    useGetQuestStatisticsV1GuildsMeQuestsQuestIdStatisticsGet,
    useGetQuestV1GuildsMeQuestsQuestIdGet,
} from '@/api/nexuscore/quests/quests'
import { QuestBreadcrumb } from '@/components/features/quests/quest-breadcrumb'
import { QuestHubHeader } from '@/components/features/quests/hub/quest-hub-header'
import { QuestPlayers } from '@/components/features/quests/hub/quest-players'
import { QuestGlance } from '@/components/features/quests/hub/quest-glance'
import { PreviewNotice } from '@/components/features/quests/hub/preview-notice'
import { QuestPerformanceTab } from '@/components/features/quests/detail/quest-performance-tab'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getQuestLifecycle, isProgressFinished } from '@/lib/quest-lifecycle'
import { getPreviewPlayers } from '@/lib/quest-progress-preview'

const hubSearchSchema = z.object({
    // .catch() so a stale or hand-edited tab falls back to Players instead of erroring.
    tab: z.enum(['players', 'performance']).optional().catch(undefined),
})

type HubTab = NonNullable<z.infer<typeof hubSearchSchema>['tab']>

export const Route = createFileRoute('/admin/quests/$id/')({
    validateSearch: (search) => hubSearchSchema.parse(search),
    staticData: {
        pageTitle: <QuestBreadcrumb />,
    },
    component: QuestHubPage,
})

function QuestHubPage() {
    const { id } = Route.useParams()
    const { tab = 'players' } = Route.useSearch()
    const navigate = useNavigate({ from: Route.fullPath })
    const questId = parseInt(id, 10)

    function setTab(next: string) {
        navigate({ search: { tab: next === 'players' ? undefined : (next as HubTab) }, replace: true })
    }

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
    const finished = players.filter((player) => isProgressFinished(player.progress.status))

    return (
        <div className="flex flex-col">
            <QuestHubHeader quest={quest} stats={statsQuery.data} statsLoading={statsQuery.isLoading} />

            <Tabs value={tab} onValueChange={setTab} className="gap-0">
                <div className="px-6 pt-5">
                    <TabsList>
                        <TabsTrigger value="players">
                            <UsersThreeIcon />
                            Players
                        </TabsTrigger>
                        <TabsTrigger value="performance">
                            <ChartBarIcon />
                            Performance
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="players">
                    <div className="grid gap-x-10 gap-y-8 px-6 py-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
                        <div className="flex min-w-0 flex-col gap-5">
                            <PreviewNotice>
                                Player progress is preview data. There's no endpoint that lists a quest's players yet —
                                these rows use the quest's own objectives to show what the hub will look like.
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
                </TabsContent>

                <TabsContent value="performance" className="px-6 py-6">
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
                </TabsContent>
            </Tabs>
        </div>
    )
}
