// components/layout/header/social-buttons.tsx
"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { DiscordButton } from "@/components/discord/discord-button"
import { PatreonLogoIcon, YoutubeLogoIcon } from "@phosphor-icons/react"

const socialLinks = [
    {
        href: '/support',
        icon: PatreonLogoIcon,
        tooltip: 'Support Everthorn on Patreon',
        alignOffset: -40,
    },
    {
        href: '/youtube',
        icon: YoutubeLogoIcon,
        tooltip: 'Everthorn Youtube Channel',
        alignOffset: 4,
    },
]

export function SocialButtons() {
    return (
        <nav className="flex items-center gap-3">
            <DiscordButton />

            <div className={'flex gap-0'}>
                <TooltipProvider delayDuration={300}>
                    {socialLinks.map(({ href, icon: Icon, tooltip, alignOffset }) => (
                        <Tooltip key={href}>
                            <TooltipTrigger asChild>
                                <Button asChild size="icon" variant="ghost">
                                    <Link href={href} target="_blank" rel="noreferrer">
                                        <Icon weight="fill" />
                                    </Link>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent align="end" alignOffset={alignOffset}>
                                <p className="mx-auto my-0 text-center text-sm">{tooltip}</p>
                            </TooltipContent>
                        </Tooltip>
                    ))}
                </TooltipProvider>
            </div>
        </nav>
    )
}
