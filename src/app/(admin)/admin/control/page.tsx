"use client";

import { useState, useEffect } from "react";
import { usePageTitle } from "@/hooks/use-context";
import {
    FunnelIcon, ListBulletsIcon, MapTrifoldIcon,
    ArrowArcLeftIcon, ArrowArcRightIcon,
} from "@phosphor-icons/react";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Card} from "@/components/ui/card";
import {LazyLog, ScrollFollow} from "@melloware/react-logviewer";
import ServerOverview from "@/components/features/control_panel/server_overview";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {LucideSendHorizonal} from "lucide-react";
import {CommandBar} from "@/components/features/control_panel/command_bar";
import {toast} from "sonner";
import LogViewerCard from "@/components/features/control_panel/log_viewer";

export default function ControlPanelDashboard() {
    const { setTitle } = usePageTitle();
    const [connected, setConnected] = useState(false);
    const [command, setCommand] = useState("");

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

                <TabsContent value={'list'} className={'flex flex-col gap-2'}>
                    <ServerOverview/>

                    <LogViewerCard
                        connected={connected}
                        onSend={async (cmd) => {
                            await fetch("/amethyst/controls/command", {
                                method: "POST",
                                body: JSON.stringify({ command: cmd.replace('/', '') }),
                                headers: { "Content-Type": "application/json" },
                            });
                        }}
                    />

                </TabsContent>
            </Tabs>
        </div>
    );
}
