import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Dialog, DialogContent, DialogFooter,
    DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { useBackups, type Backup } from "@/hooks/use-backups";
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
    { value: "all",     label: "All"     },
    { value: "hourly",  label: "Hourly"  },
    { value: "daily",   label: "Daily"   },
    { value: "monthly", label: "Monthly" },
];

const typeBadgeVariant: Record<string, string> = {
    hourly:  "info",
    daily:   "amber",
    monthly: "purple",
};

export default function BackupsList({ serverRunning }: { serverRunning: boolean }) {
    const { backups, isLoading, restoreBackup } = useBackups();

    const [selected, setSelected]           = useState<Backup | null>(null);
    const [confirm, setConfirm]             = useState(false);
    const [checkboxChecked, setCheckboxChecked] = useState(false);
    const [restoring, setRestoring]         = useState(false);
    const [typeFilter, setTypeFilter]       = useState("all");

    const sorted = useMemo(
        () => (backups ?? []).slice().sort(
            (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        ),
        [backups],
    );

    const filtered = useMemo(
        () => typeFilter === "all" ? sorted : sorted.filter((b) => b.type === typeFilter),
        [sorted, typeFilter],
    );

    function openRestore(b: Backup) {
        if (!serverRunning) return;
        setSelected(b);
        setConfirm(true);
        setCheckboxChecked(false);
    }

    async function doRestore() {
        if (!selected) return;
        setRestoring(true);
        setConfirm(false);
        try {
            await restoreBackup(selected.full_path);
            setSelected(null);
        } finally {
            setRestoring(false);
        }
    }

    return (
        <div className="space-y-3 h-100">
            <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold">Backups</h2>
                <Tabs value={typeFilter} onValueChange={setTypeFilter}>
                    <TabsList className="h-8">
                        {backupTypes.map((t) => (
                            <TabsTrigger key={t.value} value={t.value}>
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
                                    variant={(typeBadgeVariant[b.type] ?? "secondary") as any}
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

            <Dialog open={confirm} onOpenChange={setConfirm}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Backup Restore</DialogTitle>
                        <DialogDescription>
                            Restoring this backup will replace the current world state and erase all progress made since the backup was created. This action cannot be undone.
                            <ul className="mt-2 mb-4 text-xs space-y-1 pl-4 list-disc text-muted-foreground">
                                <li>A backup of your current world will be created automatically before restoration to allow for reversal if needed.</li>
                                <li>Restoration may take several minutes and should not be interrupted, as this could corrupt the world data.</li>
                                <li>Ensure all players are aware and have agreed to this action before proceeding.</li>
                                <li>The server will be temporarily unavailable during the restore process.</li>
                            </ul>
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex items-center space-x-2 mb-4">
                        <Checkbox
                            id="confirm-restore"
                            checked={checkboxChecked}
                            onCheckedChange={(checked) => setCheckboxChecked(!!checked)}
                        />
                        <label
                            htmlFor="confirm-restore"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            I understand this will erase all progress since this backup
                        </label>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="destructive"
                            disabled={!checkboxChecked || restoring}
                            onClick={doRestore}
                        >
                            {restoring ? "Restoring…" : "Restore Backup"}
                        </Button>
                        <Button variant="outline" onClick={() => setConfirm(false)} disabled={restoring}>
                            Cancel
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}