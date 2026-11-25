import { useMemo } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { SunIcon, WarningCircleIcon } from '@phosphor-icons/react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { Skeleton } from '@/components/ui/skeleton'
import { QuestCardSkeleton } from '@/components/features/quests/quest-card-skeleton'
import { QUEST_GRID } from '@/components/features/quests/dashboard/quest-section'
import { DailyBreadcrumb } from '@/components/features/quests/daily/daily-breadcrumb'
import { DailyToolbar } from '@/components/features/quests/daily/daily-toolbar'
import { DailySection } from '@/components/features/quests/daily/daily-section'
import { DailyQuestCard } from '@/components/features/quests/daily/daily-quest-card'
import { DailyEditedBadge } from '@/components/features/quests/daily/daily-edited-badge'
import {
    useListDailyTemplatesV1GuildsMeQuestsDailyTemplatesGet,
    useListUpcomingDailyQuestsV1GuildsMeQuestsDailyUpcomingGet,
} from '@/api/nexuscore/daily-quests/daily-quests.ts'
import { toUtcDateString } from '@/lib/daily-quests.ts'
import type { DailyQuestOut } from '@/api/nexuscore/model'

export const Route = createFileRoute('/admin/quests/daily/')({
    component: UpcomingDailiesPage,
    staticData: {
        pageTitle: <DailyBreadcrumb />,
    },
})

function useTemplateNames() {
    const { data: templates } = useListDailyTemplatesV1GuildsMeQuestsDailyTemplatesGet()
    return useMemo(() => {
        if (!templates) return undefined
        return new Map(templates.map((template) => [template.template_id, template.name]))
    }, [templates])
}

function UpcomingDailiesPage() {
    const { data: upcoming, isLoading, isError, error, refetch } = useListUpcomingDailyQuestsV1GuildsMeQuestsDailyUpcomingGet()
    const templateNames = useTemplateNames()

    function templateNameOf(daily: DailyQuestOut): string | null | undefined {
        if (daily.template_id === null) return null
        if (!templateNames) return undefined
        return templateNames.get(daily.template_id) ?? null
    }

    function editedBadge(daily: DailyQuestOut) {
        return daily.quest.last_edited_at ? <DailyEditedBadge editedAt={daily.quest.last_edited_at} /> : null
    }

    if (isError) {
        return (
            <div className="flex h-[60vh] items-center justify-center p-6">
                <Alert variant="destructive" className="max-w-md bg-destructive/5">
                    <WarningCircleIcon />
                    <AlertTitle>Couldn't load daily quests</AlertTitle>
                    <AlertDescription>
                        <p>{error instanceof Error ? error.message : 'Something went wrong.'}</p>
                        <Button size="sm" variant="outline" className="mt-2" onClick={() => refetch()}>
                            Try again
                        </Button>
                    </AlertDescription>
                </Alert>
            </div>
        )
    }

    const today = toUtcDateString(new Date())
    const days = upcoming ?? []
    const live = days.filter((daily) => daily.quest_date === today)
    const later = days.filter((daily) => daily.quest_date > today)

    return (
        <div className="px-6 pb-8">
            <DailyToolbar active="upcoming" counts={{ upcoming: upcoming?.length }} />

            {isLoading ? (
                <div className="flex flex-col gap-8 pt-6">
                    {Array.from({ length: 2 }).map((_, section) => (
                        <div key={section} className="flex flex-col gap-2">
                            <Skeleton className="h-4 w-24" />
                            <div className={QUEST_GRID}>
                                {Array.from({ length: 3 }).map((_, card) => (
                                    <QuestCardSkeleton key={card} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : days.length === 0 ? (
                <Empty className="py-16">
                    <EmptyHeader>
                        <EmptyMedia variant="icon"><SunIcon /></EmptyMedia>
                        <EmptyTitle>No daily quests yet</EmptyTitle>
                        <EmptyDescription>
                            Nexuscore generates the next 7 days once at least one template is enabled.
                        </EmptyDescription>
                    </EmptyHeader>
                </Empty>
            ) : (
                <div className="flex flex-col gap-8 pt-6">
                    <p className="text-xs text-muted-foreground">
                        One daily per UTC day, generated a week ahead. Each runs for 30 hours, so consecutive days
                        overlap.
                    </p>

                    <DailySection
                        title="Live"
                        count={live.length}
                        tone="bg-emerald-500"
                        empty={<p className="text-sm font-light text-muted-foreground">Today's daily hasn't been generated yet.</p>}
                    >
                        {live.map((daily) => (
                            <DailyQuestCard
                                key={daily.quest_date}
                                daily={daily}
                                variant="live"
                                templateName={templateNameOf(daily)}
                                badges={editedBadge(daily)}
                            />
                        ))}
                    </DailySection>

                    <DailySection title="Upcoming" count={later.length} tone="bg-amber-500">
                        {later.map((daily) => (
                            <DailyQuestCard
                                key={daily.quest_date}
                                daily={daily}
                                variant="upcoming"
                                templateName={templateNameOf(daily)}
                                badges={editedBadge(daily)}
                            />
                        ))}
                    </DailySection>
                </div>
            )}
        </div>
    )
}
