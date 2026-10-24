import { useCallback, useEffect, useMemo, useState } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { z } from 'zod'
import { MagnifyingGlassIcon, PlusIcon, ScrollIcon, WarningCircleIcon } from '@phosphor-icons/react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { Skeleton } from '@/components/ui/skeleton'
import { QuestCardSkeleton } from '@/components/features/quests/quest-card-skeleton'
import { QUEST_GRID, QuestSection } from '@/components/features/quests/dashboard/quest-section'
import { QuestToolbar } from '@/components/features/quests/dashboard/quest-toolbar'
import { useListQuestsV1GuildsMeQuestsGet } from '@/api/nexuscore/quests/quests.ts'
import { useQuestsOverview } from '@/hooks/use-quests-overview.ts'
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll.ts'
import { formatCountdown, getQuestLifecycle, matchesQuestQuery, type QuestLifecycle } from '@/lib/quest-lifecycle.ts'
import type { QuestOut } from '@/api/nexuscore/model'

const questsSearchSchema = z.object({
    query: z.string().optional(),
    // .catch() so stale or hand-edited URLs fall back to "no filter" instead of erroring.
    lifecycle: z.enum(['active', 'scheduled', 'expired']).optional().catch(undefined),
    type: z.array(z.string()).optional().catch(undefined),
    sort: z.string().optional().catch(undefined),
})

const PAST_PAGE_SIZE = 12

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

/**
 * "Recommended" (the default) uses each section's natural order: active by
 * ending soonest, scheduled by starting soonest, expired by most recent.
 */
function sortQuests(list: QuestOut[], sort: string | undefined, lifecycle: QuestLifecycle): QuestOut[] {
    const time = (value: string) => new Date(value).getTime()

    return [...list].sort((a, b) => {
        switch (sort) {
            case 'name':
                return a.title.localeCompare(b.title)
            case 'oldest':
                return time(a.start_time) - time(b.start_time)
            case 'newest':
                return time(b.start_time) - time(a.start_time)
            case 'ending_soon':
                return time(a.end_time) - time(b.end_time)
            default:
                if (lifecycle === 'active') return time(a.end_time) - time(b.end_time)
                if (lifecycle === 'scheduled') return time(a.start_time) - time(b.start_time)
                return time(b.end_time) - time(a.end_time)
        }
    })
}

