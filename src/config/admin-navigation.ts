// @/config/admin-navigation.ts

import {
    HouseIcon,
    ShieldCheckIcon,
    Icon as PhosphorIcon,
    ConfettiIcon,
    CastleTurretIcon,
    SketchLogoIcon, MapTrifoldIcon, ShovelIcon
} from "@phosphor-icons/react"

type adminNavItem = {
    href?: string,
    icon: PhosphorIcon,
    label: string,
    sub_links?: {
        href: string,
        icon: PhosphorIcon,
        label: string,
    }[]
}

export const adminNavigationItems: adminNavItem[] = [
    { href: '/admin', icon: HouseIcon, label: 'Admin Dashboard' },
    { href: '/admin/guidelines', icon: ShieldCheckIcon, label: 'Guidelines' },
    { href: '/admin/events', icon: ConfettiIcon, label: 'Events' },
    { href: '/admin/quests', icon: SketchLogoIcon, label: 'Quests' },
    { href: '/admin/interactions', icon: ShovelIcon, label: 'Interactions' },
    { icon: CastleTurretIcon, label: 'Projects & Pins',
        sub_links: [
            {
                href: '/admin/projects',
                icon: CastleTurretIcon,
                label: 'Projects',
            },
            {
                href: '/admin/pins',
                icon: CastleTurretIcon,
                label: 'Pins',
            },
            {
                href: '/admin/projects/review',
                icon: CastleTurretIcon,
                label: 'Project Applications',
            }
        ]
    },
    { href: '/admin/map', icon: MapTrifoldIcon, label: 'Map Editor' },
]