import { createFileRoute } from '@tanstack/react-router'
import { getListEventsV1GuildsMeEventsGetQueryOptions } from '@/api/nexuscore/events/events'
import { useListEventsV1GuildsMeEventsGet } from '@/api/nexuscore/events/events'
import { EventCard } from '@/components/features/events/event-card'
import { CalendarIcon, MagnifyingGlassIcon } from '@phosphor-icons/react'
import { Skeleton } from '@/components/ui/skeleton'

export const Route = createFileRoute('/_main/events/')( {
    loader: async ({ context }) => {
        await context.queryClient.prefetchQuery(
            getListEventsV1GuildsMeEventsGetQueryOptions()
        )
    },
    head: () => ({
        meta: [
            { property: 'og:title', content: 'Events | Everthorn' },
            {
                property: 'og:description',
                content: 'Browse all Everthorn server events — past, present, and upcoming.',
            },
        ],
    }),
    component: EventsIndexPage,
})

function EventsIndexPage() {
    const { data: events, isLoading, isError } = useListEventsV1GuildsMeEventsGet()

    const published = events?.filter((e) => e.status === 'published') ?? []

    return (
        <div className="min-h-screen">
            {/* Page header */}
            <div className="border-b bg-muted/20">
                <div className="max-w-6xl mx-auto px-5 md:px-10 py-10 md:py-14">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <CalendarIcon className="w-5 h-5 text-primary" weight="duotone" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold">Events</h1>
                    </div>
                    <p className="text-muted-foreground max-w-2xl">
                        Explore all Everthorn events — from epic server-wide competitions to intimate
                        community gatherings.
                    </p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-5 md:px-10 py-8 md:py-12">
                {isLoading && (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="rounded-xl overflow-hidden border">
                                <Skeleton className="aspect-video w-full" />
                                <div className="p-4 space-y-2">
                                    <Skeleton className="h-5 w-3/4" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-2/3" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {isError && (
                    <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-destructive/10 flex items-center justify-center">
                            <CalendarIcon className="w-7 h-7 text-destructive" weight="duotone" />
                        </div>
                        <p className="font-semibold text-lg">Failed to load events</p>
                        <p className="text-muted-foreground text-sm">
                            Something went wrong. Please try again later.
                        </p>
                    </div>
                )}

                {!isLoading && !isError && published.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center">
                            <MagnifyingGlassIcon className="w-7 h-7 text-muted-foreground" weight="duotone" />
                        </div>
                        <p className="font-semibold text-lg">No events yet</p>
                        <p className="text-muted-foreground text-sm">
                            Check back soon — something exciting is coming!
                        </p>
                    </div>
                )}

                {!isLoading && !isError && published.length > 0 && (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {published.map((event) => (
                            <EventCard key={event.slug} event={event} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
