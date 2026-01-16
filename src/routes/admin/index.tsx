import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { HandWavingIcon } from '@phosphor-icons/react'
import {DottedPatternAreaChart} from "@/components/features/charts/area-chart.tsx";
import {useGuildPlaytime} from "@/hooks/use-guild-playtime.ts";
import {authClient} from "@/lib/auth-client.ts";

export const Route = createFileRoute('/admin/')({
    staticData: {
        pageTitle: "Admin Home"
    },
    component: RouteComponent,
})

function RouteComponent() {
    const {data: playtime} = useGuildPlaytime('1213827104945471538')
    const { data: session } = authClient.useSession();

    return (
        <div className="h-full flex flex-col gap-3 p-6">
            <Card className="w-full p-3 gap-2">
                <CardHeader className={"p-0 flex items-center gap-2 text-2xl font-bold"}>
                    <HandWavingIcon className="h-6 w-6 text-yellow-500" weight="fill" />
                    Hi, {session?.user.name}
                </CardHeader>

                <CardContent className={"p-0 flex items-center gap-2"}>
                    Welcome to the new and improved Admin Dashboard!
                </CardContent>
            </Card>

            <div className={'flex gap-2 w-full'}>
                <div className={'h-100 w-1/3 bg-card'}/>

                <div className={'flex flex-col gap-2 w-full'}>
                    <div className="grid md:flex w-full items-center gap-2">
                        <DottedPatternAreaChart className={'w-full'} chartData={playtime?.daily_playtime}/>
                        <DottedPatternAreaChart className={'w-full'} chartData={playtime?.daily_playtime}/>
                    </div>
                </div>
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
