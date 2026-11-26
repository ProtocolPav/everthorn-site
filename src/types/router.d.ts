// types/router.d.ts
import { ReactNode } from 'react'

declare module '@tanstack/react-router' {
    interface StaticDataRouteOption {
        /** A plain string, or a node (e.g. a breadcrumb) for pages with dynamic titles. */
        pageTitle?: ReactNode
        headerActions?: ReactNode | (() => ReactNode)
    }
}
