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
} from "@phosphor-icons/react";
import { useServerInfo, useServerStatus } from "@/hooks/use-info";
import { useServerControls } from "@/hooks/use-server-controls";

// ─── Status pill ──────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<string, { dot: string; pill: string; label: string }> = {
    started:    { dot: "bg-green-500 shadow-[0_0_5px_2px_rgba(34,197,94,0.5)]",  pill: "bg-green-500/15 text-green-600 dark:text-green-400",  label: "Online" },
    stopped:    { dot: "bg-muted-foreground/30",                                   pill: "bg-muted/40 text-muted-foreground",                    label: "Offline" },
    backup:     { dot: "bg-amber-500 shadow-[0_0_5px_2px_rgba(245,158,11,0.5)]", pill: "bg-amber-500/15 text-amber-600 dark:text-amber-400",   label: "Backup" },
    map_update: { dot: "bg-blue-500 shadow-[0_0_5px_2px_rgba(59,130,246,0.5)]",  pill: "bg-blue-500/15 text-blue-600 dark:text-blue-400",      label: "Map Update" },
};

function getStatusStyle(status: string | undefined) {
    return STATUS_STYLES[status ?? ""] ?? {
        dot: "bg-amber-500",
        pill: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
        label: status ?? "—",
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
            <div className="flex items-center gap-1.5 text-[11px] text-blue-900/50 dark:text-blue-100/40">
                <CircleNotchIcon size={13} className="animate-spin shrink-0 text-blue-500/60" />
                <span className="capitalize">{pendingAction ?? "Loading"}…</span>
            </div>
        );
    }

    if (status === "stopped") {
        return (
            <Button
                size="sm"
                className="h-7 w-full text-[11px] gap-1.5 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white"
                onClick={() => onAction("start")}
            >
                <PlayIcon size={12} weight="fill" />
                Start Server
            </Button>
        );
    }

    if (status === "started") {
        return (
            <div className="flex items-center gap-1.5">
                <Button
                    variant="outline"
                    size="sm"
                    className="h-7 flex-1 text-[11px] gap-1 border-blue-900/10 dark:border-blue-100/10 hover:bg-blue-500/10 text-blue-900/70 dark:text-blue-100/70"
                    onClick={() => onAction("restart")}
                >
                    <ArrowsClockwiseIcon size={12} />
                    Restart
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    className="h-7 flex-1 text-[11px] gap-1 border-blue-900/10 dark:border-blue-100/10 hover:bg-blue-500/10 text-blue-900/70 dark:text-blue-100/70"
                    onClick={() => onAction("stop")}
                >
                    <StopIcon size={12} weight="fill" />
                    Stop
                </Button>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 shrink-0 text-red-400/50 hover:text-red-500 hover:bg-red-500/10"
                            onClick={() => onAction("kill")}
                        >
                            <WarningIcon size={13} weight="fill" />
                            <span className="sr-only">Force kill server</span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side={'bottom'} className={'text-xs'}>
                        Force kill
                    </TooltipContent>
                </Tooltip>
            </div>
        );
    }

    return (
        <p className="text-[10px] text-blue-900/40 dark:text-blue-100/30 italic">
            No actions available
        </p>
    );
}

// ─── Control chip ─────────────────────────────────────────────────────────────

export function ControlChip({ className }: { className?: string }) {
    const { info, isLoading: infoLoading } = useServerInfo();
    const { status, isLoading: statusLoading } = useServerStatus();
    const { triggerAction, pendingAction, isLoading: actionLoading } = useServerControls();

    const isPending = actionLoading || statusLoading;
    const style = getStatusStyle(isPending ? undefined : status);

    return (
        <div className={cn(
            "bg-blue-500/10 rounded-lg p-3 flex flex-col justify-between min-w-0 gap-2",
            className,
        )}>
            {/* Top row: name + status pill */}
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 min-w-0">
                    <span className={cn(
                        "inline-block h-1.5 w-1.5 rounded-full shrink-0 transition-all duration-500",
                        isPending ? "bg-amber-400 animate-pulse" : style.dot,
                    )} />
                    <span className="text-xs font-semibold truncate text-blue-900 dark:text-blue-100">
                        Everthorn
                    </span>
                </div>

                <span className={cn(
                    "shrink-0 text-[10px] px-1.5 py-0.5 rounded-md font-medium leading-none",
                    isPending
                        ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                        : style.pill,
                )}>
                    {isPending ? (pendingAction ?? "…") : style.label}
                </span>
            </div>

            {/* Version */}
            <p className="text-[10px] text-blue-900/40 dark:text-blue-100/30 leading-none -mt-1 truncate">
                {infoLoading
                    ? <Skeleton className="h-3 w-20 inline-block" />
                    : `Minecraft ${info?.minecraft_version ?? "—"}`
                }
            </p>

            {/* Actions */}
            <ActionArea
                status={status}
                isPending={isPending}
                pendingAction={pendingAction}
                onAction={triggerAction}
            />
        </div>
    );
}