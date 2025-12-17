// types/router.d.ts
import { ReactNode } from 'react'

declare module '@tanstack/react-router' {
    interface StaticDataRouteOption {
        pageTitle?: string
        headerActions?: ReactNode | (() => ReactNode)
    }
}