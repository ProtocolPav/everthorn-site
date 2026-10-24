import { useEffect, useMemo, useRef, useState } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { motion, MotionConfig } from 'motion/react'
import { z } from 'zod'
import { MagnifyingGlassIcon, PlusIcon, ScrollIcon, WarningCircleIcon } from '@phosphor-icons/react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { Skeleton } from '@/components/ui/skeleton'
import { QuestCard } from '@/components/features/quests/quest-card'
import { QuestCardSkeleton } from '@/components/features/quests/quest-card-skeleton'
import { QuestRail, QuestSectionHeader } from '@/components/features/quests/dashboard/quest-rail'
import { QuestToolbar } from '@/components/features/quests/dashboard/quest-toolbar'
import { useListQuestsV1GuildsMeQuestsGet } from '@/api/nexuscore/quests/quests.ts'
import { useQuestsOverview } from '@/hooks/use-quests-overview.ts'
import { formatCountdown, getQuestLifecycle, matchesQuestQuery } from '@/lib/quest-lifecycle.ts'
import type { QuestOut } from '@/api/nexuscore/model'

const questsSearchSchema = z.object({
    query: z.string().optional(),
    // .catch() so stale or hand-edited URLs fall back to "no filter" instead of erroring.
    lifecycle: z.enum(['active', 'scheduled', 'expired']).optional().catch(undefined),
    type: z.array(z.string()).optional().catch(undefined),
    sort: z.string().optional().catch(undefined),
})

const PAST_PAGE_SIZE = 12
const GRID = 'grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4'
const EASE_OUT_EXPO = [0.22, 1, 0.36, 1] as const

export const Route = createFileRoute('/admin/quests/')({
    validateSearch: (search) => questsSearchSchema.parse(search),
    staticData: {
        pageTitle: 'Quests',
        headerActions: (
            <Button size="sm" asChild>
                <Link to="/admin/quests/editor/$id" params={{ id: 'new' }}>
                    <PlusIcon />
                    New quest
                </Link>
            </Button>
        ),
    },
    component: AdminQuestsPage,
})

function sortQuests(quests: QuestOut[], sort?: string) {
    const time = (d: string) => new Date(d).getTime()
    return [...quests].sort((a, b) => {
        if (sort === 'name') return a.title.localeCompare(b.title)
        if (sort === 'ending_soon') return time(a.end_time) - time(b.end_time)
        if (sort === 'oldest') return time(a.start_time) - time(b.start_time)
        return time(b.start_time) - time(a.start_time)
    })
}

