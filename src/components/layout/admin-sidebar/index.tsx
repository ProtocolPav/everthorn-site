"use client"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader, SidebarMenuSkeleton,
    SidebarSeparator
} from "@/components/ui/sidebar"
import {PanelLogo} from "@/components/layout/admin-sidebar/header";
import {Exit} from "@/components/layout/admin-sidebar/footer";
import {NavGroup, NavItems} from "@/components/layout/admin-sidebar/nav-group";
import React from "react";
import {
    ChecksIcon,
    DesktopTowerIcon,
    HammerIcon,
    HouseIcon,
    TrophyIcon,
    BookIcon,
    LightningIcon,
    ClockIcon, RankingIcon
} from "@phosphor-icons/react";

export function AdminSidebar() {
    const server_items: NavItems[] = [
        {
            title: 'Admin Home',
            url: '/admin/',
            icon: HouseIcon,
        },
        {
            title: 'Quests',
            url: '/admin/quests',
            icon: TrophyIcon,
        },
        {
            title: 'Guidelines',
            url: '/admin/guidelines',
            icon: BookIcon,
        },
        {
            title: 'Projects & Pins',
            url: '/admin/projects',
            icon: HammerIcon,
        },
        {
            title: 'Interactions',
            url: '/admin/interactions',
            icon: LightningIcon,
        },
        // {
        //     title: 'Project Applications',
        //     url: '/admin/projects/applications',
        //     icon: ChecksIcon,
        // },
        {
            title: 'Server Control Panel',
            url: '/admin/control',
            icon: DesktopTowerIcon,
        },
    ]

    const wiki_items: NavItems[] = [
        {
            title: 'Pages',
            url: '/admin/wiki/pages',
        }
    ]

    const other_items: NavItems[] = [
        {
            title: 'Timestamps',
            url: '/admin/timestamps',
            icon: ClockIcon,
        },
        {
            title: 'Leaderboards',
            url: '/admin/leaderboard',
            icon: RankingIcon,
        }
    ]

    return (
        <Sidebar variant={'inset'} collapsible={'icon'}>
            <SidebarHeader>
                <PanelLogo />
            </SidebarHeader>
            <SidebarContent>
                <NavGroup title={'Server'} items={server_items}/>
                <NavGroup title={'Other'} items={other_items}/>
                {/*<NavGroup title={'Wiki Administration'} items={wiki_items}/>*/}
            </SidebarContent>
            <SidebarFooter>
                <Exit/>
            </SidebarFooter>
        </Sidebar>
    )
}
