import { useMemo, useState } from "react";
import { MagnifyingGlassIcon, XIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QuestPlayerRow } from "./quest-player-row";
import { AddPlayerDialog } from "./add-player-dialog";
import { isProgressFinished } from "@/lib/quest-lifecycle";
import type { PreviewPlayer } from "@/lib/quest-progress-preview";
import type { QuestOut } from "@/api/nexuscore/model";

type PlayerFilter = "all" | "in_progress" | "finished";

const FILTERS: { value: PlayerFilter; label: string }[] = [
    { value: "all", label: "All" },
    { value: "in_progress", label: "In progress" },
    { value: "finished", label: "Finished" },
];

interface PlayerGroupProps {
    quest: QuestOut;
    title: string;
    players: PreviewPlayer[];
    empty: string;
}

function PlayerGroup({ quest, title, players, empty }: PlayerGroupProps) {
    return (
        <section data-slot="player-group" className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
                <h2 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">{title}</h2>
                <span className="text-[11px] tabular-nums text-muted-foreground/70">{players.length}</span>
            </div>

            {players.length === 0 ? (
                <p className="rounded-lg border border-dashed px-4 py-6 text-sm font-light text-muted-foreground">{empty}</p>
            ) : (
                <div className="divide-y overflow-hidden rounded-lg border bg-card">
                    {players.map((player) => (
                        <QuestPlayerRow key={player.thorny_id} quest={quest} player={player} />
                    ))}
                </div>
            )}
        </section>
    );
}

function matchesPlayer(player: PreviewPlayer, needle: string): boolean {
    return (
        player.username.toLowerCase().includes(needle) ||
        (player.gamertag ?? "").toLowerCase().includes(needle) ||
        `${player.thorny_id}` === needle
    );
}

interface QuestPlayersProps {
    quest: QuestOut;
    players: PreviewPlayer[];
}

/** The hub's people: find a player, narrow to who's working on it or done, and add someone. */
export function QuestPlayers({ quest, players }: QuestPlayersProps) {
    const [query, setQuery] = useState("");
    const [filter, setFilter] = useState<PlayerFilter>("all");

    const needle = query.trim().toLowerCase();
    const { inProgress, finished } = useMemo(() => {
        const matched = needle ? players.filter((player) => matchesPlayer(player, needle)) : players;
        return {
            inProgress: matched.filter((player) => !isProgressFinished(player.progress.status)),
            finished: matched.filter((player) => isProgressFinished(player.progress.status)),
        };
    }, [players, needle]);

    const counts: Record<PlayerFilter, number> = {
        all: inProgress.length + finished.length,
        in_progress: inProgress.length,
        finished: finished.length,
    };

    return (
        <div data-slot="quest-players" className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center gap-2">
                <InputGroup className="min-w-0 flex-1 sm:max-w-xs">
                    <InputGroupInput
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        onKeyDown={(event) => {
                            if (event.key === "Escape") setQuery("");
                        }}
                        placeholder="Search players"
                        aria-label="Search players"
                    />
                    <InputGroupAddon>
                        <MagnifyingGlassIcon />
                    </InputGroupAddon>
                    {query && (
                        <InputGroupAddon align="inline-end">
                            <Button variant="ghost" size="icon-sm" className="size-6" onClick={() => setQuery("")}>
                                <XIcon />
                                <span className="sr-only">Clear search</span>
                            </Button>
                        </InputGroupAddon>
                    )}
                </InputGroup>

                <Tabs value={filter} onValueChange={(value) => setFilter(value as PlayerFilter)} className="min-w-0">
                    <TabsList className="max-w-full overflow-x-auto scrollbar-hide">
                        {FILTERS.map(({ value, label }) => (
                            <TabsTrigger key={value} value={value} className="gap-1.5 px-2.5">
                                {label}
                                <span className="text-xs font-normal tabular-nums text-muted-foreground">{counts[value]}</span>
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>

                <div className="ml-auto">
                    <AddPlayerDialog quest={quest} />
                </div>
            </div>

            {needle && counts.all === 0 ? (
                <div className="flex flex-col items-start gap-2 rounded-lg border border-dashed px-4 py-6">
                    <p className="text-sm font-light text-muted-foreground">No players match “{query.trim()}”.</p>
                    <Button variant="outline" size="xs" onClick={() => setQuery("")}>
                        Clear search
                    </Button>
                </div>
            ) : (
                <>
                    {filter !== "finished" && (
                        <PlayerGroup
                            quest={quest}
                            title="In progress"
                            players={inProgress}
                            empty={needle ? "No in-progress players match." : "Nobody is working on this quest right now."}
                        />
                    )}
                    {filter !== "in_progress" && (
                        <PlayerGroup
                            quest={quest}
                            title="Finished"
                            players={finished}
                            empty={needle ? "No finished players match." : "Nobody has finished this quest yet."}
                        />
                    )}
                </>
            )}
        </div>
    );
}
