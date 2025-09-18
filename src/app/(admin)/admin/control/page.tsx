"use client";

import { useState, useEffect } from "react";
import { usePageTitle } from "@/hooks/use-context";
import {
    FunnelIcon, ListBulletsIcon, MapTrifoldIcon,
    ArrowArcLeftIcon, ArrowArcRightIcon,
} from "@phosphor-icons/react";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Card} from "@/components/ui/card";
import { toast } from "sonner";
import {LazyLog, ScrollFollow} from "@melloware/react-logviewer";

export default function ControlPanelDashboard() {
    const { setTitle } = usePageTitle();
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        setTitle("Server Control Panel (BETA)");

        // Monitor connection status via EventSource
        const eventSource = new EventSource('/amethyst/controls/logs');

        eventSource.onopen = () => {
            setConnected(true);
        };

        eventSource.onerror = () => {
            setConnected(false);
        };

        return () => {
            eventSource.close();
        };
    }, [setTitle]);

    return (
        <div className={'grid gap-3 h-full'}>
            <Tabs defaultValue={'list'}>
                <div className={'flex justify-end items-center'}>
                    <TabsList>
                        <TabsTrigger value={'list'}><ListBulletsIcon/></TabsTrigger>
                        <TabsTrigger value={'map'}><MapTrifoldIcon/></TabsTrigger>
                    </TabsList>
                </div>

                <div className={`flex items-center gap-2 mr-4`}>
                    <div className={`w-2 h-2 rounded-full ${
                        connected ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                    <span className={`${connected ? 'text-green-600' : 'text-red-600'} font-semibold`}>
                            {connected ? 'Connected' : 'Disconnected'}
                        </span>
                </div>

                <TabsContent value={'list'}>
                    <Card className={'p-0 gap-0 h-full overflow-hidden'}>
                        <ScrollFollow
                            startFollowing={true}
                            render={({ follow, onScroll }) => (
                                <LazyLog
                                    lineClassName="whitespace-pre"
                                    iconFilterLines={<FunnelIcon weight={"fill"} size={20}/>}
                                    iconFindNext={<ArrowArcRightIcon weight={"fill"} size={20}/>}
                                    iconFindPrevious={<ArrowArcLeftIcon weight={"fill"} size={20}/>}
                                    enableLinks={true}
                                    enableSearch={true}
                                    enableSearchNavigation={true}
                                    selectableLines={true}
                                    enableLineNumbers={false}
                                    enableGutters={true}
                                    eventsource={true}
                                    eventsourceOptions={{
                                        reconnect: true
                                    }}
                                    url='/amethyst/controls/logs'
                                    follow={follow}
                                    onScroll={onScroll}
                                    wrapLines={true}
                                    overscanRowCount={200}
                                />
                            )}
                        />
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
