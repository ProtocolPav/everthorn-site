// components/layout/header/mobile.tsx
import * as React from "react"
import { Link, useNavigate } from "@tanstack/react-router"
import { navigationItems } from "@/config/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { DiscordButton } from "@/components/features/discord-button/discord.tsx"
import {
    PatreonLogoIcon,
    YoutubeLogoIcon,
    UserPlusIcon
} from "@phosphor-icons/react"
import {useEverthornMember} from "@/hooks/use-everthorn-member.ts";

export function Mobile() {
    const { isCM, isMember } = useEverthornMember()
    const [isOpen, setIsOpen] = React.useState(false)
    const navigate = useNavigate()

    React.useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : 'unset'
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    const handleNavigation = (href: string) => {
        navigate({ to: href })
        setIsOpen(false)
    }

    // Filter items into groups
    const regularItems = navigationItems.filter(item => !item.admin)
    const adminItems = navigationItems.filter(item => item.admin)

    // Reusable render function for recursive lists (Supports Sub-links)
    const renderNavList = (items: typeof navigationItems) => {
        return (
            <div className="flex flex-col gap-3">
                {items.map((item) => {
                    const Icon = item.icon
                    return (
                        <div key={item.href} className="flex flex-col gap-3">
                            {/* Main Link */}
                            <button
                                onClick={() => handleNavigation(item.href)}
                                className="flex items-center gap-3 text-left text-2xl font-medium transition-colors focus:outline-none active:opacity-70"
                            >
                                <Icon className="size-7" weight="fill" />
                                {item.label}
                            </button>

                            {/* Subsections */}
                            {item.sub_links && item.sub_links.length > 0 && (
                                <div className="flex flex-col gap-3 pl-4 border-l-2 border-white/10 ml-3.5">
                                    {item.sub_links.map((sub) => {
                                        const SubIcon = sub.icon
                                        return (
                                            <button
                                                key={sub.href}
                                                onClick={() => handleNavigation(sub.href)}
                                                className="flex items-center gap-3 text-left text-xl font-medium text-muted-foreground transition-colors hover:text-foreground focus:outline-none active:opacity-70"
                                            >
                                                <SubIcon className="size-6" weight="fill" />
                                                {sub.label}
                                            </button>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        )
    }

    return (
        <div className="flex flex-1 items-center justify-end space-x-3 md:hidden">
            <div className="flex">
                <DiscordButton />
            </div>

            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <Button
                        size="icon-sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 active:bg-transparent"
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
                    className="no-scrollbar h-(--radix-popper-available-height) w-(--radix-popper-available-width) overflow-y-auto rounded-none border-none bg-background/50 p-0 shadow-none backdrop-blur-md duration-200"
                    align="end"
                    side="bottom"
                    alignOffset={-16}
                    sideOffset={8}
                >
                    <div className="flex flex-col gap-8 px-6 py-8">
                        {/* Apply to Join CTA - Only for non-authenticated users */}
                        {!isMember && (
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
                                        style={{
                                            textShadow: '0 0 10px rgba(59, 130, 246, 0.6), 0 0 20px rgba(59, 130, 246, 0.3)',
                                        }}
                                    >
                                        Apply to Join
                                    </span>
                                </button>
                            </div>
                        )}

                        {/* Navigation (Dynamic) */}
                        <nav className="flex flex-col gap-4">
                            <h2 className="text-sm font-medium text-muted-foreground">
                                Navigation
                            </h2>
                            {renderNavList(regularItems)}
                        </nav>

                        {/* Management (Dynamic & Guarded) */}
                        {isCM && adminItems.length > 0 && (
                            <div className="flex flex-col gap-4">
                                <h2 className="text-sm font-medium text-muted-foreground">
                                    Management
                                </h2>
                                {renderNavList(adminItems)}
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
                                    to="/youtube"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-3 text-2xl font-medium transition-colors focus:outline-none active:opacity-70"
                                >
                                    <YoutubeLogoIcon className="size-7" weight="fill" />
                                    YouTube
                                </Link>

                                <Link
                                    to="/support"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-3 rounded-lg text-2xl font-medium focus:outline-none active:opacity-90"
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
