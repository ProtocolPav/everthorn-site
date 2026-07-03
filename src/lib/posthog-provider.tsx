import * as React from 'react'
import posthog from 'posthog-js'
import { useRouterState } from '@tanstack/react-router'
import {authClient} from "@/lib/auth-client.ts";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
    React.useEffect(() => {
        posthog.init(import.meta.env.VITE_PUBLIC_POSTHOG_KEY, {
            api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
        })
    }, [])

    return <>{children}</>
}

export function PostHogPageviewTracker() {
    const location = useRouterState({ select: (s) => s.location })

    React.useEffect(() => {
        posthog.capture('$pageview', { $current_url: window.location.href })
    }, [location.pathname, location.search])

    return null
}

export function PostHogAuthSync() {
    const { data: session, isPending } = authClient.useSession()
    const identifiedIdRef = React.useRef<string | null>(null)

    React.useEffect(() => {
        if (isPending) return

        const user = session?.user

        if (!user) {
            identifiedIdRef.current = null
            posthog.reset()
            return
        }

        if (identifiedIdRef.current === user.id) return

        posthog.identify(user.id, {
            username: user.username,
        })

        identifiedIdRef.current = user.id
    }, [isPending, session?.user?.id, session?.user?.email, session?.user?.name])

    return null
}
