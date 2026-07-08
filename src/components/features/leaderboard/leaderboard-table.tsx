// src/components/features/leaderboard/leaderboard-table.tsx
import { useMemo } from 'react'
import { cn } from '@/lib/utils'
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import {TrophyIcon, UserIcon} from '@phosphor-icons/react'
import { LeaderboardEntry } from "@/api/nexuscore/model"
import { useQueries } from "@tanstack/react-query"
import {
    getGetUserV1GuildsMeUsersThornyIdGetQueryOptions,
} from "@/api/nexuscore/users/users.ts";
import { formatPlaytime } from "@/lib/format.ts";

const RANK_STYLES: Record<1 | 2 | 3, string> = {
    1: 'text-amber-400',
    2: 'text-slate-300',
    3: 'text-amber-700',
}

function RankIndicator({ rank }: { rank: number }) {
    if (rank <= 3) {
        return (
            <div className={cn('flex items-center gap-1 font-bold', RANK_STYLES[rank as 1 | 2 | 3])}>
                <TrophyIcon weight="fill" className="size-5" />
                <span>{rank}</span>
            </div>
        )
    }
    return <span className="text-muted-foreground font-medium tabular-nums">{rank}</span>
}

interface LeaderboardTableProps {
    entries: LeaderboardEntry[]
    isLoading?: boolean
}

export function LeaderboardTable({ entries, isLoading: leaderboardLoading }: LeaderboardTableProps) {
    const { users, isLoading: usersLoading } = useQueries({
        queries: entries.map((entry) =>
            getGetUserV1GuildsMeUsersThornyIdGetQueryOptions(entry.thorny_id, {
                query: {
                    staleTime: 60_000,
                    enabled: !!entry.thorny_id,
                },
            }),
        ),
        combine: (results) => ({
            users: results.map((r) => r.data),
            isLoading: results.some((r) => r.isLoading),
        }),
    })

    const rows = useMemo(
        () => entries.map((entry, i) => ({ ...entry, rank: i + 1, user: users[i] })),
        [entries, users],
    )

    if (leaderboardLoading) {
        return <Skeleton className="h-96 w-full" />
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-16">Rank</TableHead>
                    <TableHead>Player</TableHead>
                    <TableHead className="text-right">Playtime</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {rows.map((row) => {
                    const isPatron = row.user?.patron

                    return (
                        <TableRow key={row.thorny_id}>
                            <TableCell>
                                <RankIndicator rank={row.rank} />
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <Avatar
                                        className={cn(
                                            'size-8 rounded-md ring-1 ring-inset ring-foreground/6',
                                        )}
                                    >
                                        <AvatarImage
                                            src={row.user?.xuid
                                                ? `https://persona-secondary.franchise.minecraft-services.net/api/v1.0/profile/xuid/${row.user.xuid}/image/head`
                                                : undefined}
                                            alt={row.user?.whitelist ? `${row.user.whitelist} Minecraft avatar` : 'Minecraft Avatar'}
                                        />
                                        <AvatarFallback className="rounded-md bg-secondary text-secondary-foreground">
                                            <UserIcon className="size-4" />
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex items-center gap-2">
                                        {usersLoading && !row.user ? (
                                            <Skeleton className="h-4 w-24" />
                                        ) : (
                                            <span className={cn('font-medium', isPatron && 'text-pink-500')}>
                                                {row.user?.username ?? row.thorny_id}
                                            </span>
                                        )}
                                        {isPatron && (
                                            <img
                                                src={'https://cdn.everthorn.net/img/kofi_symbol.svg'}
                                                alt={'Donator Symbol'}
                                                className={'size-5'}
                                            />
                                        )}
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell className="text-right tabular-nums">
                                {formatPlaytime(row.value)}
                            </TableCell>
                        </TableRow>
                    )
                })}
            </TableBody>
        </Table>
    )
}