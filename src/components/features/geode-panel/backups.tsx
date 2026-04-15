import { useState, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Dialog, DialogContent, DialogFooter,
    DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useBackups, backupsQueryOptions, type Backup } from "@/hooks/use-backups";
import { ArrowCounterClockwiseIcon } from "@phosphor-icons/react";

function readableSize(bytes: number) {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}
function formatLocal(utc: string) {
    return new Date(utc).toLocaleString();
}

const backupTypes = [
    { value: "all", label: "All" },
    { value: "hourly", label: "Hourly" },
    { value: "daily", label: "Daily" },
    { value: "monthly", label: "Monthly" },
];

const typeBadgeVariant: Record<string, string> = {
    hourly: "info",
    daily: "amber",
    monthly: "purple",
};

export default function BackupsList({ serverRunning }: { serverRunning: boolean }) {
    const queryClient = useQueryClient();
    const { backups, isLoading } = useBackups();
    const [selected, setSelected] = useState<Backup | null>(null);
    const [confirm1, setConfirm1] = useState(false);
    const [confirm2, setConfirm2] = useState(false);
    const [restoreInput, setRestoreInput] = useState("");
    const [restoring, setRestoring] = useState(false);
    const [typeFilter, setTypeFilter] = useState("all");

    const sorted = useMemo(
        () => (backups ?? []).slice().sort(
            (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        ),
        [backups]
    );

    const filtered = useMemo(() => {
        return typeFilter === "all" ? sorted : sorted.filter((b) => b.type === typeFilter);
    }, [sorted, typeFilter]);

    function openRestore(b: Backup) {
        if (!serverRunning) return;
        setSelected(b);
        setConfirm1(true);
    }
    function proceedRestore() {
        setConfirm1(false);
        setConfirm2(true);
        setRestoreInput("");
    }
    async function doRestore() {
        if (!selected) return;
        setRestoring(true);
        await fetch("/amethyst/backups/restore", {
            method: "POST",
            body: JSON.stringify({ full_path: selected.full_path, restore_type: "full" }),
            headers: { "Content-Type": "application/json" },
        });
        await queryClient.invalidateQueries({ queryKey: backupsQueryOptions.queryKey });
        setRestoring(false);
        setConfirm2(false);
        setSelected(null);
    }

    return (
        <div className="space-y-3 h-100">
            <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold">Backups</h2>
                <Tabs value={typeFilter} onValueChange={setTypeFilter}>
                    <TabsList className={'h-8'}>
                        {backupTypes.map((t) => (
                            <TabsTrigger
                                key={t.value}
                                value={t.value}
                            >
                                {t.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>
            </div>

            <ScrollArea className="h-full">
                <div className="space-y-2 pr-3">
                    {isLoading ? (
                        Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="border rounded p-3 space-y-2">
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-4 w-full" />
                                <div className="flex justify-between items-center space-x-2">
                                    <Skeleton className="h-3 w-12" />
                                    <Skeleton className="h-3 w-20" />
                                </div>
                                <Skeleton className="h-7 w-full" />
                            </div>
                        ))
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground text-sm">
                            No {typeFilter === "all" ? "" : typeFilter} backups found.
                        </div>
                    ) : (
                        filtered.map((b) => (
                            <div
                                key={b.name}
                                className={`border rounded-xl p-3 space-y-2 ${serverRunning ? "" : "opacity-50"}`}
                            >
                                <Badge
                                    variant={typeBadgeVariant[b.type] as any || "secondary"}
                                    className="w-fit text-xs"
                                >
                                    {b.type}
                                </Badge>
                                <div className="font-mono text-sm leading-tight">{b.name}</div>
                                <div className="flex justify-between items-center text-xs text-muted-foreground">
                                    <span>{readableSize(b.size_bytes)}</span>
                                    <span>{formatLocal(b.timestamp)}</span>
                                </div>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => openRestore(b)}
                                    disabled={!serverRunning}
                                    className="w-full h-7 text-xs justify-center"
                                >
                                    <ArrowCounterClockwiseIcon size={12} className="mr-1" />
                                    Restore
                                </Button>
                            </div>
                        ))
                    )}
                </div>
            </ScrollArea>

            <Dialog open={confirm1} onOpenChange={setConfirm1}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Restore this backup?</DialogTitle>
                        <DialogDescription>
                            This will replace your world with the backup and erase progress since then.
                            <ul className="mt-2 mb-2 text-xs space-y-1 pl-4 list-disc text-muted-foreground">
                                <li>A backup of your world will be made first so you can undo if needed.</li>
                                <li>If interrupted, restoring may corrupt the world and require another restore.</li>
                                <li>Please only do this if all players agree.</li>
                            </ul>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="destructive" onClick={proceedRestore}>Continue</Button>
                        <Button variant="outline" onClick={() => setConfirm1(false)}>Cancel</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={confirm2} onOpenChange={setConfirm2}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Type{" "}
                            <span className="font-mono px-2 bg-muted tracking-wider rounded">RESTORE</span>
                            {" "}to confirm
                        </DialogTitle>
                        <DialogDescription>
                            This action will begin restoring the backup and overwrite the world.
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter>
                        <Button
                            variant="destructive"
                            disabled={restoreInput !== "RESTORE" || restoring}
                            onClick={doRestore}
                        >
                            {restoring ? "Restoring…" : "Restore"}
                        </Button>
                        <Button variant="outline" onClick={() => setConfirm2(false)} disabled={restoring}>
                            Cancel
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}