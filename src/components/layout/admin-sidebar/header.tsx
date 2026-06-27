import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar
} from "@/components/ui/sidebar"
import logo from "/everthorn.png";
import {SquareHalfIcon} from "@phosphor-icons/react";

export function AdminHeader() {
    const { toggleSidebar } = useSidebar()

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton
                    size="lg"
                    onClick={toggleSidebar}
                    className={'group/header'}
                >
                    <div className="text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                        {/* Show logo when expanded, or when collapsed but NOT hovered */}
                        <img
                            src={logo}
                            alt="Everthorn Logo"
                            className="size-6 group-data-[state=collapsed]:group-hover/header:hidden"
                        />
                        {/* Show icon only when collapsed AND hovered */}
                        <SquareHalfIcon
                            weight="bold"
                            className="size-4 hidden group-data-[state=collapsed]:group-hover/header:block"
                        />
                    </div>

                    <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-medium">Everthorn</span>
                        <span className="truncate text-xs">Admin Dashboard</span>
                    </div>

                    <SquareHalfIcon className={'mr-1'} weight={'bold'} />
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
