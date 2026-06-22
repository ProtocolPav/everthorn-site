import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import * as React from "react"
import { ThemeProvider } from "@/lib/theme-provider.tsx"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { NotFoundScreen } from "@/components/errors/not-found.tsx"
import { Toaster } from "@/components/ui/sonner.tsx"
import { ServerErrorScreen } from "@/components/errors/server-error.tsx"
import appCss from '@/styles/globals.css?url'

// Lazy-load devtools — only included in the dev bundle, null in prod
const TanStackDevtools = import.meta.env.DEV
    ? React.lazy(() =>
        import('@tanstack/react-devtools').then((m) => ({ default: m.TanStackDevtools }))
    )
    : () => null

const TanStackRouterDevtoolsPanel = import.meta.env.DEV
    ? React.lazy(() =>
        import('@tanstack/react-router-devtools').then((m) => ({ default: m.TanStackRouterDevtoolsPanel }))
    )
    : () => null

const ReactQueryDevtoolsPanel = import.meta.env.DEV
    ? React.lazy(() =>
        import('@tanstack/react-query-devtools').then((m) => ({ default: m.ReactQueryDevtoolsPanel }))
    )
    : () => null

const FormDevtoolsPanel = import.meta.env.DEV
    ? React.lazy(() =>
        import('@tanstack/react-form-devtools').then((m) => ({ default: m.FormDevtoolsPanel }))
    )
    : () => null

export const Route = createRootRoute({
    head: () => ({
        meta: [
            {
                charSet: 'utf-8',
            },
            {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1',
            },
            {
                title: 'Everthorn',
            },
            {
                property: 'og:image',
                content: `${import.meta.env.VITE_BASE_URL}/landing/spawn.png`,
            },
            {
                property: 'og:image:width',
                content: '1920',
            },
            {
                property: 'og:image:height',
                content: '1080',
            },
            {
                property: 'og:title',
                content: 'Everthorn',
            },
            {
                property: 'og:description',
                content: "A Minecraft Bedrock Community that's been together for over 6 years",
            },
            {
                property: 'og:type',
                content: 'website',
            },
            {
                property: 'og:url',
                content: `${import.meta.env.VITE_BASE_URL}`,
            },
        ],
        links: [
            {
                rel: 'stylesheet',
                href: appCss,
            },
            {
                rel: 'icon',
                href: '/favicon.ico'
            },
        ],
    }),

    shellComponent: RootDocument,
    notFoundComponent: NotFoundScreen,
    errorComponent: ServerErrorScreen
})

const queryClient = new QueryClient()

function RootDocument({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <head>
            <title>Everthorn</title>
            <HeadContent />
        </head>
        <body>
        <QueryClientProvider client={queryClient}>
            <ThemeProvider forcedTheme={"dark"}>
                {children}
                <Toaster />
                <React.Suspense fallback={null}>
                    <TanStackDevtools
                        config={{ position: 'bottom-right' }}
                        plugins={[
                            { name: 'Tanstack Router', render: <TanStackRouterDevtoolsPanel /> },
                            { name: 'Tanstack Query', render: <ReactQueryDevtoolsPanel /> },
                            { name: 'Tanstack Form', render: <FormDevtoolsPanel /> },
                        ]}
                    />
                </React.Suspense>
            </ThemeProvider>
        </QueryClientProvider>
        <Scripts />
        </body>
        </html>
    )
}