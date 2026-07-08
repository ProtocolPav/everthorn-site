import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
    PlayIcon,
    StopIcon,
    ArrowsClockwiseIcon,
    CircleNotchIcon,
    HardDrivesIcon,
    StopCircleIcon, WarningIcon,
} from "@phosphor-icons/react";
import { useServerInfo, useServerStatus } from "@/hooks/use-info";
import { useServerControls } from "@/hooks/use-server-controls.ts";
import {Checkbox} from "@/components/ui/checkbox.tsx";
import {useState} from "react";

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
    const [confirmed1, setConfirmed1] = useState(false);
    const [confirmed2, setConfirmed2] = useState(false);

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

                <AlertDialog>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 rounded-md text-red-400/30 hover:text-red-500 hover:bg-red-500/10"
                                >
                                    <StopCircleIcon size={13} weight="fill" />
                                    <span className="sr-only">Force kill</span>
                                </Button>
                            </AlertDialogTrigger>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="text-xs text-red-500">
                            Force kill
                        </TooltipContent>
                    </Tooltip>

                    <AlertDialogContent className="max-w-sm">
                        <AlertDialogHeader>
                            <AlertDialogTitle>Force Kill Server</AlertDialogTitle>
                            <AlertDialogDescription className="sr-only">
                                Confirm force killing the server process
                            </AlertDialogDescription>
                        </AlertDialogHeader>

                        {/* Warning box */}
                        <div className="bg-destructive/8 border border-destructive/20 rounded-lg p-3 space-y-2">
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-destructive">
                                <WarningIcon size={13} weight="fill" />
                                Destructive action
                            </div>
                            <ul className="space-y-1 pl-4 list-disc">
                                <li className="text-xs text-muted-foreground">
                                    The server will be forcefully shut down, bypassing the normal graceful shutdown process.
                                </li>
                                <li className="text-xs text-muted-foreground">
                                    Active player sessions will be disconnected without saving.
                                </li>
                                <li className="text-xs text-muted-foreground">
                                    Unsaved world data and in-progress chunk writes may be corrupted.
                                </li>
                                <li className="text-xs text-muted-foreground">
                                    You should check the world for corruption after restarting.
                                </li>
                                <li className="text-xs text-zinc-400 font-extrabold">
                                    Only use this if the server is unresponsive and a graceful Stop has already failed.
                                </li>
                            </ul>
                        </div>

                        <div className="flex items-start gap-2.5">
                            <Checkbox
                                id="confirm-kill"
                                checked={confirmed1}
                                onCheckedChange={(v) => setConfirmed1(!!v)}
                                className="mt-0.5"
                            />
                            <label
                                htmlFor="confirm-kill"
                                className="text-xs text-muted-foreground leading-relaxed cursor-pointer"
                            >
                                I understand this will forcefully terminate the server and may cause data loss.
                            </label>
                        </div>

                        <div className="flex items-start gap-2.5">
                            <Checkbox
                                id="confirm-availability"
                                checked={confirmed2}
                                onCheckedChange={(v) => setConfirmed2(!!v)}
                                className="mt-0.5"
                            />
                            <label
                                htmlFor="confirm-availability"
                                className="text-xs text-muted-foreground leading-relaxed cursor-pointer"
                            >
                                I am able to get on and check the world for any possible corruption
                            </label>
                        </div>

                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 text-white"
                                disabled={!(confirmed1 && confirmed2)}
                                onClick={() => onAction("kill")}
                            >
                                <StopCircleIcon size={13} weight="fill" />
                                Force Kill
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
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