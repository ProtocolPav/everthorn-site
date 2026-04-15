import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { Link, useRouterState } from "@tanstack/react-router";
import { adminNavigationItems } from "@/config/admin-navigation.ts";
import { ChevronRight } from "lucide-react";

export function Navigation() {
    const pathname = useRouterState({ select: (s) => s.location.pathname });

    return (
        <SidebarGroup>
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {adminNavigationItems.map((item) => {
                    const hasSubLinks = item.sub_links && item.sub_links.length > 0;

                    if (!hasSubLinks) {
                        return (
                            <SidebarMenuItem key={item.label}>
                                <SidebarMenuButton
                                    tooltip={item.label}
                                    asChild
                                    isActive={pathname === item.href}
                                >
                                    <Link to={item.href}>
                                        {item.icon && <item.icon />}
                                        <span>{item.label}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        );
                    }

                    return (
                        <Collapsible
                            key={item.label}
                            asChild
                            defaultOpen={item.sub_links?.some((sub) => pathname === sub.href)}
                            className="group/collapsible"
                        >
                            <SidebarMenuItem>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton tooltip={item.label}>
                                        {item.icon && <item.icon />}
                                        <span>{item.label}</span>
                                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <SidebarMenuSub>
                                        {item.sub_links?.map((subItem) => (
                                            <SidebarMenuSubItem key={subItem.label}>
                                                <SidebarMenuSubButton
                                                    asChild
                                                    isActive={pathname === subItem.href}
                                                >
                                                    <Link to={subItem.href}>
                                                        <span>{subItem.label}</span>
                                                    </Link>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        ))}
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            </SidebarMenuItem>
                        </Collapsible>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}