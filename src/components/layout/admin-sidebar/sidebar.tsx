import * as React from "react"

import {Navigation} from "@/components/layout/admin-sidebar/navigation.tsx";
import {AdminHeader} from "@/components/layout/admin-sidebar/header.tsx";
import {AdminFooter} from "@/components/layout/admin-sidebar/footer.tsx";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
} from "@/components/ui/sidebar"

export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <AdminHeader />
            </SidebarHeader>
            <SidebarContent>
                <Navigation />
            </SidebarContent>
            <SidebarFooter>
                <AdminFooter />
            </SidebarFooter>
        </Sidebar>
    )
}
