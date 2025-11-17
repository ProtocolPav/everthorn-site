// components/layout/header/mobile.tsx
"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { DiscordButton } from "@/components/layout/discord/discord-button"
import {
    HouseIcon,
    IdentificationBadgeIcon,
    NewspaperClippingIcon,
    PatreonLogoIcon,
    ShieldCheckIcon,
    YoutubeLogoIcon,
    MapTrifoldIcon,
    DesktopIcon,
    ConfettiIcon,
    UserPlusIcon
} from "@phosphor-icons/react"

const navigationItems = [
    { href: '/', icon: HouseIcon, label: 'Home' },
    { href: '/guidelines', icon: ShieldCheckIcon, label: 'Guidelines' },
    // { href: '/events', icon: ConfettiIcon, label: 'Events' },
    { href: '/map', icon: MapTrifoldIcon, label: 'World Map' },
    { href: '/wiki', icon: NewspaperClippingIcon, label: 'Wiki' }
]

export function Mobile() {
    const { data: session, status } = useSession()
    const isCM = status === 'authenticated' && session?.user?.everthornMemberInfo.isCM
    const isAuthenticated = status === 'authenticated'
    const [isOpen, setIsOpen] = React.useState(false)
    const router = useRouter()

    React.useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : 'unset'
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    const handleNavigation = (href: string) => {
        router.push(href)
        setIsOpen(false)
    }

    return (
        <div className="flex flex-1 items-center justify-end space-x-3 md:hidden">
            <div className="flex">
                <DiscordButton />
            </div>

            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="ghost"
                        className="h-8 gap-2.5 !p-0 hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 active:bg-transparent"
                    >
                        <div className="relative flex h-8 w-4 items-center justify-center">
                            <div className="relative size-4">
                                <span
                                    className={cn(
                                        "absolute left-0 block h-0.5 w-4 bg-foreground transition-all duration-200",
                                        isOpen ? "top-[0.4rem] rotate-45" : "top-1"
                                    )}
                                />
                                <span
                                    className={cn(
                                        "absolute left-0 block h-0.5 w-4 bg-foreground transition-all duration-200",
                                        isOpen ? "top-[0.4rem] -rotate-45" : "top-2.5"
                                    )}
                                />
                            </div>
                            <span className="sr-only">Toggle Menu</span>
                        </div>
                    </Button>
                </PopoverTrigger>

                <PopoverContent
                    className="no-scrollbar h-(--radix-popper-available-height) w-(--radix-popper-available-width) overflow-y-auto rounded-none border-none bg-background/90 p-0 shadow-none backdrop-blur-xl duration-200"
                    align="start"
                    side="bottom"
                    alignOffset={-16}
                    sideOffset={14}
                >
                    <div className="flex flex-col gap-8 px-6 py-8">
                        {/* Apply to Join CTA - Only for non-authenticated users */}
                        {!isAuthenticated && (
                            <div className="flex flex-col gap-4">
                                <h2 className="text-sm font-medium text-muted-foreground">
                                    Get Started
                                </h2>
                                <button
                                    onClick={() => handleNavigation('/apply')}
                                    className="flex items-center gap-3 rounded-lg border border-blue-500/20 bg-blue-950/10 px-4 py-3 text-2xl font-medium backdrop-blur-sm transition-all focus:outline-none active:opacity-90"
                                >
                                    <UserPlusIcon className="size-7" weight="fill" />
                                    <span
                                        className="animate-glow-text-blue"
                                        style={{
                                            textShadow: '0 0 10px rgba(59, 130, 246, 0.6), 0 0 20px rgba(59, 130, 246, 0.3)',
                                        }}
                                    >
                                        Apply to Join
                                    </span>
                                </button>
                            </div>
                        )}


                        {/* Navigation */}
                        <nav className="flex flex-col gap-4">
                            <h2 className="text-sm font-medium text-muted-foreground">
                                Navigation
                            </h2>
                            <div className="flex flex-col gap-3">
                                {navigationItems.map(({ href, icon: Icon, label }) => (
                                    <button
                                        key={href}
                                        onClick={() => handleNavigation(href)}
                                        className="flex items-center gap-3 text-left text-2xl font-medium transition-colors focus:outline-none active:opacity-70"
                                    >
                                        <Icon className="size-7" weight="fill" />
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </nav>

                        {/* Admin */}
                        {isCM && (
                            <div className="flex flex-col gap-4">
                                <h2 className="text-sm font-medium text-muted-foreground">
                                    Management
                                </h2>
                                <button
                                    onClick={() => handleNavigation('/admin')}
                                    className="flex items-center gap-3 text-left text-2xl font-medium transition-colors focus:outline-none active:opacity-70"
                                >
                                    <IdentificationBadgeIcon className="size-7" weight="fill" />
                                    Admin
                                </button>

                                <button
                                    onClick={() => handleNavigation('/admin/control')}
                                    className="flex items-center gap-3 text-left text-2xl font-medium transition-colors focus:outline-none active:opacity-70"
                                >
                                    <DesktopIcon className="size-7" weight="fill" />
                                    Server Control Panel
                                </button>
                            </div>
                        )}

                        <Separator />

                        {/* Social */}
                        <div className="flex flex-col gap-4">
                            <h2 className="text-sm font-medium text-muted-foreground">
                                Connect
                            </h2>
                            <div className="flex flex-col gap-3">
                                <Link
                                    href="/youtube"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-3 text-2xl font-medium transition-colors focus:outline-none active:opacity-70"
                                >
                                    <YoutubeLogoIcon className="size-7" weight="fill" />
                                    YouTube
                                </Link>

                                <Link
                                    href="/support"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-3 rounded-lg text-2xl font-medium backdrop-blur-sm focus:outline-none active:opacity-90"
                                >
                                    <PatreonLogoIcon className="size-7" weight="fill" />
                                    <span
                                        className="animate-glow-text"
                                        style={{
                                            textShadow: '0 0 10px rgba(249, 115, 22, 0.8), 0 0 20px rgba(249, 115, 22, 0.5), 0 0 30px rgba(249, 115, 22, 0.3)',
                                        }}
                                    >
                                        Feed Thorny
                                    </span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    )
}