function AdminQuestsPage() {
    const { data: quests, isLoading, isError, error, refetch } = useListQuestsV1GuildsMeQuestsGet()
    const { data: overview, isConceptFallback } = useQuestsOverview()
    const search = Route.useSearch()
    const navigate = useNavigate({ from: Route.fullPath })

    const [pastLimit, setPastLimit] = useState(PAST_PAGE_SIZE)

    // New filters should start the archive from the top again.
    const typeKey = search.type?.join(',') ?? ''
    useEffect(() => {
        setPastLimit(PAST_PAGE_SIZE)
    }, [search.query, search.lifecycle, typeKey, search.sort])

    function onChange(updates: Partial<typeof search>) {
        navigate({ search: (prev) => ({ ...prev, ...updates }), replace: true })
    }

    function clearAll() {
        onChange({ query: undefined, lifecycle: undefined, type: undefined, sort: undefined })
    }

    // Search + type narrow everything first; lifecycle then splits the result.
    const base = useMemo(() => {
        const list = quests ?? []
        const types = search.type ?? []
        return list.filter((quest) => {
            if (search.query && !matchesQuestQuery(quest, search.query)) return false
            if (types.length > 0 && !types.includes(quest.quest_type)) return false
            return true
        })
    }, [quests, search.query, search.type])

    const groups = useMemo(() => {
        const byLifecycle = (lifecycle: QuestLifecycle) =>
            base.filter((quest) => getQuestLifecycle(quest) === lifecycle)
        return {
            active: sortQuests(byLifecycle('active'), search.sort, 'active'),
            scheduled: sortQuests(byLifecycle('scheduled'), search.sort, 'scheduled'),
            expired: sortQuests(byLifecycle('expired'), search.sort, 'expired'),
        }
    }, [base, search.sort])

    const counts = {
        all: base.length,
        active: groups.active.length,
        scheduled: groups.scheduled.length,
        expired: groups.expired.length,
    }

    const isSearching = !!search.query || !!search.type?.length
    const nextUp = groups.scheduled[0]
    const pastShown = groups.expired.slice(0, pastLimit)

    const hasMoreExpired = groups.expired.length > pastShown.length
    const loadMoreExpired = useCallback(() => {
        setPastLimit((limit) => Math.min(limit + PAST_PAGE_SIZE, groups.expired.length))
    }, [groups.expired.length])
    const expiredSentinelRef = useInfiniteScroll(hasMoreExpired, loadMoreExpired, pastShown.length)

    const selectedCount = search.lifecycle ? groups[search.lifecycle].length : base.length
    const showGlobalEmpty = isSearching && selectedCount === 0

    const showActive =
        search.lifecycle === 'active' || (!search.lifecycle && (!isSearching || groups.active.length > 0))
    const showScheduled =
        search.lifecycle === 'scheduled' || (!search.lifecycle && groups.scheduled.length > 0)
    const showExpired = search.lifecycle === 'expired' || (!search.lifecycle && groups.expired.length > 0)

    const engagement = overview?.engagement_30d
    const showEngagement =
        !isConceptFallback && !!engagement && engagement.accepts > 0 && !isSearching && !search.lifecycle

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
            <div className="px-6 pb-8">
                <div className="sticky top-0 z-10 -mx-6 border-b bg-background/80 px-6 py-2 backdrop-blur-sm">
                    <div className="flex items-center gap-1.5">
                        <Skeleton className="h-9 flex-1 md:max-w-sm" />
                        <Skeleton className="h-9 w-20" />
                        <Skeleton className="h-9 w-20" />
                    </div>
                    <div className="mt-1.5 flex gap-1.5">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <Skeleton key={index} className="h-8 w-20" />
                        ))}
                    </div>
                </div>
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
            </div>
        )
    }

    if ((quests?.length ?? 0) === 0) {
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

    return (
        <div className="px-6 pb-8">
            <QuestToolbar state={search} counts={counts} onChange={onChange} />

            <div className="flex flex-col gap-8 pt-6">
                {showEngagement && (
                    <p className="text-xs tabular-nums text-muted-foreground">
                        Last 30 days:{' '}
                        <span className="font-semibold text-foreground">{engagement.accepts.toLocaleString()}</span> accepts ·{' '}
                        <span className="font-semibold text-foreground">{engagement.completed.toLocaleString()}</span> completed ·{' '}
                        <span className="font-semibold text-foreground">{(engagement.avg_completion_rate * 100).toFixed(0)}%</span> average completion
                    </p>
                )}

                {showGlobalEmpty ? (
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
                        <Button variant="outline" size="sm" onClick={clearAll}>
                            Clear filters
                        </Button>
                    </Empty>
                ) : (
                    <>
                        {showActive && (
                            <QuestSection
                                lifecycle="active"
                                title="Active"
                                count={groups.active.length}
                                quests={groups.active}
                                showHeader={!search.lifecycle}
                                empty={
                                    <p className="text-sm font-light text-muted-foreground">
                                        Nothing active right now.
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
                                    </p>
                                }
                            />
                        )}

                        {showScheduled && (
                            <QuestSection
                                lifecycle="scheduled"
                                title="Scheduled"
                                count={groups.scheduled.length}
                                quests={groups.scheduled}
                                showHeader={!search.lifecycle}
                                empty={
                                    <p className="text-sm font-light text-muted-foreground">
                                        Nothing scheduled. Upcoming quests will appear here before they open.
                                    </p>
                                }
                            />
                        )}

                        {showExpired && (
                            <QuestSection
                                lifecycle="expired"
                                title="Expired"
                                count={groups.expired.length}
                                quests={pastShown}
                                showHeader={!search.lifecycle}
                                empty={
                                    <p className="text-sm font-light text-muted-foreground">
                                        No expired quests yet.
                                    </p>
                                }
                                footer={
                                    hasMoreExpired ? (
                                        <div ref={expiredSentinelRef} className="h-8" aria-hidden="true" />
                                    ) : null
                                }
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
