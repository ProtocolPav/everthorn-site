// src/components/features/dashboard/recent-players-card.tsx
import { useEffect, useRef, useState } from 'react'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardAction,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SessionUserCard } from './session-user-card'
import { cn } from "@/lib/utils.ts"
import {CaretUpIcon, CaretDownIcon, UsersIcon} from '@phosphor-icons/react'
import {useListSessionsV1GuildsMeSessionsGet} from "@/api/nexuscore/guilds/guilds.ts";
import {Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle} from "@/components/ui/empty.tsx";

const ITEM_HEIGHT = 56 // px, height of a single SessionUserCard row + gap

interface RecentPlayersCardProps {
    className?: string
}

export function RecentPlayersCard({className}: RecentPlayersCardProps) {
    const { data, isPending, isError } = useListSessionsV1GuildsMeSessionsGet({}, {
        query: {
            refetchOnReconnect: true,
            refetchOnWindowFocus: true,
            refetchOnMount: true,
            staleTime: 1000
        }
    })

    const sessions = isPending || isError ? [] : data

    const containerRef = useRef<HTMLDivElement>(null)
    const [visibleCount, setVisibleCount] = useState(1)
    const [offset, setOffset] = useState(0)

    useEffect(() => {
        const el = containerRef.current
        if (!el) return

        const updateVisibleCount = () => {
            const count = Math.max(1, Math.floor(el.clientHeight / ITEM_HEIGHT))
            setVisibleCount(count)
        }

        updateVisibleCount()

        const observer = new ResizeObserver(updateVisibleCount)
        observer.observe(el)
        return () => observer.disconnect()
    }, [])

    const maxOffset = Math.max(0, sessions.length - visibleCount)
    const canScrollUp = offset > 0
    const canScrollDown = offset < maxOffset
    const hasOverflow = sessions.length > visibleCount

    const scrollUp = () => setOffset((o) => Math.max(0, o - 2))
    const scrollDown = () => setOffset((o) => Math.min(maxOffset, o + 2))

    const online_players = sessions.filter(s => s.end == null).length

    return (
        <Card className={cn("flex rounded-xl gap-2 p-2 border-0 overflow-hidden", className)}>
            <CardHeader className="p-0">
                <CardTitle className="text-base">Recent Players</CardTitle>
                <CardDescription>
                    {online_players} Player{online_players > 1 ? "s" : ""} Online
                </CardDescription>
                {hasOverflow && (
                    <CardAction className="flex gap-1">
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            disabled={!canScrollUp}
                            onClick={scrollUp}
                        >
                            <CaretUpIcon className="size-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            disabled={!canScrollDown}
                            onClick={scrollDown}
                        >
                            <CaretDownIcon className="size-4" />
                        </Button>
                    </CardAction>
                )}
            </CardHeader>

            <CardContent ref={containerRef} className="relative flex-1 overflow-hidden p-0">
                {sessions.length > 0 ? (
                    <>
                        <div
                            className="flex flex-col gap-2 transition-transform duration-300 ease-in-out"
                            style={{ transform: `translateY(-${offset * ITEM_HEIGHT}px)` }}
                        >
                            {sessions.map((session) => (
                                <div key={`${session.user.user_id}-${session.start}-${session.end}`} style={{ height: ITEM_HEIGHT }}>
                                    <SessionUserCard session={session} />
                                </div>
                            ))}
                        </div>

                        {canScrollUp && (
                            <div className="pointer-events-none absolute inset-x-0 top-0 h-8 bg-linear-to-b from-card to-transparent" />
                        )}
                        {canScrollDown && (
                            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-linear-to-t from-card to-transparent" />
                        )}
                    </>
                ) : (
                    <Empty className="h-full">
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <UsersIcon />
                            </EmptyMedia>
                            <EmptyTitle>No Recent Sessions</EmptyTitle>
                            <EmptyDescription>
                                No one has played recently. Check back later.
                            </EmptyDescription>
                        </EmptyHeader>
                    </Empty>
                )}
            </CardContent>
        </Card>
    )
}