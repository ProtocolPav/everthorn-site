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
import { PatreonLogoIcon, YoutubeLogoIcon } from "@phosphor-icons/react"
import logo from '/everthorn.png'
import {ModeToggle} from "@/components/features/theme-toggle.tsx";

export default function SiteHeader() {
    return (
        <header className="sticky top-0 z-40 w-full border-b bg-background/50 backdrop-blur-sm">
            <div className="mx-5 flex h-[var(--navbar-height)] items-center gap-6 sm:justify-between md:mx-10">
                {/* Logo */}
                <Link to="/" className="flex items-center">
                    <img src={logo} alt="Everthorn Logo" className="size-9" />
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
                    <ModeToggle />
                </div>
            </div>
        </header>
    )
}

function SocialLinks() {
    const socialLinks = [
        {
            to: '/support',
            icon: PatreonLogoIcon,
            tooltip: 'Support Everthorn on Patreon',
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
            {socialLinks.map(({ to, icon: Icon, tooltip, alignOffset }) => (
                <Tooltip key={to}>
                    <TooltipTrigger asChild>
                        <Button asChild size="icon" variant="ghost">
                            <Link to={to} target="_blank" rel="noreferrer">
                                <Icon weight="fill" className="size-5" />
                            </Link>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent align="end" alignOffset={alignOffset}>
                        <p>{tooltip}</p>
                    </TooltipContent>
                </Tooltip>
            ))}
        </TooltipProvider>
    )
}
