import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar
} from "@/components/ui/sidebar"
import logo from "/everthorn.png";
import {ArrowLineLeftIcon} from "@phosphor-icons/react";

export function AdminHeader() {
    const { toggleSidebar } = useSidebar()

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                    onClick={toggleSidebar}
                >
                    <div className="text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                        <img src={logo} alt="Everthorn Logo" className="size-6" />
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-medium">Everthorn</span>
                        <span className="truncate text-xs">Admin Dashboard</span>
                    </div>

                    <ArrowLineLeftIcon className={'mr-1'} weight={'bold'} />
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
