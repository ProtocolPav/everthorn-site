import {createFileRoute, Outlet, useMatches} from '@tanstack/react-router'
import {AdminSidebar} from "@/components/layout/admin-sidebar/sidebar.tsx";
import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar.tsx";
import {AdminSidebarTrigger} from "@/components/layout/admin-sidebar/sidebar-trigger.tsx";
import {createServerFn} from "@tanstack/react-start";
import {getCookies} from "@tanstack/start-server-core";
import {ScrollArea} from "@/components/ui/scroll-area.tsx";
import {NotFoundScreen} from "@/components/errors/not-found.tsx";

export const Route = createFileRoute('/admin')({
    loader: async () => {
        const defaultOpen = await getSidebarState()
        return {defaultOpen}
    },
    component: AdminLayout,
    notFoundComponent: NotFoundScreen
})

const getSidebarState = createServerFn({method: 'GET'}).handler(async () => {
    const cookies = getCookies()
    return cookies.sidebar_state === 'true'
})

function AdminLayout() {
    const {defaultOpen} = Route.useLoaderData()
    const matches = useMatches()
    const currentMatch = matches[matches.length - 1]
    const { pageTitle, headerActions } = currentMatch?.staticData ?? {}

    return (
        <SidebarProvider defaultOpen={defaultOpen}>
            <AdminSidebar/>
            <SidebarInset className={'flex flex-col h-dvh'}>
                <header className="sticky top-0 border-b bg-background/50 backdrop-blur-sm shrink-0 transition-[width,height] ease-linear">
                    <div className="flex items-center justify-between h-14 px-4">
                        <div className="flex items-center gap-2">
                            <AdminSidebarTrigger/>
                            {pageTitle && <span className="font-semibold">{pageTitle}</span>}
                        </div>
                        {headerActions && (
                            <div className="flex items-center gap-2">
                                {typeof headerActions === 'function' ? headerActions() : headerActions}
                            </div>
                        )}
                    </div>
                </header>

                <ScrollArea className="flex-1 min-h-0">
                    <div className="h-full">
                        <Outlet />
                    </div>
                </ScrollArea>
            </SidebarInset>
        </SidebarProvider>
    )
}
