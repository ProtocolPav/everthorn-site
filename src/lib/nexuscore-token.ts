import { createServerFn } from '@tanstack/react-start'

let cachedToken: { value: string; expiresAt: number } | null = null

export const getNexuscoreToken = createServerFn({ method: 'GET' }).handler(async () => {
    if (cachedToken && Date.now() < cachedToken.expiresAt - 60_000) {
        return cachedToken.value
    }

    const baseUrl = import.meta.env.VITE_NEXUSCORE_API_URL

    const res = await fetch(`${baseUrl}/auth/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: process.env.NEXUSCORE_CLIENT_ID!,
            client_secret: process.env.NEXUSCORE_CLIENT_SECRET!,
        }),
    })

    const data = await res.json()

    cachedToken = {
        value: data.access_token,
        expiresAt: Date.now() + data.expires_in * 1000,
    }

    return cachedToken.value
})