import { Link } from "@tanstack/react-router";
import { CaretRightIcon } from "@phosphor-icons/react";
import { Progress } from "@/components/ui/progress";
import { PlayerAvatar } from "./player-avatar";
import { ProgressStatus } from "./quest-progress-status";
import type { PreviewPlayer } from "@/lib/quest-progress-preview";
import type { QuestOut } from "@/api/nexuscore/model";

interface QuestPlayerRowProps {
    quest: QuestOut;
    player: PreviewPlayer;
}

/** One player in a hub list. The whole row opens their progress editor. */
export function QuestPlayerRow({ quest, player }: QuestPlayerRowProps) {
    const objectives = [...quest.objectives].sort((a, b) => a.order_index - b.order_index);
    const total = objectives.length;
    const completed = player.progress.objectives.filter((objective) => objective.status === "completed").length;
    const currentProgress =
        player.progress.objectives.find((objective) => objective.status === "active") ??
        player.progress.objectives.find((objective) => objective.status === "failed");
    const currentObjective = currentProgress
        ? objectives.find((objective) => objective.objective_id === currentProgress.objective_id)
        : null;
    const percent = total === 0 ? 0 : (completed / total) * 100;

    return (
        <Link
            to="/admin/quests/$id/users/$thornyId"
            params={{ id: `${quest.quest_id}`, thornyId: `${player.thorny_id}` }}
            className="group flex items-center gap-3 px-4 py-3 outline-none transition-colors hover:bg-muted/40 focus-visible:bg-muted/40"
        >
            <PlayerAvatar name={player.username} />

            <div className="flex min-w-0 flex-1 flex-col gap-1">
                <div className="flex items-baseline gap-2">
                    <span className="truncate text-sm font-medium">{player.username}</span>
                    {player.gamertag && (
                        <span className="truncate text-[11px] text-muted-foreground">{player.gamertag}</span>
                    )}
                </div>

                <div className="flex min-w-0 items-center gap-2">
                    <Progress value={percent} className="h-1 w-20 shrink-0" />
                    <span className="shrink-0 text-[11px] tabular-nums text-muted-foreground">
                        {completed}/{total}
                    </span>
                    {currentObjective && (
                        <span className="truncate text-[11px] text-muted-foreground">
                            · {currentObjective.description}
                        </span>
                    )}
                </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
                <ProgressStatus status={player.progress.status} />
                <CaretRightIcon
                    className="size-3.5 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5"
                    weight="bold"
                />
            </div>
        </Link>
    );
}