function AdminQuestsPage() {
    const { data: quests, isLoading, isError, error, refetch } = useListQuestsV1GuildsMeQuestsGet()
    const { data: overview, isConceptFallback } = useQuestsOverview()
    const search = Route.useSearch()
    const navigate = useNavigate({ from: Route.fullPath })

    const [pastLimit, setPastLimit] = useState(PAST_PAGE_SIZE)

    // Only play the entrance on the first load, not every time the filters flip.
    const animateIn = useRef(true)
    useEffect(() => {
        if (quests) animateIn.current = false
    }, [quests])

    function onChange(updates: Partial<typeof search>) {
        navigate({ search: (prev) => ({ ...prev, ...updates }), replace: true })
    }

    const groups = useMemo(() => {
        const list = quests ?? []
        const byEnd = (a: QuestOut, b: QuestOut) => new Date(a.end_time).getTime() - new Date(b.end_time).getTime()
        const byStart = (a: QuestOut, b: QuestOut) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
        return {
            active: list.filter((q) => getQuestLifecycle(q) === 'active').sort(byEnd),
            scheduled: list.filter((q) => getQuestLifecycle(q) === 'scheduled').sort(byStart),
            expired: sortQuests(list.filter((q) => getQuestLifecycle(q) === 'expired'), search.sort),
        }
    }, [quests, search.sort])

    const counts = {
        all: quests?.length ?? 0,
        active: groups.active.length,
        scheduled: groups.scheduled.length,
        expired: groups.expired.length,
    }

    const isFiltering = !!(search.query || search.lifecycle || search.type?.length)

    const results = useMemo(() => {
        if (!isFiltering) return []
        const filtered = (quests ?? []).filter((q) => {
            if (search.query && !matchesQuestQuery(q, search.query)) return false
            if (search.lifecycle && getQuestLifecycle(q) !== search.lifecycle) return false
            if (search.type?.length && !search.type.includes(q.quest_type)) return false
            return true
        })
        return sortQuests(filtered, search.sort)
    }, [quests, isFiltering, search.query, search.lifecycle, search.type, search.sort])

    const nextUp = groups.scheduled[0]
    const pastShown = groups.expired.slice(0, pastLimit)

    const reveal = (delay: number) => ({
        initial: animateIn.current ? { opacity: 0, y: 10 } : false,
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5, delay, ease: EASE_OUT_EXPO },
    })

    if (isError) {
        return (
            <div className="flex h-[60vh] items-center justify-center p-6">
                <Alert variant="destructive" className="max-w-md bg-destructive/5">
                    <WarningCircleIcon />
                    <AlertTitle>Couldn't load quests</AlertTitle>
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

    if (isLoading) {
        return (
            <div className="px-6 pb-6">
                <div className="-mx-6 border-b px-6 py-2.5">
                    <Skeleton className="h-9 w-full max-w-md" />
                </div>
                <div className={`${GRID} pt-6`}>
                    {Array.from({ length: 6 }).map((_, i) => (
                        <QuestCardSkeleton key={i} />
                    ))}
                </div>
            </div>
        )
    }

    if (counts.all === 0) {
        return (
            <Empty className="h-[70vh]">
                <EmptyHeader>
                    <EmptyMedia variant="icon"><ScrollIcon /></EmptyMedia>
                    <EmptyTitle>No quests yet</EmptyTitle>
                    <EmptyDescription>Create the first one and it will show up here, sorted by when it runs.</EmptyDescription>
                </EmptyHeader>
                <Button size="sm" asChild>
                    <Link to="/admin/quests/editor/$id" params={{ id: 'new' }}>
                        <PlusIcon />
                        New quest
                    </Link>
                </Button>
            </Empty>
        )
    }

    const engagement = overview?.engagement_30d
    const showEngagement = !isConceptFallback && !!engagement && engagement.accepts > 0

    return (
        <MotionConfig reducedMotion="user">
            <div className="px-6 pb-8">
                <QuestToolbar state={search} counts={counts} onChange={onChange} />

                {isFiltering ? (
                    <section className="flex flex-col gap-2 pt-6">
                        <QuestSectionHeader
                            title={search.lifecycle ? `${search.lifecycle} quests` : 'Results'}
                            count={results.length}
                        >
                            <Button
                                variant="ghost"
                                size="xs"
                                onClick={() => onChange({ query: undefined, lifecycle: undefined, type: undefined, sort: undefined })}
                            >
                                Clear filters
                            </Button>
                        </QuestSectionHeader>

                        {results.length > 0 ? (
                            <div className={GRID}>
                                {results.map((quest) => <QuestCard key={quest.quest_id} quest={quest} />)}
                            </div>
                        ) : (
                            <Empty className="py-16">
                                <EmptyHeader>
                                    <EmptyMedia variant="icon"><MagnifyingGlassIcon /></EmptyMedia>
                                    <EmptyTitle>No quests match</EmptyTitle>
                                    <EmptyDescription>
                                        {search.query
                                            ? <>Nothing found for “{search.query}”. Search covers title, tags, description and ID.</>
                                            : 'Try removing a filter.'}
                                    </EmptyDescription>
                                </EmptyHeader>
                            </Empty>
                        )}
                    </section>
                ) : (
                    <div className="flex flex-col gap-10 pt-8">
                        {showEngagement && (
                            <p className="text-xs tabular-nums text-muted-foreground">
                                Last 30 days:{' '}
                                <span className="font-semibold text-foreground">{engagement.accepts.toLocaleString()}</span> accepts ·{' '}
                                <span className="font-semibold text-foreground">{engagement.completed.toLocaleString()}</span> completed ·{' '}
                                <span className="font-semibold text-foreground">{(engagement.avg_completion_rate * 100).toFixed(0)}%</span> average completion
                            </p>
                        )}

                        {groups.active.length > 0 ? (
                            <motion.div {...reveal(0)}>
                                <QuestRail title="Active" count={groups.active.length}>
                                    {groups.active.map((quest) => (
                                        <QuestCard key={quest.quest_id} quest={quest} className="w-[300px] shrink-0 snap-start" />
                                    ))}
                                </QuestRail>
                            </motion.div>
                        ) : (
                            <motion.p {...reveal(0)} className="text-sm font-light text-muted-foreground">
                                Nothing is active right now.
                                {nextUp && (
                                    <>
                                        {' '}
                                        <Link
                                            to="/admin/quests/$id"
                                            params={{ id: `${nextUp.quest_id}` }}
                                            className="font-medium text-foreground underline-offset-4 hover:underline"
                                        >
                                            {nextUp.title}
                                        </Link>{' '}
                                        starts {formatCountdown(nextUp)}.
                                    </>
                                )}
                            </motion.p>
                        )}

                        {groups.scheduled.length > 0 && (
                            <motion.div {...reveal(0.08)}>
                                <QuestRail title="Scheduled" count={groups.scheduled.length}>
                                    {groups.scheduled.map((quest) => (
                                        <QuestCard key={quest.quest_id} quest={quest} className="w-[300px] shrink-0 snap-start" />
                                    ))}
                                </QuestRail>
                            </motion.div>
                        )}

                        {groups.expired.length > 0 && (
                            <motion.section {...reveal(0.16)} className="flex flex-col gap-2">
                                <QuestSectionHeader title="Expired" count={groups.expired.length} />
                                <div className={GRID}>
                                    {pastShown.map((quest) => <QuestCard key={quest.quest_id} quest={quest} />)}
                                </div>
                                {groups.expired.length > pastShown.length && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="mx-auto mt-2"
                                        onClick={() => setPastLimit((n) => n + PAST_PAGE_SIZE)}
                                    >
                                        Show {Math.min(PAST_PAGE_SIZE, groups.expired.length - pastShown.length)} more
                                        <span className="tabular-nums text-muted-foreground">
                                            · {groups.expired.length - pastShown.length} left
                                        </span>
                                    </Button>
                                )}
                            </motion.section>
                        )}
                    </div>
                )}
            </div>
        </MotionConfig>
    )
}
