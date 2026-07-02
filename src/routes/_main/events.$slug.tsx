import { createFileRoute, notFound } from '@tanstack/react-router'
import {useListEventsV1GuildsMeEventsGet} from '@/api/nexuscore/events/events'
import { EventPage } from '@/components/features/events/event-page'
import { NotFoundScreen } from '@/components/errors/not-found'

export const Route = createFileRoute('/_main/events/$slug')({
    component: EventSlugPage,
    notFoundComponent: NotFoundScreen,
})

function EventSlugPage() {
    const { slug } = Route.useParams()
    const { data: events, isLoading, isError } = useListEventsV1GuildsMeEventsGet()

    if (isLoading) {
        return <div className="max-w-5xl mx-auto px-5 md:px-10 py-16">Loading event...</div>
    }

    if (isError || !events) {
        throw notFound()
    }

    const event = events.find((e) => e.slug === slug)

    if (!event) {
        throw notFound()
    }

    return <EventPage event={event} />
}
