import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { SessionOut } from '@/api/nexuscore/model'
import {PulseIcon, UserIcon} from '@phosphor-icons/react'
import { Skeleton } from '@/components/ui/skeleton.tsx'
import { formatPlaytime } from '@/lib/format.ts'
import {useEffect, useState} from "react";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip.tsx";
import {formatDistanceToNow} from "date-fns";

interface SessionUserCardProps {
    session: SessionOut
    className?: string
}

function formatDateTime(value: string) {
    return new Intl.DateTimeFormat('en-GB', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(value))
}

function formatHMS(totalSeconds: number) {
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = Math.floor(totalSeconds % 60)

    return [hours, minutes, seconds]
        .map((unit) => String(unit).padStart(2, '0'))
        .join(':')
}

export function useLiveDuration(start: string, isActive: boolean) {
    const [elapsed, setElapsed] = useState(() =>
        Math.floor((Date.now() - new Date(start).getTime()) / 1000)
    )

    useEffect(() => {
        if (!isActive) return

        const interval = setInterval(() => {
            setElapsed(Math.floor((Date.now() - new Date(start).getTime()) / 1000))
        }, 1000)

        return () => clearInterval(interval)
    }, [start, isActive])

    return formatHMS(elapsed)
}

export function SessionUserCard({ session, className }: SessionUserCardProps) {
    const user = session.user
    const isActive = !session.end

    const liveDuration = useLiveDuration(session.start, isActive)

    const avatarSrc = user?.xuid
        ? `https://persona-secondary.franchise.minecraft-services.net/api/v1.0/profile/xuid/${user.xuid}/image/head`
        : undefined

    return (
        <div
            className={cn(
                'group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors duration-200',
                isActive
                    ? 'bg-primary/[0.07] hover:bg-primary/11'
                    : 'bg-muted/40 hover:bg-muted/70',
                className
            )}
        >
            <div className="relative shrink-0">
                <Avatar className="size-10 rounded-lg ring-1 ring-inset ring-foreground/6">
                    <AvatarImage
                        src={avatarSrc}
                        alt={user?.whitelist ? `${user.whitelist} Minecraft avatar` : 'Minecraft Avatar'}
                        className="rounded-lg"
                    />
                    <AvatarFallback className="rounded-lg bg-secondary text-secondary-foreground">
                        <UserIcon className="size-4" />
                    </AvatarFallback>
                </Avatar>

                {isActive && (
                    <span className="absolute -bottom-0.5 -right-0.5 flex size-3">
                        <span className="absolute inline-flex size-full animate-ping rounded-full bg-green-500/60" />
                        <span className="relative inline-flex size-3 rounded-full bg-green-500 ring-2 ring-muted/40" />
                    </span>
                )}
            </div>

            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium leading-tight text-foreground">
                    {user?.whitelist ?? <Skeleton className="h-4 w-16" />}
                </p>

                <p className="truncate text-xs leading-tight text-muted-foreground">
                    {user?.username ? `@${user.username}` : 'Unknown player'}
                </p>
            </div>

            <Tooltip>
                <TooltipTrigger asChild>
                    <div className="shrink-0 text-right">
                        <div
                            className={cn(
                                'text-sm font-medium tabular-nums',
                                isActive ? 'text-primary' : 'text-foreground'
                            )}
                        >
                            {isActive ? liveDuration : formatPlaytime(session.duration, 'full')}
                        </div>
                        <div className="text-xs text-muted-foreground">
                            {isActive
                                ? 'Online'
                                : session.end
                                    ? formatDistanceToNow(new Date(session.end), { addSuffix: true })
                                    : '—'}
                        </div>
                    </div>
                </TooltipTrigger>

                <TooltipContent side="left" className="w-auto p-2.5">
                    {isActive ? (
                        <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-1.5">
                                <PulseIcon className="size-3 text-primary" weight="fill" />
                                <span className="text-xs font-medium text-primary">Online</span>
                            </div>

                            <div className="flex items-center justify-between gap-3">
                                <span className="text-xs text-muted-foreground">Started</span>
                                <span className="text-xs font-medium tabular-nums text-foreground">
                                  {formatDateTime(session.start)}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center justify-between gap-3">
                                <span className="text-xs text-muted-foreground">Started</span>
                                <span className="text-xs font-medium tabular-nums text-foreground">
                                  {formatDateTime(session.start)}
                                </span>
                            </div>

                            <div className="flex items-center justify-between gap-3">
                                <span className="text-xs text-muted-foreground">Ended</span>
                                <span className="text-xs font-medium tabular-nums text-foreground">
                                  {session.end ? formatDateTime(session.end) : '—'}
                                </span>
                            </div>

                            <div className="mt-1 flex items-center justify-between gap-3 border-t border-border/50 pt-1.5">
                                <span className="text-xs text-muted-foreground">Total</span>
                                <span className="text-xs font-semibold tabular-nums text-foreground">
                                  {session.duration !== undefined
                                      ? formatPlaytime(session.duration, 'full')
                                      : '—'}
                                </span>
                            </div>
                        </div>
                    )}
                </TooltipContent>
            </Tooltip>
        </div>
    )
}