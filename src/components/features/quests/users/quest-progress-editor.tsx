import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { formatDate } from "date-fns";
import {
    ArrowCounterClockwiseIcon,
    CaretDownIcon,
    CheckCircleIcon,
    CheckIcon,
    MinusIcon,
    PlusIcon,
    SkipForwardIcon,
    TrashIcon,
    XCircleIcon,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { PlayerAvatar } from "@/components/features/quests/hub/player-avatar";
import { PreviewNotice } from "@/components/features/quests/hub/preview-notice";
import { ProgressStatus } from "@/components/features/quests/hub/quest-progress-status";
import { cn } from "@/lib/utils";
import type {
    ObjectiveOut,
    ObjectiveProgressOut,
    ObjectiveProgressOutStatus,
    QuestOut,
    QuestProgressOut,
    QuestProgressOutStatus,
} from "@/api/nexuscore/model";
import type { PreviewPlayer } from "@/lib/quest-progress-preview";

const STATUS_OPTIONS: QuestProgressOutStatus[] = ["pending", "active", "completed", "failed"];

function targetLabel(target: ObjectiveOut["targets"][number]): string {
    switch (target.target_type) {
        case "kill":
            return target.entity;
        case "mine":
            return target.block;
        case "scriptevent":
            return target.script_id;
        case "visit":
            return target.helper_text;
    }
}

function completeTargets(
    questObjective: ObjectiveOut | undefined,
    progressObjective: ObjectiveProgressOut,
): ObjectiveProgressOut["target_progress"] {
    if (!questObjective) return progressObjective.target_progress;

    return progressObjective.target_progress.map((targetProgress, index) => {
        const target = questObjective.targets[index];
        if (!target) return targetProgress;

        if (targetProgress.target_type === "visit" && target.target_type === "visit") {
            return { ...targetProgress, count: target.count, seconds: target.seconds ?? targetProgress.seconds ?? 0 };
        }
        if (targetProgress.target_type !== "visit") {
            return { ...targetProgress, count: target.count };
        }
        return targetProgress;
    });
}

function resetTargets(progressObjective: ObjectiveProgressOut): ObjectiveProgressOut["target_progress"] {
    return progressObjective.target_progress.map((targetProgress) => {
        if (targetProgress.target_type === "visit") {
            return { ...targetProgress, count: 0, seconds: 0 };
        }
        return { ...targetProgress, count: 0 };
    });
}

function StatusControl({
    value,
    onChange,
}: {
    value: QuestProgressOutStatus;
    onChange: (value: QuestProgressOutStatus) => void;
}) {
    return (
        <div className="inline-flex items-center gap-0.5 rounded-md border p-0.5">
            {STATUS_OPTIONS.map((option) => (
                <Button
                    key={option}
                    type="button"
                    size="xs"
                    variant="ghost"
                    aria-pressed={value === option}
                    className={cn(
                        "h-6 capitalize",
                        value === option && "bg-foreground text-background hover:bg-foreground/90 hover:text-background",
                    )}
                    onClick={() => onChange(option)}
                >
                    {option}
                </Button>
            ))}
        </div>
    );
}

function Stepper({
    value,
    max,
    onChange,
    label,
}: {
    value: number;
    max: number;
    onChange: (value: number) => void;
    label: string;
}) {
    return (
        <div className="flex items-center gap-1">
            <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                onClick={() => onChange(Math.max(0, value - 1))}
                disabled={value <= 0}
                aria-label={`Decrease ${label}`}
            >
                <MinusIcon />
            </Button>
            <span className="w-12 text-center text-[11px] tabular-nums">
                {value}/{max}
            </span>
            <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                onClick={() => onChange(Math.min(max, value + 1))}
                disabled={value >= max}
                aria-label={`Increase ${label}`}
            >
                <PlusIcon />
            </Button>
        </div>
    );
}

function ObjectiveStatusMenu({
    status,
    onChange,
}: {
    status: ObjectiveProgressOutStatus;
    onChange: (status: ObjectiveProgressOutStatus) => void;
}) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="xs" className="gap-1.5">
                    <ProgressStatus status={status} />
                    <CaretDownIcon className="size-3 text-muted-foreground" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {STATUS_OPTIONS.map((option) => (
                    <DropdownMenuItem key={option} onClick={() => onChange(option)}>
                        <ProgressStatus status={option} />
                        {option === status && <CheckIcon className="ml-auto size-3.5" />}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

function Meta({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-0.5">
            <dt className="text-[10px] font-medium uppercase tracking-[0.08em] text-muted-foreground">{label}</dt>
            <dd className="text-[11px] tabular-nums">{children}</dd>
        </div>
    );
}

interface QuestProgressEditorProps {
    quest: QuestOut;
    player: PreviewPlayer;
}

/**
 * A local editor for the QuestProgressOut shape: quest status, objective
 * statuses, target counts and customization progress. Everything is preview
 * state — the write endpoints exist but aren't wired here yet.
 */
export function QuestProgressEditor({ quest, player }: QuestProgressEditorProps) {
    const navigate = useNavigate();
    const [progress, setProgress] = useState<QuestProgressOut>(player.progress);

    const questObjectives = useMemo(
        () => [...quest.objectives].sort((a, b) => a.order_index - b.order_index),
        [quest.objectives],
    );
    const orderedIds = useMemo(() => questObjectives.map((objective) => objective.objective_id), [questObjectives]);
    const progressById = useMemo(
        () => new Map(progress.objectives.map((objective) => [objective.objective_id, objective])),
        [progress.objectives],
    );

    const total = questObjectives.length;
    const completedCount = progress.objectives.filter((objective) => objective.status === "completed").length;
    const percent = total === 0 ? 0 : (completedCount / total) * 100;

    function setQuestStatus(status: QuestProgressOutStatus) {
        setProgress((current) => ({ ...current, status }));
    }

    function setObjectiveStatus(objectiveId: number, status: ObjectiveProgressOutStatus) {
        const now = new Date().toISOString();
        setProgress((current) => ({
            ...current,
            objectives: current.objectives.map((objective) => {
                if (objective.objective_id !== objectiveId) return objective;
                return {
                    ...objective,
                    status,
                    start_time: status === "pending" ? null : (objective.start_time ?? now),
                    end_time: status === "completed" || status === "failed" ? now : null,
                };
            }),
        }));
    }

    function setTargetCount(objectiveId: number, targetIndex: number, count: number) {
        setProgress((current) => ({
            ...current,
            objectives: current.objectives.map((objective) => {
                if (objective.objective_id !== objectiveId) return objective;
                return {
                    ...objective,
                    target_progress: objective.target_progress.map((targetProgress, index) =>
                        index === targetIndex ? { ...targetProgress, count: Math.max(0, count) } : targetProgress,
                    ),
                };
            }),
        }));
    }

    function setDeaths(objectiveId: number, deaths: number) {
        setProgress((current) => ({
            ...current,
            objectives: current.objectives.map((objective) => {
                if (objective.objective_id !== objectiveId) return objective;
                return {
                    ...objective,
                    customization_progress: {
                        ...objective.customization_progress,
                        maximum_deaths: { deaths: Math.max(0, deaths) },
                    },
                };
            }),
        }));
    }

    function advance() {
        setProgress((current) => {
            const byId = new Map(current.objectives.map((objective) => [objective.objective_id, objective]));
            const now = new Date().toISOString();

            const activeIndex = orderedIds.findIndex((id) => byId.get(id)?.status === "active");

            // Nothing started yet: begin the first pending objective.
            if (activeIndex < 0) {
                const pendingIndex = orderedIds.findIndex((id) => byId.get(id)?.status === "pending");
                if (pendingIndex < 0) return current;

                const pendingId = orderedIds[pendingIndex];
                return {
                    ...current,
                    status: "active",
                    start_time: current.start_time ?? now,
                    objectives: current.objectives.map((objective) =>
                        objective.objective_id === pendingId
                            ? { ...objective, status: "active" as const, start_time: now }
                            : objective,
                    ),
                };
            }

            const objectives = current.objectives.map((objective) => {
                const order = orderedIds.indexOf(objective.objective_id);
                if (order === activeIndex) {
                    return {
                        ...objective,
                        status: "completed" as const,
                        end_time: now,
                        target_progress: completeTargets(questObjectives[order], objective),
                    };
                }
                if (order === activeIndex + 1) {
                    return { ...objective, status: "active" as const, start_time: now };
                }
                return objective;
            });

            const allCompleted = objectives.every((objective) => objective.status === "completed");
            return {
                ...current,
                objectives,
                status: allCompleted ? "completed" : "active",
                start_time: current.start_time ?? now,
                end_time: allCompleted ? now : current.end_time,
            };
        });
    }

    function rollback() {
        setProgress((current) => {
            const byId = new Map(current.objectives.map((objective) => [objective.objective_id, objective]));
            let index = -1;
            for (let i = orderedIds.length - 1; i >= 0; i -= 1) {
                if (byId.get(orderedIds[i])?.status === "completed") {
                    index = i;
                    break;
                }
            }
            if (index < 0) return current;

            const objectives = current.objectives.map((objective) => {
                const order = orderedIds.indexOf(objective.objective_id);
                if (order === index) return { ...objective, status: "active" as const, end_time: null };
                if (order > index) {
                    return {
                        ...objective,
                        status: "pending" as const,
                        start_time: null,
                        end_time: null,
                        target_progress: resetTargets(objective),
                    };
                }
                return objective;
            });

            return { ...current, objectives, status: "active", end_time: null };
        });
    }

    function markComplete() {
        const now = new Date().toISOString();
        setProgress((current) => ({
            ...current,
            status: "completed",
            start_time: current.start_time ?? now,
            end_time: now,
            objectives: current.objectives.map((objective) => ({
                ...objective,
                status: "completed" as const,
                start_time: objective.start_time ?? now,
                end_time: now,
                target_progress: completeTargets(
                    questObjectives[orderedIds.indexOf(objective.objective_id)],
                    objective,
                ),
            })),
        }));
    }

    function failQuest() {
        const now = new Date().toISOString();
        setProgress((current) => ({
            ...current,
            status: "failed",
            end_time: now,
            objectives: current.objectives.map((objective) =>
                objective.status === "active" ? { ...objective, status: "failed" as const, end_time: now } : objective,
            ),
        }));
    }

    function removeQuest() {
        toast.success(`Preview: quest removed from ${player.username}`);
        void navigate({ to: "/admin/quests/$id", params: { id: `${quest.quest_id}` } });
    }

    return (
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
            <PreviewNotice>
                Progress editing is preview-only. Changes stay in this tab and aren't saved — the QuestProgress API isn't
                wired here yet.
            </PreviewNotice>

            <section className="flex flex-col gap-4 rounded-xl border p-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <PlayerAvatar name={player.username} size="lg" />
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold">{player.username}</span>
                            <span className="text-[11px] text-muted-foreground">{player.gamertag ?? player.role}</span>
                        </div>
                    </div>
                    <StatusControl value={progress.status} onChange={setQuestStatus} />
                </div>

                <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                        <span className="text-muted-foreground">Quest progress</span>
                        <span className="tabular-nums">
                            {completedCount}/{total} objectives
                        </span>
                    </div>
                    <Progress value={percent} className="h-1.5" />
                </div>

                <dl className="grid grid-cols-3 gap-3">
                    <Meta label="Accepted">
                        {formatDate(new Date(progress.accept_time), "MMM d, h:mmaaa")}
                    </Meta>
                    <Meta label="Started">
                        {progress.start_time ? formatDate(new Date(progress.start_time), "MMM d, h:mmaaa") : "—"}
                    </Meta>
                    <Meta label="Finished">
                        {progress.end_time ? formatDate(new Date(progress.end_time), "MMM d, h:mmaaa") : "—"}
                    </Meta>
                </dl>

                <div className="flex flex-wrap items-center gap-1.5">
                    <Button size="sm" variant="outline" onClick={markComplete}>
                        <CheckCircleIcon />
                        Mark complete
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={failQuest}
                        className="text-rose-600 hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-400"
                    >
                        <XCircleIcon />
                        Fail quest
                    </Button>

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button
                                size="sm"
                                variant="ghost"
                                className="ml-auto text-rose-600 hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-400"
                            >
                                <TrashIcon />
                                Remove quest
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Remove quest from {player.username}?</DialogTitle>
                                <DialogDescription>
                                    This deletes their progress for this quest. Preview only — nothing is saved.
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline" size="sm">
                                        Cancel
                                    </Button>
                                </DialogClose>
                                <Button variant="destructive" size="sm" onClick={removeQuest}>
                                    Remove
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </section>

            <section className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-3">
                    <h2 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                        Objectives <span className="tabular-nums text-muted-foreground/70">{total}</span>
                    </h2>
                    <div className="flex items-center gap-1.5">
                        <Button size="sm" variant="outline" onClick={rollback}>
                            <ArrowCounterClockwiseIcon />
                            Roll back
                        </Button>
                        <Button size="sm" onClick={advance}>
                            <SkipForwardIcon />
                            Advance
                        </Button>
                    </div>
                </div>

                {total === 0 ? (
                    <p className="border-y py-6 text-sm font-light text-muted-foreground">
                        This quest has no objectives to track.
                    </p>
                ) : (
                    <div className="flex flex-col divide-y border-y">
                        {questObjectives.map((questObjective, index) => {
                            const progressObjective = progressById.get(questObjective.objective_id);
                            if (!progressObjective) return null;

                            return (
                                <div key={questObjective.objective_id} className="flex flex-col gap-2 py-3">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex min-w-0 gap-3">
                                            <span className="w-4 shrink-0 pt-0.5 text-right text-[11px] tabular-nums text-muted-foreground">
                                                {index + 1}
                                            </span>
                                            <div className="flex min-w-0 flex-col gap-0.5">
                                                <span className="text-sm leading-snug">{questObjective.description}</span>
                                                <span className="text-[11px] capitalize text-muted-foreground">
                                                    {questObjective.objective_type}
                                                </span>
                                            </div>
                                        </div>
                                        <ObjectiveStatusMenu
                                            status={progressObjective.status}
                                            onChange={(status) => setObjectiveStatus(questObjective.objective_id, status)}
                                        />
                                    </div>

                                    <div className="ml-7 flex flex-col gap-1.5">
                                        {questObjective.targets.map((target, targetIndex) => {
                                            const targetProgress = progressObjective.target_progress[targetIndex];
                                            return (
                                                <div key={targetIndex} className="flex items-center justify-between gap-3">
                                                    <span className="min-w-0 truncate text-[11px] text-muted-foreground">
                                                        {targetLabel(target)}
                                                    </span>
                                                    <Stepper
                                                        value={targetProgress?.count ?? 0}
                                                        max={target.count}
                                                        label={targetLabel(target)}
                                                        onChange={(value) =>
                                                            setTargetCount(questObjective.objective_id, targetIndex, value)
                                                        }
                                                    />
                                                </div>
                                            );
                                        })}

                                        {questObjective.customizations.maximum_deaths && (
                                            <div className="flex items-center justify-between gap-3">
                                                <span className="text-[11px] text-muted-foreground">
                                                    Deaths (max {questObjective.customizations.maximum_deaths.deaths})
                                                </span>
                                                <Stepper
                                                    value={progressObjective.customization_progress.maximum_deaths?.deaths ?? 0}
                                                    max={questObjective.customizations.maximum_deaths.deaths}
                                                    label="deaths"
                                                    onChange={(value) => setDeaths(questObjective.objective_id, value)}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>
        </div>
    );
}
