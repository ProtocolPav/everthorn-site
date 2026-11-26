import { QuestPlayerRow } from "./quest-player-row";
import { AddPlayerDialog } from "./add-player-dialog";
import type { PreviewPlayer } from "@/lib/quest-progress-preview";
import type { QuestOut } from "@/api/nexuscore/model";

interface PlayerGroupProps {
    quest: QuestOut;
    title: string;
    players: PreviewPlayer[];
    empty: string;
    action?: React.ReactNode;
}

function PlayerGroup({ quest, title, players, empty, action }: PlayerGroupProps) {
    return (
        <section className="flex flex-col gap-2">
            <div className="flex min-h-8 items-center gap-2">
                <h2 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">{title}</h2>
                <span className="text-[11px] tabular-nums text-muted-foreground/70">{players.length}</span>
                {action && <div className="ml-auto">{action}</div>}
            </div>

            {players.length === 0 ? (
                <p className="border-y py-6 text-sm font-light text-muted-foreground">{empty}</p>
            ) : (
                <div className="divide-y border-y">
                    {players.map((player) => (
                        <QuestPlayerRow key={player.thorny_id} quest={quest} player={player} />
                    ))}
                </div>
            )}
        </section>
    );
}

interface QuestPlayersProps {
    quest: QuestOut;
    inProgress: PreviewPlayer[];
    finished: PreviewPlayer[];
}

/** The hub's people: who's working on it, and who's done. */
export function QuestPlayers({ quest, inProgress, finished }: QuestPlayersProps) {
    return (
        <div className="flex flex-col gap-8">
            <PlayerGroup
                quest={quest}
                title="In progress"
                players={inProgress}
                empty="Nobody is working on this quest right now."
                action={<AddPlayerDialog quest={quest} />}
            />
            <PlayerGroup
                quest={quest}
                title="Finished"
                players={finished}
                empty="Nobody has finished this quest yet."
            />
        </div>
    );
}
