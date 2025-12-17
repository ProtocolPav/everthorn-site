// @/config/navigation.ts

import {
    HouseIcon,
    MapTrifoldIcon,
    NewspaperClippingIcon,
    ShieldCheckIcon,
    Icon as PhosphorIcon,
    ConfettiIcon, CastleTurretIcon, DiceFiveIcon, PlusSquareIcon, FingerprintIcon, SketchLogoIcon, DesktopTowerIcon
} from "@phosphor-icons/react"

type navItem = {
    href: string,
    icon: PhosphorIcon,
    label: string,
    mobile_only: boolean,
    admin: boolean,
    description?: string,
    sub_links?: {
        href: string,
        icon: PhosphorIcon,
        label: string,
        description?: string,
    }[]
}

export const navigationItems: navItem[] = [
    { href: '/', icon: HouseIcon, label: 'Home', mobile_only: true, admin: false },
    { href: '/guidelines', icon: ShieldCheckIcon, label: 'Guidelines', mobile_only: false, admin: false },
    { href: '/events', icon: ConfettiIcon, label: 'Events', mobile_only: false, admin: false },
    { href: '/map', icon: MapTrifoldIcon, label: 'World Map', mobile_only: false, admin: false },
    { href: '/wiki', icon: NewspaperClippingIcon, label: 'Wiki', mobile_only: false, admin: false,
        description: "The one-stop-shop for everything Everthorn. View, edit or create new pages. Write to your heart's content!",
        sub_links: [
            {
                href: '/wiki/projects',
                icon: CastleTurretIcon,
                label: 'Projects',
                description: "View all the Everthorn Projects"
            },
            {
                href: '/wiki/new',
                icon: PlusSquareIcon,
                label: 'Create',
                description: "Create a new wiki page"
            },
            {
                href: '/wiki/random',
                icon: DiceFiveIcon,
                label: 'Random Page',
                description: "Surprise yourself. See a random wiki page."
            },
        ]
    },
    { href: '/admin', icon: FingerprintIcon, label: 'Admin', mobile_only: false, admin: true,
        description: "Top-secret admin stuff. Only cool people enter here.",
        sub_links: [
            {
                href: '/admin/quests',
                icon: SketchLogoIcon,
                label: 'Quests',
                description: "View, Edit & Create Quests"
            },
            {
                href: '/admin/events',
                icon: ConfettiIcon,
                label: 'Events',
                description: "Manage Events Pages"
            },
            {
                href: '/admin/geode',
                icon: DesktopTowerIcon,
                label: 'Geode',
                description: "Manage our server via Geode's Control Panel"
            },
        ]
    },
]