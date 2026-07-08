import { createFileRoute, Outlet, useMatches } from '@tanstack/react-router'
import { useState } from 'react'
import { AdminSidebar } from "@/components/layout/admin-sidebar/sidebar.tsx";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar.tsx";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import { NotFoundScreen } from "@/components/errors/not-found.tsx";
import { useEverthornMember } from "@/hooks/use-everthorn-member.ts";
import { AccessDeniedScreen } from "@/components/errors/access-denied.tsx";
import { AdminSidebarTrigger } from "@/components/layout/admin-sidebar/sidebar-trigger.tsx";
import {Banner} from "@/components/common/banner.tsx";

export const Route = createFileRoute('/admin')({
    component: AdminLayout,
    notFoundComponent: NotFoundScreen
})

const WIP_BANNER_KEY = 'admin-wip-banner-dismissed'

function AdminLayout() {
    const matches = useMatches()
    const currentMatch = matches[matches.length - 1]
    const { pageTitle, headerActions } = currentMatch?.staticData ?? {}

    const { isCM, isLoading } = useEverthornMember();

    const [showBanner, setShowBanner] = useState(
        () => sessionStorage.getItem(WIP_BANNER_KEY) !== 'true',
    )

    const dismissBanner = () => {
        sessionStorage.setItem(WIP_BANNER_KEY, 'true')
        setShowBanner(false)
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-dvh bg-background">
                <span className="animate-pulse">Loading admin access...</span>
            </div>
        );
    }

    if (!isCM) {
        return <AccessDeniedScreen/>
    }

    return (
        <SidebarProvider>
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

                {showBanner && (
                    <Banner variant="warning" onDismiss={dismissBanner}>
                        The Admin Panel is undergoing major rework. Some features may be unavailable or broken.
                    </Banner>
                )}

                <ScrollArea className="flex-1 min-h-0">
                    <div className="h-full">
                        <Outlet />
                    </div>
                </ScrollArea>
            </SidebarInset>
        </SidebarProvider>
    )
}

export default AdminLayout