import { ChevronsUpDown,  } from "lucide-react"

import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import logo from "/everthorn.png";

export function AdminHeader() {
    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                    <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                        <img src={logo} alt="Everthorn Logo" className="size-4" />
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-medium">Everthorn</span>
                        <span className="truncate text-xs">[Thingy]</span>
                    </div>
                    <ChevronsUpDown className="ml-auto" />
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
