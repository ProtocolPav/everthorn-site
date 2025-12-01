// @/config/navigation.ts

import {
    HouseIcon,
    MapTrifoldIcon,
    NewspaperClippingIcon,
    ShieldCheckIcon,
    Icon as PhosphorIcon,
    ConfettiIcon
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
        description: "The one-stop-shop for everything Everthorn.\n" +
            "View, edit or create new pages. Write to your heart's content!",
        sub_links: [
            {href: '/wiki', icon: NewspaperClippingIcon, label: 'Something else' },
        ]},
    { href: '/admin', icon: NewspaperClippingIcon, label: 'Admin', mobile_only: false, admin: true },
]