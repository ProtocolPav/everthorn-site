import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Area, AreaChart } from "recharts";
import { Clock, Cpu, Server, Users, RotateCw, XOctagon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useServerInfo, useServerStatus } from "@/hooks/use-info";
import {useEffect, useState} from "react";
import {usePlayers} from "@/hooks/use-players";

const cpuChartConfig = {
    cpu: {
        label: "CPU Usage",
        color: "#22c55e",
    },
} satisfies ChartConfig;

const ramChartConfig = {
    ram: {
        label: "RAM Usage",
        color: "#f59e42",
    },
} satisfies ChartConfig;

function formatUptime(iso: string) {
    if (!iso) return "-";
    // Ensure UTC gets compared to local time
    const utcDate = new Date(iso);
    const localOffsetMs = new Date().getTimezoneOffset() * 60000;
    // Get current local time in ms, then calculate uptime
    const nowLocalTime = Date.now();
    const uptimeMs = nowLocalTime - (utcDate.getTime() - localOffsetMs);

    const days = Math.floor(uptimeMs / 86400000);
    const hours = Math.floor((uptimeMs % 86400000) / 3600000);
    const minutes = Math.floor((uptimeMs % 3600000) / 60000);
    const seconds = Math.floor((uptimeMs % 60000) / 1000);

    const pad = (n: number) => n.toString();

    let result = '';
    if (days > 0) result += `${pad(days)} days, `;
    if (hours > 0) result += `${pad(hours)}h `;
    result += `${pad(minutes)}m ${pad(seconds)}s`;

    return result.trim();
}

function LiveUptime({ iso }: { iso: string }) {
    const [uptime, setUptime] = useState(() => formatUptime(iso));

    useEffect(() => {
        const timer = setInterval(() => {
            setUptime(formatUptime(iso));
        }, 1000);
        return () => clearInterval(timer);
    }, [iso]);

    return <span>{uptime}</span>;
}

