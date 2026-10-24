import { formatDate } from "date-fns";
import { Badge } from "@/components/ui/badge";
import type { QuestOut, RewardOut } from "@/api/nexuscore/model";

function describeReward(reward: RewardOut) {
    if (reward.balance != null) return `${reward.balance.toLocaleString()} balance`;
    const name = reward.display_name ?? reward.item ?? "Item";
    return reward.count && reward.count > 1 ? `${reward.count}× ${name}` : name;
}

function Meta({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-0.5">
            <dt className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">{label}</dt>
            <dd className="text-sm tabular-nums">{children}</dd>
        </div>
    );
}

/**
 * What the quest *is*, as configured: objectives with their rewards, plus the
 * facts that don't appear in the header. Flat rows, no nested cards.
 */
export function QuestDetailsTab({ quest }: { quest: QuestOut }) {
    const objectives = [...quest.objectives].sort((a, b) => a.order_index - b.order_index);

    return (
        <div className="grid gap-x-12 gap-y-8 lg:grid-cols-[minmax(0,1fr)_16rem]">
            <section className="flex flex-col gap-2">
                <h2 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    Objectives <span className="tabular-nums text-muted-foreground/70">{objectives.length}</span>
                </h2>
                {objectives.length === 0 ? (
                    <p className="py-6 text-sm font-light text-muted-foreground">
                        This quest has no objectives yet. Add some in the editor.
                    </p>
                ) : (
                    <ol className="divide-y border-y">
                        {objectives.map((obj) => (
                            <li key={obj.objective_id} className="flex gap-4 py-3">
                                <span className="w-5 shrink-0 pt-0.5 text-right text-xs tabular-nums text-muted-foreground">
                                    {obj.order_index + 1}
                                </span>
                                <div className="flex min-w-0 flex-1 flex-col gap-1">
                                    <p className="text-sm leading-snug">{obj.description}</p>
                                    <p className="text-xs capitalize text-muted-foreground">
                                        {obj.objective_type}
                                        {obj.target_count ? ` · ${obj.target_count}` : ""}
                                    </p>
                                    {obj.rewards?.length > 0 && (
                                        <p className="text-xs text-muted-foreground">
                                            <span className="font-medium text-foreground">Rewards:</span>{" "}
                                            {obj.rewards.map(describeReward).join(", ")}
                                        </p>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ol>
                )}
            </section>

            <dl className="flex flex-col gap-4 self-start">
                <Meta label="Starts">{formatDate(new Date(quest.start_time), "MMM d, yyyy 'at' h:mmaaa")}</Meta>
                <Meta label="Ends">{formatDate(new Date(quest.end_time), "MMM d, yyyy 'at' h:mmaaa")}</Meta>
                <Meta label="Tags">
                    {quest.tags.length > 0 ? (
                        <span className="flex flex-wrap gap-1">
                            {quest.tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="font-normal">{tag}</Badge>
                            ))}
                        </span>
                    ) : (
                        <span className="text-muted-foreground">None</span>
                    )}
                </Meta>
                <Meta label="Created by">{quest.created_by?.username ?? "Unknown"}</Meta>
                <Meta label="Quest ID">#{quest.quest_id}</Meta>
            </dl>
        </div>
    );
}
