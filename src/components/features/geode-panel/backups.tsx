import { useState, useMemo } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Dialog, DialogContent, DialogFooter,
    DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { useBackups, type Backup } from "@/hooks/use-backups";
import {
    ArrowCounterClockwiseIcon,
    WarningIcon,
    DatabaseIcon,
} from "@phosphor-icons/react";

// ── Helpers ─────────────────────────────────────────────────

function readableSize(bytes: number) {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function formatLocal(utc: string) {
    return new Date(utc).toLocaleString();
}

// ── Constants ────────────────────────────────────────────────

const BACKUP_TYPES = [
    { value: "all",     label: "All"     },
    { value: "hourly",  label: "Hourly"  },
    { value: "daily",   label: "Daily"   },
    { value: "monthly", label: "Monthly" },
] as const;

// Maps to custom Badge variants defined in your badge.tsx
const TYPE_BADGE_VARIANT: Record<string, "info" | "amber" | "purple"> = {
    hourly:  "info",
    daily:   "amber",
    monthly: "purple",
};

// ── Component ────────────────────────────────────────────────

export default function BackupsList({ serverRunning }: { serverRunning: boolean }) {
    const { backups, isLoading, restoreBackup } = useBackups();

    const [selected, setSelected]               = useState<Backup | null>(null);
    const [dialogOpen, setDialogOpen]           = useState(false);
    const [checkboxChecked, setCheckboxChecked] = useState(false);
    const [restoring, setRestoring]             = useState(false);
    const [typeFilter, setTypeFilter]           = useState("all");

    const sorted = useMemo(
        () => (backups ?? []).slice().sort(
            (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
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
        setCheckboxChecked(false);
        setDialogOpen(true);
    }

    async function doRestore() {
        if (!selected) return;
        setRestoring(true);
        setDialogOpen(false);
        try {
            await restoreBackup(selected.full_path);
            setSelected(null);
        } finally {
            setRestoring(false);
        }
    }

    return (
        <div className="flex flex-col h-full gap-0">
            {/* ── Header ── */}
            <div className="flex items-center justify-between px-4 pt-4 pb-0 border-b border-border">
                <h2 className="text-sm font-semibold">Backups</h2>
                <Tabs value={typeFilter} onValueChange={setTypeFilter}>
                    <TabsList className="h-8 bg-transparent gap-0 p-0 rounded-none">
                        {BACKUP_TYPES.map((t) => (
                            <TabsTrigger
                                key={t.value}
                                value={t.value}
                                className="h-8 rounded-md rounded-b-none border-b-2 border-transparent px-3
                                           data-[state=active]:border-primary
                                           data-[state=active]:bg-transparent
                                           data-[state=active]:shadow-none
                                           text-xs text-muted-foreground
                                           data-[state=active]:text-foreground"
                            >
                                {t.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>
            </div>

            {/* ── List ── */}
            <ScrollArea className="flex-1 min-h-0">
                <div className="flex flex-col gap-2 p-3">
                    {isLoading ? (
                        Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="bg-card border border-border rounded-xl p-3 space-y-2">
                                <Skeleton className="h-4 w-14" />
                                <Skeleton className="h-3.5 w-full" />
                                <div className="flex justify-between">
                                    <Skeleton className="h-3 w-10" />
                                    <Skeleton className="h-3 w-24" />
                                </div>
                                <Skeleton className="h-7 w-full" />
                            </div>
                        ))
                    ) : filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                            <DatabaseIcon size={28} className="text-muted-foreground/40" />
                            <p className="text-sm font-medium text-foreground">No backups found</p>
                            <p className="text-xs text-muted-foreground max-w-[22ch] leading-relaxed">
                                No {typeFilter === "all" ? "" : typeFilter + " "}backups are available.
                            </p>
                        </div>
                    ) : (
                        filtered.map((b) => (
                            <div
                                key={b.name}
                                className={`
                                    group bg-card border border-border rounded-xl p-3 space-y-2
                                    transition-all duration-150
                                    hover:border-primary/30 hover:shadow-sm
                                    ${!serverRunning ? "opacity-50" : ""}
                                `}
                            >
                                <Badge
                                    variant={(TYPE_BADGE_VARIANT[b.type] ?? "secondary") as any}
                                    className="text-[10px] uppercase tracking-wider px-2 py-0.5 font-semibold"
                                >
                                    {b.type}
                                </Badge>

                                <p className="font-mono text-xs leading-snug text-foreground truncate">
                                    {b.name}
                                </p>

                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                    <span>{readableSize(b.size_bytes)}</span>
                                    <span>{formatLocal(b.timestamp)}</span>
                                </div>

                                <Button
                                    size="sm"
                                    variant="ghost"
                                    disabled={!serverRunning}
                                    onClick={() => openRestore(b)}
                                    className="w-full h-7 text-xs justify-center border border-border text-muted-foreground
                                               hover:text-foreground hover:border-primary/40 hover:bg-primary/5"
                                >
                                    <ArrowCounterClockwiseIcon size={12} className="mr-1" />
                                    Restore
                                </Button>
                            </div>
                        ))
                    )}
                </div>
            </ScrollArea>

            {/* ── Dialog ── */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Restore Backup</DialogTitle>
                        <DialogDescription className="sr-only">
                            Confirm world backup restoration
                        </DialogDescription>
                    </DialogHeader>

                    {/* Selected backup chip */}
                    {selected && (
                        <div className="flex items-center gap-2 bg-muted/60 border border-border rounded-lg px-3 py-2 font-mono text-xs text-foreground">
                            <DatabaseIcon size={12} className="text-muted-foreground flex-shrink-0" />
                            <span className="truncate">{selected.name}</span>
                        </div>
                    )}

                    {/* Warning box */}
                    <div className="bg-warning/8 border border-warning/20 rounded-lg p-3 space-y-2">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-warning">
                            <WarningIcon size={13} weight="fill" />
                            Destructive action
                        </div>
                        <ul className="space-y-1 pl-4 list-disc">
                            <li className="text-xs text-muted-foreground">
                                All world progress since this backup will be permanently erased.
                            </li>
                            <li className="text-xs text-muted-foreground">
                                A safety backup of the current state is created before restoring.
                            </li>
                            <li className="text-xs text-muted-foreground">
                                The server will be briefly unavailable during the process.
                            </li>
                        </ul>
                    </div>

                    {/* Checkbox */}
                    <div className="flex items-start gap-2.5">
                        <Checkbox
                            id="confirm-restore"
                            checked={checkboxChecked}
                            onCheckedChange={(v) => setCheckboxChecked(!!v)}
                            className="mt-0.5"
                        />
                        <label
                            htmlFor="confirm-restore"
                            className="text-xs text-muted-foreground leading-relaxed cursor-pointer"
                        >
                            I understand this will replace the current world and cannot be undone.
                        </label>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDialogOpen(false)}
                            disabled={restoring}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            size="sm"
                            disabled={!checkboxChecked || restoring}
                            onClick={doRestore}
                        >
                            <ArrowCounterClockwiseIcon size={13} className="mr-1" />
                            {restoring ? "Restoring…" : "Restore Backup"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}