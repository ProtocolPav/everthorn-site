import * as React from 'react'
import posthog from 'posthog-js'
import { useRouterState } from '@tanstack/react-router'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
    React.useEffect(() => {
        posthog.init(import.meta.env.VITE_PUBLIC_POSTHOG_KEY, {
            api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
            capture_pageview: false,
            capture_pageleave: true,
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
