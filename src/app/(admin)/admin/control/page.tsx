"use client";

import { useState, useEffect } from "react";
import { usePageTitle } from "@/hooks/use-context";
import {
    FunnelIcon, ListBulletsIcon, MapTrifoldIcon,
    ArrowArcLeftIcon, ArrowArcRightIcon,
} from "@phosphor-icons/react";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Card, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import { toast } from "sonner";

import { LazyLog } from "@melloware/react-logviewer";

export default function ControlPanelDashboard() {
    const { setTitle } = usePageTitle();

    // Set page title
    useEffect(() => {
        setTitle("Server Control Panel (BETA)");
    }, [setTitle]);

    return (
        <div className={'grid gap-3 h-full'}>
            <Tabs defaultValue={'list'}>
                <div className={'flex justify-end'}>
                    <TabsList>
                        <TabsTrigger value={'list'}><ListBulletsIcon/></TabsTrigger>
                        <TabsTrigger value={'map'}><MapTrifoldIcon/></TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value={'list'}>
                    <Card className={'p-0 gap-0 h-full overflow-hidden'}>
                        <LazyLog
                            iconFilterLines={<FunnelIcon weight={"fill"} size={20}/>}
                            iconFindNext={<ArrowArcRightIcon weight={"fill"} size={20}/>}
                            iconFindPrevious={<ArrowArcLeftIcon weight={"fill"} size={20}/>}
                            enableLinks={true}
                            enableSearch={true}
                            enableSearchNavigation={true}
                            selectableLines={true}
                            enableLineNumbers={true}
                            enableGutters={false}
                            url='/amethyst/controls/logs'
                            stream={true}
                            follow={true}
                            wrapLines={true}
                            overscanRowCount={200}
                        />
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
