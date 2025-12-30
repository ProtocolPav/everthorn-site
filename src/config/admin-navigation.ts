// @/config/admin-navigation.ts

import {
    HouseIcon,
    ShieldCheckIcon,
    Icon as PhosphorIcon,
    ConfettiIcon,
    CastleTurretIcon,
    SketchLogoIcon
} from "@phosphor-icons/react"

type adminNavItem = {
    href: string,
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
    { href: '/admin/projects', icon: CastleTurretIcon, label: 'Projects',
        sub_links: [
            {
                href: '/admin/map',
                icon: CastleTurretIcon,
                label: 'Map Editor',
            }
        ]
    }
]