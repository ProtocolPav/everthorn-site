import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    PlayIcon,
    StopIcon,
    ArrowsClockwiseIcon,
    WarningIcon,
    CircleNotchIcon,
    HardDrivesIcon,
} from "@phosphor-icons/react";
import { useServerInfo, useServerStatus } from "@/hooks/use-info";
import { useServerControls } from "@/hooks/use-server-controls.ts";

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { dot: string; label: string; pulse: boolean }> = {
    started:    { dot: "bg-green-500",          label: "Online",     pulse: true  },
    stopped:    { dot: "bg-blue-900/20 dark:bg-blue-100/20", label: "Offline", pulse: false },
    backup:     { dot: "bg-amber-500",           label: "Backup",     pulse: true  },
    map_update: { dot: "bg-blue-500",            label: "Map Update", pulse: false },
};

function getStatusConfig(status: string | undefined) {
    return STATUS_CONFIG[status ?? ""] ?? {
        dot: "bg-amber-400",
        label: status ?? "—",
        pulse: true,
    };
}

// ─── Action area ──────────────────────────────────────────────────────────────

interface ActionAreaProps {
    status: string | undefined;
    isPending: boolean;
    pendingAction: string | null;
    onAction: (action: "start" | "stop" | "restart" | "kill") => void;
}

function ActionArea({ status, isPending, pendingAction, onAction }: ActionAreaProps) {
    if (isPending) {
        return (
            <div className="flex items-center gap-1.5 text-[10px] text-pink-900/40 dark:text-pink-100/30">
                <CircleNotchIcon size={11} className="animate-spin shrink-0" />
                <span className="capitalize">{pendingAction ?? "Loading"}…</span>
            </div>
        );
    }

    if (status === "stopped") {
        return (
            <Button
                size="sm"
                className="h-7 text-[11px] px-3 gap-1.5 font-medium bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white rounded-md"
                onClick={() => onAction("start")}
            >
                <PlayIcon size={10} weight="fill" />
                Start Server
            </Button>
        );
    }

    if (status === "started") {
        return (
            <div className="flex items-center gap-1">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-md text-pink-900/50 dark:text-pink-100/40 hover:text-pink-900 dark:hover:text-pink-100 hover:bg-pink-500/10"
                            onClick={() => onAction("restart")}
                        >
                            <ArrowsClockwiseIcon size={13} />
                            <span className="sr-only">Restart</span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="text-xs">Restart</TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-md text-pink-900/50 dark:text-pink-100/40 hover:text-pink-900 dark:hover:text-pink-100 hover:bg-pink-500/10"
                            onClick={() => onAction("stop")}
                        >
                            <StopIcon size={13} weight="fill" />
                            <span className="sr-only">Stop</span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="text-xs">Stop</TooltipContent>
                </Tooltip>

                <div className="h-4 w-px bg-pink-900/10 dark:bg-pink-100/10 mx-0.5" />

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-md text-red-400/30 hover:text-red-500 hover:bg-red-500/10"
                            onClick={() => onAction("kill")}
                        >
                            <WarningIcon size={13} weight="fill" />
                            <span className="sr-only">Force kill</span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="text-xs text-red-500">
                        Force kill
                    </TooltipContent>
                </Tooltip>
            </div>
        );
    }

    return null;
}

// ─── Control chip ─────────────────────────────────────────────────────────────

export function ControlChip({ className }: { className?: string }) {
    const { info, isLoading: infoLoading } = useServerInfo();
    const { status, isLoading: statusLoading } = useServerStatus();
    const { triggerAction, pendingAction, isLoading: actionLoading } = useServerControls();

    const isPending = actionLoading || statusLoading;
    const cfg = getStatusConfig(isPending ? undefined : status);

    return (
        <div className={cn("w-full rounded-lg relative overflow-hidden min-w-0 bg-pink-500/10", className)}>
            <div className="relative z-10 p-3 h-full flex flex-col justify-between">
                {/* Top row — mirrors InfoChip: label left, icon right */}
                <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold uppercase tracking-widest opacity-70 text-pink-900 dark:text-pink-100">
                        Everthorn
                    </span>
                    <span className="text-pink-900/40 dark:text-pink-100/30 shrink-0">
                        <HardDrivesIcon size={14} />
                    </span>
                </div>

                {/* Middle — name + version as the "value", status as subtext */}
                <div className="text-[11px] text-pink-900/35 dark:text-pink-100/30">
                        {infoLoading ? (
                            <Skeleton className="h-2.5 w-10 inline-block" />
                        ) : (
                            `v${info?.minecraft_version ?? "—"}`
                        )}
                </div>

                {/* Bottom row — status dot+label left, actions right */}
                <div className="flex items-center justify-between gap-2">
                    {/* Status */}
                    <div className="flex items-center gap-1.5 min-w-0">
                        <span className="relative flex h-1.5 w-1.5 shrink-0">
                            {!isPending && cfg.pulse && (
                                <span className={cn(
                                    "animate-ping absolute inline-flex h-full w-full rounded-full opacity-60",
                                    cfg.dot,
                                )} />
                            )}
                            <span className={cn(
                                "relative inline-flex rounded-full h-1.5 w-1.5 transition-colors duration-500",
                                isPending ? "bg-amber-400 animate-pulse" : cfg.dot,
                            )} />
                        </span>
                        <span className={cn(
                            "text-[10px] font-medium leading-none transition-colors duration-300",
                            isPending
                                ? "text-amber-500 dark:text-amber-400"
                                : "text-pink-900/50 dark:text-pink-100/40",
                        )}>
                            {isPending ? `${pendingAction ?? "Loading"}…` : cfg.label}
                        </span>
                    </div>

                    {/* Actions */}
                    <ActionArea
                        status={status}
                        isPending={isPending}
                        pendingAction={pendingAction}
                        onAction={triggerAction}
                    />
                </div>
            </div>
        </div>
    );
}