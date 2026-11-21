import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Timer } from "lucide-react";
import { InfoChip } from "@/components/features/geode-panel/chips/info-chip.tsx";
import { useServerInfo } from "@/hooks/use-info";
import { useServerStatus } from "@/hooks/use-info";

function formatUptime(iso: string): string {
    if (!iso) return "-";
    const utcDate = new Date(iso);
    const localOffsetMs = new Date().getTimezoneOffset() * 60000;
    const uptimeMs = Date.now() - (utcDate.getTime() - localOffsetMs);
    const days = Math.floor(uptimeMs / 86400000);
    const hours = Math.floor((uptimeMs % 86400000) / 3600000);
    const minutes = Math.floor((uptimeMs % 3600000) / 60000);
    const seconds = Math.floor((uptimeMs % 60000) / 1000);
    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
    return `${minutes}m ${seconds}s`;
}

function LiveUptime({ iso }: { iso: string }) {
    const [uptime, setUptime] = useState(() => formatUptime(iso));
    useEffect(() => {
        const timer = setInterval(() => setUptime(formatUptime(iso)), 1000);
        return () => clearInterval(timer);
    }, [iso]);
    return <span>{uptime}</span>;
}

export function UptimeChip() {
    const { info, isLoading: infoLoading } = useServerInfo();
    const { status, isLoading: statusLoading } = useServerStatus();

    const stopped = status === "stopped";
    const loading = infoLoading || statusLoading;

    const value = loading ? (
        <Skeleton className="h-5 w-20" />
    ) : stopped ? (
        <span className="text-muted-foreground text-sm font-medium">Offline</span>
    ) : info?.server_start ? (
        <LiveUptime iso={info.server_start} />
    ) : (
        "-"
    );

    return (
        <InfoChip
            label="Uptime"
            value={value}
            subtext="Since last start"
            icon={<Timer className="h-3.5 w-3.5" />}
            colorClass="bg-green-500/10"
            textClass="text-green-500"
            iconColorClass="text-green-400/60"
        />
    );
}