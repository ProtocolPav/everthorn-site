// src/routes/leaderboards.playtime.tsx
import { createFileRoute } from '@tanstack/react-router'
import {useGetPlaytimeLeaderboardV1GuildsMeLeaderboardPlaytimeMonthGet} from "@/api/nexuscore/leaderboards/leaderboards.ts";
import {LeaderboardTable} from "@/components/features/leaderboard/leaderboard-table.tsx";

export const Route = createFileRoute('/_main/leaderboards/playtime')({
    component: PlaytimeLeaderboardPage,
})

function PlaytimeLeaderboardPage() {
    const month = new Date().toISOString().slice(0, 7) + "-01" // "2026-07"

    const { data, isLoading } = useGetPlaytimeLeaderboardV1GuildsMeLeaderboardPlaytimeMonthGet(month)

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-2xl font-bold mb-6">Playtime Leaderboard</h1>
            <LeaderboardTable
                entries={data?.leaderboard ?? []}
                isLoading={isLoading}
            />
        </div>
    )
}