import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useBackups, Backup } from "@/hooks/use-backups";
import { ArchiveRestore, DownloadIcon } from "lucide-react";

function readableSize(bytes: number) {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes/1024).toFixed(1)} KB`;
    return `${(bytes/1024/1024).toFixed(2)} MB`;
}
function formatLocal(utc: string) {
    return new Date(utc).toLocaleString();
}
function shortName(name: string) {
    return name.split("_")[0];
}

const backupTypes = [
    { value: "all", label: "All" },
    { value: "hourly", label: "Hourly" },
    { value: "daily", label: "Daily" },
    { value: "monthly", label: "Monthly" }
];

export default function BackupsList({ serverRunning }: { serverRunning: boolean }) {
    const { backups, isLoading } = useBackups();
    const [selected, setSelected] = useState<Backup | null>(null);
    const [confirm1, setConfirm1] = useState(false);
    const [confirm2, setConfirm2] = useState(false);
    const [restoreInput, setRestoreInput] = useState("");
    const [restoring, setRestoring] = useState(false);
    const [typeFilter, setTypeFilter] = useState("all");

    const sorted = useMemo(() =>
        (backups ?? []).slice().sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()), [backups]);
    const filtered = typeFilter === "all" ? sorted : sorted.filter(b => b.type === typeFilter);

    function openRestore(b: Backup) {
        if (!serverRunning) return;
        setSelected(b);
        setConfirm1(true);
    }
    function proceedRestore() {
        setConfirm1(false); setConfirm2(true); setRestoreInput("");
    }
    async function doRestore() {
        if (!selected) return;
        setRestoring(true);
        await fetch("/amethyst/backups/restore", {
            method: "POST",
            body: JSON.stringify({ full_path: selected.full_path, restore_type: 'full' }),
            headers: { "Content-Type": "application/json" }
        });
        setRestoring(false); setConfirm2(false); setSelected(null);
    }

    return (
        <Card className="w-full flex-1 p-0 rounded-xl bg-card/80 flex flex-col">
            <div className="px-6 pt-6 pb-3 flex items-center justify-between">
                <span className="text-base font-semibold">World Backups</span>
                <Tabs value={typeFilter} onValueChange={setTypeFilter}>
                    <TabsList className="bg-transparent gap-1 p-0">
                        {backupTypes.map(t => (
                            <TabsTrigger key={t.value} value={t.value} className="rounded px-3 py-1 text-xs font-medium data-[state=active]:bg-muted data-[state=active]:text-foreground">
                                {t.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>
            </div>
            <ScrollArea className="flex-1 h-20 px-0 pb-3">
                <div className="flex flex-col gap-3 px-4">
                    {isLoading ? (
                        Array.from({length:5}).map((_,i) => (
                            <Card key={i} className="p-4 flex flex-col gap-2 border rounded-lg bg-card/60">
                                <Skeleton className="w-32 h-5 rounded" />
                                <Skeleton className="w-40 h-4 rounded" />
                                <Skeleton className="w-14 h-6 rounded" />
                            </Card>
                        ))
                    ) : filtered.length === 0 ? (
                        <div className="h-32 flex items-center justify-center text-muted-foreground text-sm select-none">
                            No {typeFilter === "all" ? "" : typeFilter} backups found.
                        </div>
                    ) : (
                        filtered.map(b => (
                            <Card
                                key={b.name}
                                className={`flex flex-row items-center justify-between p-4 border rounded-lg bg-card/70 hover:bg-accent/40 hover:border-primary/20 cursor-pointer group transition
                  ${serverRunning ? "" : "pointer-events-none opacity-50"}`}
                                onClick={() => openRestore(b)}
                            >
                                <div className="flex flex-row gap-5 items-center">
                                    {/* Short name badge */}
                                    <span className="text-sm font-semibold px-3 py-1 rounded bg-muted/60 text-foreground">{shortName(b.name)}</span>
                                    {/* Type badge */}
                                    <span className={
                                        `flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
                    ${b.type === "hourly" ? "bg-blue-100 text-blue-600"
                                            : b.type === "daily" ? "bg-yellow-100 text-yellow-600"
                                                : b.type === "monthly" ? "bg-purple-100 text-purple-700"
                                                    : "bg-muted/40"}`
                                    }>
                    <ArchiveRestore className="w-4 h-4" />
                                        {b.type.charAt(0).toUpperCase() + b.type.slice(1)}
                  </span>
                                    {/* Time */}
                                    <span className="text-xs text-foreground font-mono">{formatLocal(b.timestamp)}</span>
                                    {/* Size */}
                                    <span className="text-xs text-muted-foreground">{readableSize(b.size_bytes)}</span>
                                </div>
                                {/* Restore button */}
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="rounded-full border group-hover:bg-blue-50 group-hover:text-blue-600 transition"
                                    disabled={!serverRunning}
                                    onClick={e => { e.stopPropagation(); openRestore(b); }}
                                >
                                    <DownloadIcon className="w-5 h-5" />
                                </Button>
                            </Card>
                        ))
                    )}
                </div>
            </ScrollArea>
            {/* First Dialog */}
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
            {/* Second Dialog */}
            <Dialog open={confirm2} onOpenChange={setConfirm2}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Type <span className="font-mono px-2 bg-muted tracking-wider rounded">RESTORE</span> to confirm</DialogTitle>
                        <DialogDescription>
                            This action will begin restoring the backup and overwrite the world.
                        </DialogDescription>
                    </DialogHeader>
                    <Input
                        autoFocus
                        value={restoreInput}
                        onChange={e => setRestoreInput(e.target.value)}
                        placeholder="RESTORE"
                        className="mt-2 text-center uppercase tracking-wider"
                    />
                    <DialogFooter>
                        <Button
                            variant="destructive"
                            disabled={restoreInput !== "RESTORE" || restoring}
                            onClick={doRestore}
                        >
                            {restoring ? "Restoring…" : "Restore"}
                        </Button>
                        <Button variant="outline" onClick={() => setConfirm2(false)} disabled={restoring}>Cancel</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    );
}
