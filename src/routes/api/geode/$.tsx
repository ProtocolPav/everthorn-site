// app/routes/api/geode/$.tsx
import { createFileRoute } from '@tanstack/react-router'

const GEODE_URL = process.env.VITE_GEODE_URL

export const Route = createFileRoute('/api/geode/$')({
    server: {
        handlers: {
            GET: ({ request }) => proxy(request),
            POST: ({ request }) => proxy(request),
            PUT: ({ request }) => proxy(request),
            PATCH: ({ request }) => proxy(request),
            DELETE: ({ request }) => proxy(request),
        },
    },
})

async function proxy(request: Request): Promise<Response> {
    const url = new URL(request.url)

    // Strip /api/geode prefix and forward the rest
    const upstreamPath = url.pathname.replace('/api/geode', '')
    const upstreamUrl = `${GEODE_URL}${upstreamPath}${url.search}`

    return fetch(upstreamUrl, {
        method: request.method,
        headers: request.headers,
        body: request.body,
        // Required for streaming (SSE) responses
        duplex: 'half',
    } as RequestInit)
}