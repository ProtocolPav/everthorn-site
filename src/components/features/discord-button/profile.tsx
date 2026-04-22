import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import {authClient} from "@/lib/auth-client.ts";
import {useEverthornMember} from "@/hooks/use-everthorn-member.ts";
import {CheckIcon, FingerprintIcon, HandHeartIcon} from "@phosphor-icons/react";
import {Tooltip, TooltipTrigger, TooltipContent} from "@/components/ui/tooltip.tsx";

export function DiscordProfile({user}: typeof authClient.$Infer.Session) {
    const {isMember, isCM, isPatron} = useEverthornMember()

    return (
        <div className="mb-4">
            {/* Top banner and profile picture */}
            <div
                className={cn(
                    "relative h-24 w-full rounded",
                    { "h-14": !user.banner }
                )}
                style={{ backgroundColor: user.banner_color as string }}
            >
                {user.banner ? (
                    <img
                        src={user.banner}
                        alt="Profile banner"
                        className="size-full rounded-xs object-cover"
                    />
                ) : undefined}

                {/* Profile picture with decoration */}
                <div className="absolute -bottom-11 left-0 size-22">
                    <img
                        src={user.image as string}
                        alt="User profile picture."
                        className="absolute left-1/2 top-1/2 size-16 -translate-x-1/2 -translate-y-1/2 rounded-full outline-4 outline-card"
                    />

                    {/* @ts-ignore */}
                    {user.decoration && user.decoration['expires_at'] < new Date().getTime() ? (
                        <img
                            src={user.decoration as string}
                            alt=""
                            className="absolute left-1/2 top-1/2 size-22 -translate-x-1/2 -translate-y-1/2"
                        />
                    ) : undefined}
                </div>
            </div>

            {/* Nickname and username */}
            <div className="mx-1 mt-8 grid">
                <p className="m-0 text-white text-lg font-semibold">
                    <b>{user.nick}</b>
                </p>
                <p className="flex items-center gap-2 m-0 text-muted-foreground text-xs">
                    @{user.username}

                    {/* Badges */}
                    <div className="flex gap-1">
                        {isMember && (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Badge variant="green" className="p-0.5">
                                        <CheckIcon className="size-3"/>
                                    </Badge>
                                </TooltipTrigger>

                                <TooltipContent side={'bottom'} className={'text-xs'}>
                                    Verified Everthorn Member
                                </TooltipContent>
                            </Tooltip>
                        )}

                        {isCM && (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Badge variant="indigo" className="p-0.5">
                                        <FingerprintIcon className="size-3"/>
                                    </Badge>
                                </TooltipTrigger>

                                <TooltipContent side={'bottom'} className={'text-xs'}>
                                    Community Manager
                                </TooltipContent>
                            </Tooltip>
                        )}

                        {isPatron && (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Badge variant="pink" className="p-0.5">
                                        <HandHeartIcon className="size-3"/>
                                    </Badge>
                                </TooltipTrigger>

                                <TooltipContent side={'bottom'} className={'text-xs'}>
                                    Everthorn Supporter
                                </TooltipContent>
                            </Tooltip>
                        )}
                    </div>
                </p>
            </div>
        </div>
    )
}