export default function CardOverview() {
    const [selectedGuildId, setSelectedGuildId] = useState('611008530077712395');
    const { players, isLoading: playersLoading } = usePlayers(selectedGuildId);
    const { info, isLoading: infoLoading, mutate: mutateInfo } = useServerInfo();
    const { status, isLoading: statusLoading, mutate: mutateStatus } = useServerStatus();
    const [actionLoading, setActionLoading] = useState(false);

    const totalRAM = 32;
    const usedRAM = Math.round(Math.random() * (totalRAM - 10)) + 10;
    const cpuData = Array.from({ length: 12 }).map(() => ({ cpu: Math.random() * 90 + 10 }));
    const ramData = Array.from({ length: 12 }).map(() => ({ ram: Math.random() * (totalRAM - 10) + 10 }));

    async function handleActionWithPolling(endpoint: string, expectedState: string) {
        setActionLoading(true);
        await fetch(endpoint, { method: "POST" });

        // Poll every 2 seconds (or adjust as needed)
        let pollInterval: NodeJS.Timeout | null = null;

        const pollStatus = async () => {
            const res = await fetch('/amethyst/info/status');
            const data = await res.json();

            // If the status has changed to the expected value, finish polling
            if (data.status === expectedState) {
                setActionLoading(false);
                mutateInfo();
                mutateStatus();
                if (pollInterval) clearInterval(pollInterval);
            }
        }

        pollInterval = setInterval(pollStatus, 2000);

        // Optionally add a timeout to avoid infinite polling
        setTimeout(() => {
            if (pollInterval) clearInterval(pollInterval);
            setActionLoading(false); // Fallback, you may want to keep disabled or show error
        }, 120000); // 2 minutes max
    }

    return (
        <div className="grid grid-cols-5 gap-2">
            {/* SERVER CARD */}
            <Card className="relative border-0 col-span-2 overflow-visible bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 h-20 flex items-center">
                <div className="relative z-10 p-3 h-full w-full flex items-center justify-between">
                    {/* Info on left */}
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1 truncate">
                            Version {info?.minecraft_version}
                        </p>
                        <div className="text-lg font-bold leading-none truncate">
                            {infoLoading ? (
                                <Skeleton className="h-5 w-32" />
                            ) : (
                                "Server Name"
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1 truncate">
                            <Clock className="inline h-4 w-4" />
                            {status === "stopped"
                                ? "Server is stopped"
                                : info?.server_start
                                    ? <LiveUptime iso={info.server_start} />
                                    : <Skeleton className="h-4 w-32" />
                            }
                        </p>
                    </div>
                    {/* Right actions & Switch */}
                    <div className="flex items-center gap-2">
                        {/* Actions Dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="rounded-full">
                                    <span className="sr-only">Server Actions</span>
                                    <svg width={20} height={20} viewBox="0 0 20 20" fill="none">
                                        <circle cx="4" cy="10" r="1.5" fill="currentColor" />
                                        <circle cx="10" cy="10" r="1.5" fill="currentColor" />
                                        <circle cx="16" cy="10" r="1.5" fill="currentColor" />
                                    </svg>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent side="top" align="end">
                                <DropdownMenuItem onClick={async () =>
                                    handleActionWithPolling(
                                        "/amethyst/controls/restart",
                                        "started"
                                    )
                                }>
                                    <RotateCw className="w-4 h-4 mr-2" /> Restart
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={async () =>
                                    handleActionWithPolling(
                                        "/amethyst/controls/kill",
                                        "stopped"
                                    )
                                }>
                                    <XOctagon className="w-4 h-4 mr-2 text-red-500" /> Kill
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        {/* Visible/colored Switch with tooltip (no asChild) */}
                        <Tooltip>
                            <TooltipTrigger>
                                <Switch
                                    checked={status !== "stopped"}
                                    disabled={actionLoading || statusLoading}
                                    onCheckedChange={async checked =>
                                        handleActionWithPolling(
                                            checked ? "/amethyst/controls/start" : "/amethyst/controls/stop",
                                            checked ? "started" : "stopped"
                                        )
                                    }
                                    className={`transition-colors data-[state=checked]:bg-green-500 bg-gray-200`}
                                />
                            </TooltipTrigger>
                            <TooltipContent side="left" align="center">
                                {status && status !== "stopped" ? "Turn server off" : "Turn server on"}
                            </TooltipContent>
                        </Tooltip>
                    </div>
                </div>
            </Card>

            {/* CPU CARD */}
            <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 h-20">
                <div className="absolute inset-0 opacity-50">
                    <ChartContainer config={cpuChartConfig} className="h-full w-full">
                        <AreaChart data={cpuData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                            <Area
                                dataKey="cpu"
                                type="natural"
                                fill={cpuChartConfig.cpu.color}
                                fillOpacity={0.4}
                                stroke={cpuChartConfig.cpu.color}
                                strokeWidth={2}
                            />
                        </AreaChart>
                    </ChartContainer>
                </div>
                <div className="relative z-10 p-3 h-full flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                            CPU
                        </p>
                        <div className="text-lg font-bold leading-none">
                            {Math.round(cpuData.at(-1)?.cpu ?? 0)}%
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Usage
                        </p>
                    </div>
                    <div className="p-1.5 rounded-md bg-green-100 dark:bg-green-900/30 ml-2">
                        <Cpu className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                </div>
            </Card>

            {/* RAM CARD */}
            <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 h-20">
                <div className="absolute inset-0 opacity-50">
                    <ChartContainer config={ramChartConfig} className="h-full w-full">
                        <AreaChart data={ramData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                            <Area
                                dataKey="ram"
                                type="natural"
                                fill={ramChartConfig.ram.color}
                                fillOpacity={0.4}
                                stroke={ramChartConfig.ram.color}
                                strokeWidth={2}
                            />
                        </AreaChart>
                    </ChartContainer>
                </div>
                <div className="relative z-10 p-3 h-full flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                            RAM
                        </p>
                        <div className="text-lg font-bold leading-none">
                            {usedRAM} GB / {totalRAM} GB
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Usage
                        </p>
                    </div>
                    <div className="p-1.5 rounded-md bg-amber-100 dark:bg-amber-900/30 ml-2">
                        <Server className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    </div>
                </div>
            </Card>

            {/* PLAYERS CARD */}
            <Card className="border-0 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 h-20">
                <div className="p-3 h-full flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                            Players
                        </p>
                        <div className="text-lg font-bold leading-none">
                            {playersLoading ? (
                                <Skeleton className="h-5 w-8" />
                            ) : (
                                players?.length || '0'
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Online
                        </p>
                    </div>
                    <div className="p-1.5 rounded-md bg-purple-100 dark:bg-purple-900/30 ml-2">
                        <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                </div>
            </Card>
        </div>
    );
}
