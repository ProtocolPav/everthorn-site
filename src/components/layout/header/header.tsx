import { Link } from "@tanstack/react-router"
import { Desktop } from "./desktop"
import { Mobile } from "./mobile"
import { Button } from "@/components/ui/button"
import { DiscordButton } from "@/components/features/discord-button/discord.tsx"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { YoutubeLogoIcon } from "@phosphor-icons/react"
//import {ModeToggle} from "@/components/features/theme-toggle.tsx";

export default function SiteHeader() {
    return (
        <header className="sticky top-0 z-40 w-full border-b bg-background/50 backdrop-blur-sm">
            <div className="mx-5 flex h-(--navbar-height) items-center gap-6 sm:justify-between md:mx-10">
                {/* Logo */}
                <Link to="/" className="flex items-center">
                    <img
                        src={"https://cdn.everthorn.net/img/everthorn-logo-2026.png"}
                        alt="Everthorn Logo"
                        className="size-9"
                    />
                </Link>

                {/* Navigation Modules */}
                <Desktop />
                <Mobile />

                {/* Desktop Social & Extra Actions */}
                <div className="hidden flex-1 items-center justify-end gap-3 md:flex">
                    <div className="w-fit">
                        <DiscordButton />
                    </div>
                    <SocialLinks />
                    {/*<ModeToggle />*/}
                </div>
            </div>
        </header>
    )
}

function SocialLinks() {
    const socialLinks = [
        {
            to: '/support',
            iconUrl: 'kofi_symbol.svg',
            tooltip: 'Support Everthorn on Ko-Fi',
            alignOffset: -40,
        },
        {
            to: '/youtube',
            icon: YoutubeLogoIcon,
            tooltip: 'Everthorn Youtube Channel',
            alignOffset: 4,
        },
    ]

    return (
        <TooltipProvider delayDuration={300}>
            {socialLinks.map(({ to, icon: Icon, iconUrl, tooltip, alignOffset }) => (
                <Tooltip key={to}>
                    <TooltipTrigger asChild>
                        <Button asChild size="icon" variant="ghost">
                            <Link to={to} target="_blank" rel="noreferrer">
                                {Icon ?
                                    <Icon weight="fill"/> :
                                    <img src={iconUrl} alt="Kofi Logo" className="m-auto size-5" />
                                }
                            </Link>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent align="end" alignOffset={alignOffset}>
                        <div>{tooltip}</div>
                    </TooltipContent>
                </Tooltip>
            ))}
        </TooltipProvider>
    )
}
