import {createFileRoute, Outlet} from '@tanstack/react-router'
import {AdminSidebar} from "@/components/layout/admin-sidebar/sidebar.tsx";
import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar.tsx";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb.tsx";
import {AdminSidebarTrigger} from "@/components/layout/admin-sidebar/sidebar-trigger.tsx";
import {createServerFn} from "@tanstack/react-start";
import {getCookies} from "@tanstack/start-server-core";

export const Route = createFileRoute('/admin')({
    loader: async () => {
        const defaultOpen = await getSidebarState()
        return {defaultOpen}
    },
    component: AdminLayout,
})

const getSidebarState = createServerFn({method: 'GET'}).handler(async () => {
    const cookies = getCookies()
    return cookies.sidebar_state === 'true'
})

function AdminLayout() {
    const {defaultOpen} = Route.useLoaderData()

    return (
        <SidebarProvider defaultOpen={defaultOpen}>
            <AdminSidebar/>
            <SidebarInset>
                <header className="sticky top-0 border-b bg-background/50 backdrop-blur-sm flex h-14 shrink-0 items-center gap-2 transition-[width,height] ease-linear">
                    <div className="flex items-center gap-2 px-4">
                        <AdminSidebarTrigger/>
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink href="#">
                                        Building Your Application
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block"/>
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>

                <Outlet/>
            </SidebarInset>
        </SidebarProvider>
    )
}
