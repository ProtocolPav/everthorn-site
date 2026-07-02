import {createFileRoute, Outlet, useMatches} from '@tanstack/react-router'
import {AdminSidebar} from "@/components/layout/admin-sidebar/sidebar.tsx";
import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar.tsx";
import {ScrollArea} from "@/components/ui/scroll-area.tsx";
import {NotFoundScreen} from "@/components/errors/not-found.tsx";
import {useEverthornMember} from "@/hooks/use-everthorn-member.ts";
import {AccessDeniedScreen} from "@/components/errors/access-denied.tsx";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.tsx";
import {AdminSidebarTrigger} from "@/components/layout/admin-sidebar/sidebar-trigger.tsx";

export const Route = createFileRoute('/admin')({
    component: AdminLayout,
    notFoundComponent: NotFoundScreen
})

function AdminLayout() {
    const matches = useMatches()
    const currentMatch = matches[matches.length - 1]
    const { pageTitle, headerActions } = currentMatch?.staticData ?? {}

    const { isCM, isLoading } = useEverthornMember();

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

                <ScrollArea className="flex-1 min-h-0">
                    <div className={'p-3'}>
                        <Alert variant={"info"}>
                            <AlertTitle>Work In Progress</AlertTitle>
                            <AlertDescription>
                                The Admin Panel is currently undergoing major rework.
                                Some features may not be available yet.
                                Please check back later for updates.
                            </AlertDescription>
                        </Alert>
                    </div>

                    <div className="h-full">
                        <Outlet />
                    </div>
                </ScrollArea>
            </SidebarInset>
        </SidebarProvider>
    )
}
