import { useState } from "react";
import { toast } from "sonner";
import { MagnifyingGlassIcon, PlusIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { PlayerAvatar } from "./player-avatar";
import { getPreviewCandidates } from "@/lib/quest-progress-preview";
import type { QuestOut } from "@/api/nexuscore/model";

/** Placeholder enrol flow — no API exists to add a player to a quest yet. */
export function AddPlayerDialog({ quest }: { quest: QuestOut }) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");

    const needle = query.trim().toLowerCase();
    const candidates = getPreviewCandidates(quest).filter(
        (person) =>
            !needle ||
            person.username.toLowerCase().includes(needle) ||
            (person.gamertag ?? "").toLowerCase().includes(needle),
    );

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="xs">
                    <PlusIcon />
                    Add player
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Add a player</DialogTitle>
                    <DialogDescription>
                        Preview only — there's no endpoint to enrol a player in a quest yet.
                    </DialogDescription>
                </DialogHeader>

                <div className="relative">
                    <MagnifyingGlassIcon className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Search players…"
                        className="pl-8"
                    />
                </div>

                <div className="flex max-h-64 flex-col divide-y overflow-y-auto rounded-md border">
                    {candidates.length === 0 ? (
                        <p className="px-3 py-6 text-center text-sm text-muted-foreground">No players match.</p>
                    ) : (
                        candidates.map((person) => (
                            <div key={person.thorny_id} className="flex items-center gap-3 px-3 py-2">
                                <PlayerAvatar name={person.username} />
                                <div className="flex min-w-0 flex-1 flex-col">
                                    <span className="truncate text-sm font-medium">{person.username}</span>
                                    {person.gamertag && (
                                        <span className="truncate text-[11px] text-muted-foreground">
                                            {person.gamertag}
                                        </span>
                                    )}
                                </div>
                                <Button
                                    size="xs"
                                    variant="ghost"
                                    onClick={() => {
                                        toast.success(
                                            `Preview: ${person.username} would be added to "${quest.title}"`,
                                        );
                                        setOpen(false);
                                    }}
                                >
                                    Add
                                </Button>
                            </div>
                        ))
                    )}
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" size="sm">
                            Close
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
