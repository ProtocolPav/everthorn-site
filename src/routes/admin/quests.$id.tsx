import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { z } from 'zod'
import { WarningCircleIcon } from '@phosphor-icons/react'
import {
    useGetQuestStatisticsV1GuildsMeQuestsQuestIdStatisticsGet,
    useGetQuestV1GuildsMeQuestsQuestIdGet,
} from '@/api/nexuscore/quests/quests'
import { QuestBreadcrumb } from '@/components/features/quests/quest-breadcrumb'
import { QuestHeader } from '@/components/features/quests/detail/quest-header'
import { QuestDetailsTab } from '@/components/features/quests/detail/quest-details-tab'
import { QuestPerformanceTab } from '@/components/features/quests/detail/quest-performance-tab'
import { QuestHealthDot } from '@/components/features/quests/detail/quest-kpi-strip'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getQuestLifecycle } from '@/lib/quest-lifecycle'

const questHubSearchSchema = z.object({
    tab: z.enum(['performance', 'details']).optional(),
})

export const Route = createFileRoute('/admin/quests/$id')({
    validateSearch: (search) => questHubSearchSchema.parse(search),
    staticData: {
        pageTitle: <QuestBreadcrumb />,
    },
    component: QuestHubPage,
})

function QuestHubPage() {
    const { id } = Route.useParams()
    const questId = parseInt(id, 10)
    const { tab } = Route.useSearch()
    const navigate = useNavigate({ from: Route.fullPath })

    const questQuery = useGetQuestV1GuildsMeQuestsQuestIdGet(questId)
    const statsQuery = useGetQuestStatisticsV1GuildsMeQuestsQuestIdStatisticsGet(questId)

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

    const quest = questQuery.data
    if (!quest) {
        return (
            <div className="flex flex-col gap-5 p-6">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-9 w-2/3 max-w-xl" />
                <Skeleton className="h-4 w-full max-w-2xl" />
                <Skeleton className="h-[92px] w-full" />
            </div>
        )
    }

    // A scheduled quest has no players yet, so it opens on its configuration.
    const activeTab = tab ?? (getQuestLifecycle(quest) === 'scheduled' ? 'details' : 'performance')

    return (
        <div className="flex flex-col gap-6 p-6 pt-5">
            <QuestHeader quest={quest} stats={statsQuery.data} statsLoading={statsQuery.isLoading} />

            <Tabs
                value={activeTab}
                onValueChange={(value) => navigate({ search: { tab: value as 'performance' | 'details' }, replace: true })}
            >
                <TabsList className="w-fit">
                    <TabsTrigger value="performance">
                        Performance
                        {statsQuery.data && <QuestHealthDot stats={statsQuery.data} />}
                    </TabsTrigger>
                    <TabsTrigger value="details">Details</TabsTrigger>
                </TabsList>

                <TabsContent value="performance" className="pt-2">
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
                                <p>{statsQuery.error instanceof Error ? statsQuery.error.message : 'Something went wrong.'}</p>
                                <Button size="sm" variant="outline" className="mt-2" onClick={() => statsQuery.refetch()}>
                                    Try again
                                </Button>
                            </AlertDescription>
                        </Alert>
                    ) : (
                        <QuestPerformanceTab stats={statsQuery.data} />
                    )}
                </TabsContent>

                <TabsContent value="details" className="pt-4">
                    <QuestDetailsTab quest={quest} />
                </TabsContent>
            </Tabs>
        </div>
    )
}
