import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { HandWavingIcon } from '@phosphor-icons/react'
import {DailyPlaytimeAreaChart} from "@/components/features/charts/daily-area-chart.tsx";
import {authClient} from "@/lib/auth-client.ts";
//import WorldMap from "@/components/features/map/world-map.tsx";
import {MonthlyPlaytimeBarChart} from "@/components/features/charts/monthly-bar-chart.tsx";
import {WeeklyPlaytimeAreaChart} from "@/components/features/charts/weekly-area-chart.tsx";
import ServerOverview from "@/components/features/geode-panel/server-overview.tsx";
import {useGetGuildPlaytimeV1GuildsMePlaytimeGet} from "@/api/nexuscore/guilds/guilds.ts";

export const Route = createFileRoute('/admin/')({
    staticData: {
        pageTitle: "Admin Home"
    },
    component: RouteComponent,
})

function RouteComponent() {
    const {data: playtime} = useGetGuildPlaytimeV1GuildsMePlaytimeGet();
    const { data: session } = authClient.useSession();

    return (
        <div className="h-full flex flex-col gap-2 p-6">
            <Card className="w-full p-3 gap-2">
                <CardHeader className={"p-0 flex items-center gap-2 text-2xl font-bold"}>
                    <HandWavingIcon className="h-6 w-6 text-yellow-500" weight="fill" />
                    Hi, {session?.user.name}
                </CardHeader>

                <CardContent className={"p-0 flex items-center gap-2"}>
                    Welcome to the new and improved Dashboard Home page! It's currently still a WIP, but getting better!
                </CardContent>
            </Card>

            <div className={'flex gap-2 w-full'}>
                <div className={'hidden md:grid h-100 w-1/3 bg-card rounded-xl gap-2 p-2 overflow-y-scroll'}>
                    Recent Players
                    <div className={'bg-zinc-900/50 h-15 w-full rounded-lg'}/>
                    <div className={'bg-zinc-900/50 h-15 w-full rounded-lg'}/>
                    <div className={'bg-zinc-900/50 h-15 w-full rounded-lg'}/>
                    <div className={'bg-zinc-900/50 h-15 w-full rounded-lg'}/>
                    <div className={'bg-zinc-900/50 h-15 w-full rounded-lg'}/>
                    <div className={'bg-zinc-900/50 h-15 w-full rounded-lg'}/>
                </div>

                <div className={'flex flex-col gap-2 w-full'}>
                    <div className="grid md:flex w-full items-center gap-2">
                        <DailyPlaytimeAreaChart className={'w-full'} chartData={playtime}/>
                        <MonthlyPlaytimeBarChart className={'w-full'} chartData={playtime}/>
                    </div>

                    <ServerOverview viewMore={true}/>
                </div>
            </div>

            <div className={'grid md:flex gap-2 w-full'}>
                {/*<div className={'w-full h-90 rounded-xl bg-card p-2'}>*/}
                {/*    <div className={'rounded-lg overflow-hidden size-full border'}>*/}
                {/*        <WorldMap />*/}
                {/*    </div>*/}
                {/*</div>*/}

                <WeeklyPlaytimeAreaChart className={'w-full'} chartData={playtime}/>
            </div>

            {/*
            Upcoming Quests, Events. List of recently active players (with current ones on top).
            Cards with recently active projects (like ppl who built there, maybe thats too hard)
            Mini world map
            Small graphs for monthly playtime, weekly and daily.
            Each card has a link to view more, going to it's dashboard page.
            */}
        </div>
    )
}
