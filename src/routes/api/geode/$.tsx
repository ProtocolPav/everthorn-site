// app/routes/api/geode/$.tsx
import { createFileRoute } from '@tanstack/react-router'

const GEODE_URL = import.meta.env.VITE_GEODE_URL

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
    const upstreamPath = url.pathname.replace('/api/geode', '')
    const upstreamUrl = `${GEODE_URL}${upstreamPath}${url.search}`

    // ✅ Return the upstream response directly — Content-Type, body, status all pass through
    return fetch(upstreamUrl, {
        method: request.method,
        headers: request.headers,
        body: request.body,
        duplex: 'half',
    } as RequestInit)
}