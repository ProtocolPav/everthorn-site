import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import {SignOutIcon} from "@phosphor-icons/react";
import {Link} from "@tanstack/react-router";

export function AdminFooter() {
    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <Link to={'/'}>
                    <SidebarMenuButton
                        size="lg"
                        variant={'outline'}
                    >
                        <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
                            <SignOutIcon weight={'bold'} />
                        </div>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-medium">Let Me Out!</span>
                        </div>
                    </SidebarMenuButton>
                </Link>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
