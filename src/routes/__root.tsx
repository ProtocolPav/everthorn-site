import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import appCss from '../styles.css?url'
import * as React from "react";
import {ThemeProvider} from "@/lib/theme-provider.tsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {NotFoundScreen} from "@/components/errors/not-found.tsx";
import {Toaster} from "@/components/ui/sonner.tsx";
import {ReactQueryDevtoolsPanel} from "@tanstack/react-query-devtools";

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
  notFoundComponent: NotFoundScreen
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
            <ThemeProvider>
                {children}
                <Toaster/>
                <TanStackDevtools
                  config={{
                    position: 'bottom-right',
                  }}
                  plugins={[
                    {
                      name: 'Tanstack Router',
                      render: <TanStackRouterDevtoolsPanel />,
                    },
                      {
                          name: 'Tanstack Query',
                          render: <ReactQueryDevtoolsPanel />,
                      },
                  ]}
                />
            </ThemeProvider>
        </QueryClientProvider>
        <Scripts />
      </body>
    </html>
  )
}
