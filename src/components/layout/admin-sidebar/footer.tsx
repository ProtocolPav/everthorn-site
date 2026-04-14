import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar
} from "@/components/ui/sidebar"
import {SignOutIcon} from "@phosphor-icons/react";
import {Link} from "@tanstack/react-router";
import {DiscordButton} from "@/components/features/discord-button/discord.tsx";
import {useEverthornMember} from "@/hooks/use-everthorn-member.ts";

export function AdminFooter() {
    const { state } = useSidebar()
    const everthornMember = useEverthornMember()

    if (state === "collapsed") {
        return (
            <SidebarMenu>
                <SidebarMenuItem>
                    <Link to={'/'}>
                        <SidebarMenuButton
                            size="lg"
                            variant={'default'}
                        >
                            <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
                                <SignOutIcon weight={'bold'} />
                            </div>
                        </SidebarMenuButton>
                    </Link>
                </SidebarMenuItem>
            </SidebarMenu>
        )
    }

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <Link to={'/'}>
                    <SidebarMenuButton
                        size="lg"
                        variant={'default'}
                    >
                        <DiscordButton />
                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-medium">{everthornMember.thornyUser?.username}</span>
                            <span className="truncate text-xs text-muted-foreground">{everthornMember.thornyUser?.role || 'No Role'}</span>
                        </div>
                        <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
                            <SignOutIcon weight={'bold'} />
                        </div>
                    </SidebarMenuButton>
                </Link>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
