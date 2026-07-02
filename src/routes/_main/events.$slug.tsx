import { createFileRoute, notFound } from '@tanstack/react-router'
import { getListEventsV1GuildsMeEventsGetQueryOptions } from '@/api/nexuscore/events/events'
import { EventPage } from '@/components/features/events/event-page'
import { NotFoundScreen } from '@/components/errors/not-found'

export const Route = createFileRoute('/_main/events/$slug')({
    loader: async ({ context, params }) => {
        const events = await context.queryClient.ensureQueryData(
            getListEventsV1GuildsMeEventsGetQueryOptions()
        )
        const event = events.find((e) => e.slug === params.slug)
        if (!event) throw notFound()
        return { event }
    },
    head: ({ loaderData }) => ({
        meta: [
            {
                property: 'og:title',
                content: `${loaderData?.event?.title ?? 'Event'} | Everthorn`,
            },
            {
                property: 'og:description',
                content: loaderData?.event?.description ?? 'An Everthorn Event',
            },
            {
                property: 'og:image',
                content:
                    loaderData?.event?.image_url ??
                    `${import.meta.env.VITE_BASE_URL}/landing/spawn.png`,
            },
            {
                property: 'og:url',
                content: `${import.meta.env.VITE_BASE_URL}/events/${loaderData?.event?.slug}`,
            },
            {
                name: 'twitter:title',
                content: `${loaderData?.event?.title ?? 'Event'} | Everthorn`,
            },
            {
                name: 'twitter:description',
                content: loaderData?.event?.description ?? 'An Everthorn Event',
            },
            {
                name: 'twitter:image',
                content:
                    loaderData?.event?.image_url ??
                    `${import.meta.env.VITE_BASE_URL}/landing/spawn.png`,
            },
        ],
    }),
    component: EventSlugPage,
    notFoundComponent: NotFoundScreen,
})

function EventSlugPage() {
    const { event } = Route.useLoaderData()
    return <EventPage event={event} />
}
