import { formatDate } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { QuestTypeBadge } from "@/components/features/quests/quest-type-badge";
import type { QuestOut } from "@/api/nexuscore/model";

function Meta({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-0.5">
            <dt className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">{label}</dt>
            <dd className="text-sm tabular-nums">{children}</dd>
        </div>
    );
}

/** The quest's configuration, at a glance, plus its objective outline. */
export function QuestGlance({ quest }: { quest: QuestOut }) {
    const objectives = [...quest.objectives].sort((a, b) => a.order_index - b.order_index);

    return (
        <div className="flex flex-col gap-8">
            <section className="flex flex-col gap-3">
                <h2 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">At a glance</h2>
                <dl className="flex flex-col gap-3">
                    <Meta label="Starts">{formatDate(new Date(quest.start_time), "MMM d, yyyy 'at' h:mmaaa")}</Meta>
                    <Meta label="Ends">{formatDate(new Date(quest.end_time), "MMM d, yyyy 'at' h:mmaaa")}</Meta>
                    <Meta label="Type">
                        <QuestTypeBadge type={quest.quest_type} />
                    </Meta>
                    <Meta label="Created by">{quest.created_by?.username ?? "Unknown"}</Meta>
                    <Meta label="Tags">
                        {quest.tags.length > 0 ? (
                            <span className="flex flex-wrap gap-1">
                                {quest.tags.map((tag) => (
                                    <Badge key={tag} variant="secondary" className="font-normal">
                                        {tag}
                                    </Badge>
                                ))}
                            </span>
                        ) : (
                            <span className="text-muted-foreground">None</span>
                        )}
                    </Meta>
                    <Meta label="Quest ID">#{quest.quest_id}</Meta>
                </dl>
            </section>

            <section className="flex flex-col gap-2">
                <h2 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    Objectives <span className="tabular-nums text-muted-foreground/70">{objectives.length}</span>
                </h2>
                {objectives.length === 0 ? (
                    <p className="py-4 text-sm font-light text-muted-foreground">No objectives configured.</p>
                ) : (
                    <ol className="divide-y border-y">
                        {objectives.map((objective, index) => (
                            <li key={objective.objective_id} className="flex gap-3 py-2.5">
                                <span className="w-4 shrink-0 pt-0.5 text-right text-[11px] tabular-nums text-muted-foreground">
                                    {index + 1}
                                </span>
                                <div className="flex min-w-0 flex-col gap-0.5">
                                    <span className="text-sm leading-snug">{objective.description}</span>
                                    <span className="text-[11px] capitalize text-muted-foreground">
                                        {objective.objective_type}
                                        {objective.target_count ? ` · ${objective.target_count}` : ""}
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ol>
                )}
            </section>
        </div>
    );
}
