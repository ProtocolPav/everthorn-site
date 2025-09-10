"use client";

import { useState, useEffect } from "react";
import { usePageTitle } from "@/hooks/use-context";
import {
    FunnelIcon, ArrowArcLeftIcon, ArrowArcRightIcon,
    PlayIcon, StopIcon, DatabaseIcon, CommandIcon,
    ComputerTowerIcon, ChartLineUpIcon, ClockIcon, UsersIcon
} from "@phosphor-icons/react";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Card, CardContent, CardHeader, CardTitle, CardDescription} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Badge} from "@/components/ui/badge";
import {Skeleton} from "@/components/ui/skeleton";
import {ScrollArea} from "@/components/ui/scroll-area";
import { toast } from "sonner";
import {LazyLog, ScrollFollow} from "@melloware/react-logviewer";

export default function ControlPanelDashboard() {
    const { setTitle } = usePageTitle();
    const [connected, setConnected] = useState(false);
    const [serverStatus, setServerStatus] = useState('running');
    const [onlinePlayers, setOnlinePlayers] = useState(3);
    const [maxPlayers, setMaxPlayers] = useState(20);
    const [uptime, setUptime] = useState('5d 12h');
    const [command, setCommand] = useState('');
    const [selectedPlayer, setSelectedPlayer] = useState('');
    const [playerList, setPlayerList] = useState(['Steve', 'Alex', 'Herobrine']);
    const [loading, setLoading] = useState(false);

    const [recentActivity, setRecentActivity] = useState([
        { player: 'Steve', action: 'joined', time: '2m ago' },
        { player: 'Alex', action: 'executed /spawn', time: '5m ago' },
        { player: 'Herobrine', action: 'left', time: '8m ago' },
    ]);

    useEffect(() => {
        setTitle("Server Control Panel");

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

    const handleServerAction = (action: 'start' | 'stop') => {
        setLoading(true);
        if (action === 'start' && serverStatus === 'stopped') {
            setServerStatus('starting');
            toast.success('Starting server...');
            setTimeout(() => {
                setServerStatus('running');
                setLoading(false);
            }, 3000);
        } else if (action === 'stop' && serverStatus === 'running') {
            setServerStatus('stopping');
            toast.success('Stopping server...');
            setTimeout(() => {
                setServerStatus('stopped');
                setLoading(false);
            }, 2000);
        } else {
            setLoading(false);
        }
    };

    const handleBackup = () => {
        toast.success('Manual backup initiated...');
    };

    const executeCommand = () => {
        if (command.trim()) {
            toast.success(`Command executed: ${command}`);
            setCommand('');
        }
    };

    const quickAction = (action: string, player?: string) => {
        if (player && action === 'kick') {
            toast.success(`Kicked player: ${player}`);
        } else if (action === 'save-all') {
            toast.success('World saved successfully');
        }
    };

    return (
        <div className={'h-full overflow-hidden'}>
            <Tabs defaultValue={'dashboard'} className="h-full flex flex-col">
                <div className={'flex justify-between items-center flex-shrink-0 mb-3'}>
                    <TabsList>
                        <TabsTrigger value={'dashboard'}>Console</TabsTrigger>
                    </TabsList>
                    <div className={`flex items-center gap-2`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${
                            connected ? 'bg-green-500' : 'bg-red-500'
                        }`}></div>
                        <span className={`${connected ? 'text-green-600' : 'text-red-600'} text-sm font-medium`}>
                            {connected ? 'Connected' : 'Disconnected'}
                        </span>
                    </div>
                </div>

                <div className="flex-1 overflow-hidden">
                    <TabsContent value={'dashboard'} className="h-full m-0">
                        {/* Compact Stats */}
                        <div className="grid grid-cols-4 gap-2 mb-3">
                            <Card className="border-0 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 h-16">
                                <div className="p-2 h-full flex items-center justify-between">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                            Status
                                        </p>
                                        <div className="text-sm font-bold leading-none">
                                            {serverStatus === 'running' ? 'Running' : 'Stopped'}
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            {serverStatus === 'running' ? uptime : 'Offline'}
                                        </p>
                                    </div>
                                    <div className="p-1 rounded bg-purple-100 dark:bg-purple-900/30">
                                        <ComputerTowerIcon className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                                    </div>
                                </div>
                            </Card>

                            <Card className="border-0 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 h-16">
                                <div className="p-2 h-full flex items-center justify-between">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                            Players
                                        </p>
                                        <div className="text-sm font-bold leading-none">
                                            {onlinePlayers}/{maxPlayers}
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Online
                                        </p>
                                    </div>
                                    <div className="p-1 rounded bg-green-100 dark:bg-green-900/30">
                                        <UsersIcon className="h-3 w-3 text-green-600 dark:text-green-400" />
                                    </div>
                                </div>
                            </Card>

                            <Card className="border-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 h-16">
                                <div className="p-2 h-full flex items-center justify-between">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                            TPS
                                        </p>
                                        <div className="text-sm font-bold leading-none">
                                            19.8
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Excellent
                                        </p>
                                    </div>
                                    <div className="p-1 rounded bg-blue-100 dark:bg-blue-900/30">
                                        <ChartLineUpIcon className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                                    </div>
                                </div>
                            </Card>

                            <Card className="border-0 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 h-16">
                                <div className="p-2 h-full flex items-center justify-between">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                            Backup
                                        </p>
                                        <div className="text-sm font-bold leading-none">
                                            2h ago
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            2.4 GB
                                        </p>
                                    </div>
                                    <div className="p-1 rounded bg-orange-100 dark:bg-orange-900/30">
                                        <ClockIcon className="h-3 w-3 text-orange-600 dark:text-orange-400" />
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* Main Layout - Console Focus */}
                        <div className="grid grid-cols-4 gap-3 h-[calc(100%-80px)]">
                            {/* Controls Sidebar */}
                            <div className="space-y-3">
                                {/* Server Controls */}
                                <Card className="p-3 bg-card/40">
                                    <CardHeader className="px-0 pb-2">
                                        <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                            <CommandIcon size={14} />
                                            Controls
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="px-0 space-y-3">
                                        <div className="flex gap-2">
                                            <Button
                                                onClick={() => handleServerAction('start')}
                                                disabled={serverStatus !== 'stopped' || loading}
                                                variant={serverStatus === 'stopped' ? 'default' : 'secondary'}
                                                size="sm"
                                                className="flex-1 text-xs"
                                            >
                                                <PlayIcon size={12} className="mr-1" />
                                                Start
                                            </Button>
                                            <Button
                                                onClick={() => handleServerAction('stop')}
                                                disabled={serverStatus !== 'running' || loading}
                                                variant={serverStatus === 'running' ? 'destructive' : 'secondary'}
                                                size="sm"
                                                className="flex-1 text-xs"
                                            >
                                                <StopIcon size={12} className="mr-1" />
                                                Stop
                                            </Button>
                                        </div>

                                        <Button
                                            onClick={handleBackup}
                                            disabled={serverStatus !== 'running'}
                                            variant="outline"
                                            size="sm"
                                            className="w-full text-xs"
                                        >
                                            <DatabaseIcon size={12} className="mr-1" />
                                            Backup
                                        </Button>

                                        <div className="flex gap-1">
                                            <Input
                                                placeholder="Command..."
                                                value={command}
                                                onChange={(e) => setCommand(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && executeCommand()}
                                                disabled={serverStatus !== 'running'}
                                                className="text-xs h-8"
                                            />
                                            <Button
                                                onClick={executeCommand}
                                                size="sm"
                                                disabled={serverStatus !== 'running'}
                                                className="text-xs h-8"
                                            >
                                                Run
                                            </Button>
                                        </div>

                                        <div className="flex gap-1">
                                            <Select value={selectedPlayer} onValueChange={setSelectedPlayer}>
                                                <SelectTrigger className="text-xs h-8">
                                                    <SelectValue placeholder="Player" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {playerList.map(player => (
                                                        <SelectItem key={player} value={player} className="text-xs">
                                                            {player}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <Button
                                                onClick={() => quickAction('kick', selectedPlayer)}
                                                variant="destructive"
                                                size="sm"
                                                disabled={!selectedPlayer || serverStatus !== 'running'}
                                                className="text-xs h-8"
                                            >
                                                Kick
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Activity Feed */}
                                <Card className="p-3 bg-card/40">
                                    <CardHeader className="px-0 pb-2">
                                        <CardTitle className="text-sm font-semibold">Activity</CardTitle>
                                    </CardHeader>
                                    <CardContent className="px-0">
                                        <ScrollArea className="h-48">
                                            <div className="space-y-2">
                                                {recentActivity.map((activity, index) => (
                                                    <div key={index} className="p-2 rounded bg-muted/50">
                                                        <div className="text-xs font-medium">
                                                            <span className="text-primary">{activity.player}</span>
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">
                                                            {activity.action}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground/70">
                                                            {activity.time}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </ScrollArea>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Main Console - Takes 3 columns */}
                            <div className="col-span-3">
                                <Card className="p-3 bg-card/40 h-full">
                                    <CardHeader className="px-0 pb-2">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                                <CommandIcon />
                                                Server Console
                                            </CardTitle>
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className="text-xs">
                                                    Live Output
                                                </Badge>
                                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                            </div>
                                        </div>
                                        <CardDescription className="text-sm text-muted-foreground">
                                            Real-time server console output and logs
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="px-0 h-[calc(100%-80px)]">
                                        <div className="h-full overflow-hidden rounded-lg border bg-background/50">
                                            <ScrollFollow
                                                startFollowing={true}
                                                render={({ follow, onScroll }) => (
                                                    <LazyLog
                                                        iconFilterLines={<FunnelIcon weight={"fill"} size={16}/>}
                                                        iconFindNext={<ArrowArcRightIcon weight={"fill"} size={16}/>}
                                                        iconFindPrevious={<ArrowArcLeftIcon weight={"fill"} size={16}/>}
                                                        enableLinks={true}
                                                        enableSearch={true}
                                                        enableSearchNavigation={true}
                                                        selectableLines={true}
                                                        enableLineNumbers={true}
                                                        enableGutters={false}
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
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
}
