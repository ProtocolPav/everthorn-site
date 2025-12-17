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
import {Link} from "@tanstack/react-router";
import {useState} from "react";
import {adminNavigationItems} from "@/config/admin-navigation.ts";

export function Navigation() {
    const [activeIndex, setActiveIndex] = useState(0)

    return (
        <SidebarGroup>
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {adminNavigationItems.map((item, index) => (
                    <Collapsible
                        key={item.label}
                        asChild
                        open={index === activeIndex && item.sub_links && item.sub_links?.length > 0}
                        className="group/collapsible"
                    >
                        <SidebarMenuItem>
                            <CollapsibleTrigger asChild>
                                <Link to={item.href}>
                                    <SidebarMenuButton
                                        onClick={() => setActiveIndex(index)}
                                        data-active={index === activeIndex}
                                        tooltip={item.label}
                                    >
                                        {item.icon && <item.icon />}
                                        <span>{item.label}</span>
                                    </SidebarMenuButton>
                                </Link>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <SidebarMenuSub>
                                    {item.sub_links?.map((subItem) => (
                                        <SidebarMenuSubItem key={subItem.label}>
                                            <SidebarMenuSubButton asChild>
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
                ))}
            </SidebarMenu>
        </SidebarGroup>
    )
}
