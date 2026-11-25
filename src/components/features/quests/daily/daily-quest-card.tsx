import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { formatDate } from "date-fns";
import { ChartBarIcon, ClockIcon, PencilSimpleIcon, StackIcon, TrophyIcon } from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { QuickLookSection } from "@/components/features/quests/fields/objective/quick-look.tsx";
import { ObjectiveSummary } from "@/components/features/quests/daily/objective-summary.tsx";
import { countQuestRewards, formatQuestDate } from "@/lib/daily-quests.ts";
import { formatDurationCompact, getQuestBoundary, getQuestLifecycle, getQuestUrgency } from "@/lib/quest-lifecycle.ts";
import { cn } from "@/lib/utils.ts";
import type { DailyQuestOut } from "@/api/nexuscore/model";

export type DailyCardVariant = "live" | "running" | "upcoming";

interface DailyQuestCardProps {
    daily: DailyQuestOut;
    variant: DailyCardVariant;
    /** Template name; `null` when the template was deleted, `undefined` when unknown (hidden). */
    templateName: string | null | undefined;
    /** Extra header badges (e.g. the edited flag). */
    badges?: ReactNode;
    /** Optional actions menu, shown in the header's top-right corner. */
    menu?: ReactNode;
}

const urgencyText = {
    none: "text-foreground",
    soon: "text-amber-600 dark:text-amber-400",
    imminent: "text-red-600 dark:text-red-400",
};

/** One day in the upcoming dailies list. Laid out like QuestCard. */
export function DailyQuestCard({ daily, variant, templateName, badges, menu }: DailyQuestCardProps) {
    const { quest } = daily;
    const id = `${quest.quest_id}`;
    const objective = [...quest.objectives].sort((a, b) => a.order_index - b.order_index)[0];
    const lifecycle = getQuestLifecycle(quest);
    const boundary = getQuestBoundary(quest, lifecycle);
    const urgency = getQuestUrgency(quest);
    const rewards = countQuestRewards(quest);

    return (
        <Card
            className={cn(
                "@container isolate group/card hover:shadow-sm hover:border-foreground/15 transition-[border-color,box-shadow] duration-200 p-0 gap-0 overflow-hidden relative h-full flex flex-col",
                variant === "running" && "opacity-75",
            )}
        >
            <Link
                to="/admin/quests/$id"
                params={{ id }}
                aria-label={`View ${quest.title} details`}
                className="card-link absolute inset-0 z-0 rounded-xl outline-none focus-visible:ring-[3px] focus-visible:ring-inset focus-visible:ring-ring/50"
            />

            <div className="px-2.5 py-1.5 bg-muted/30 backdrop-blur-sm border-b flex items-center justify-between shrink-0">
                <div className="flex gap-1.5 items-center min-w-0">
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0.5 font-semibold tracking-wide uppercase">
                        {formatQuestDate(daily.quest_date)}
                    </Badge>
                    {variant === "live" && (
                        <Badge variant="green" className="text-[10px] px-1.5 py-0.5 font-semibold tracking-wide">
                            Live
                        </Badge>
                    )}
                    {variant === "running" && (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0.5 font-semibold tracking-wide text-muted-foreground">
                            Still running
                        </Badge>
                    )}
                    {badges}
                </div>
                {menu ?? <div className="h-6 w-6 shrink-0" aria-hidden="true" />}
            </div>

            <CardContent className="p-2.5 flex flex-col flex-1">
                <h4 className="font-semibold text-sm leading-tight line-clamp-1 mb-1">{quest.title}</h4>

                <p className="text-xs leading-relaxed my-1.5 line-clamp-2">
                    {objective ? <ObjectiveSummary objective={objective} /> : <span className="text-muted-foreground">No objective</span>}
                </p>

                <div className="flex-1" />

                <div className="flex items-center gap-2 mb-2 min-h-4 text-muted-foreground">
                    {objective && (
                        <QuickLookSection
                            customizations={(objective.customizations ?? {}) as Record<string, Record<string, unknown> | null>}
                            rewardsCount={0}
                        />
                    )}
                </div>

                <div
                    className="flex items-center gap-1.5 mb-2 px-2 py-1 rounded bg-muted/30 border border-border/30"
                    title={formatDate(boundary, "LLL do yyyy 'at' h:mmaaa")}
                >
                    <ClockIcon
                        className={cn("h-3.5 w-3.5 shrink-0", urgency === "none" ? "text-muted-foreground" : urgencyText[urgency])}
                        weight="duotone"
                    />
                    <span className="text-[11px] text-muted-foreground">
                        {lifecycle === "expired" ? "Ended" : lifecycle === "scheduled" ? "Starts" : "Ends"}
                    </span>
                    <span className={cn("text-[11px] font-medium line-clamp-1", urgencyText[urgency])}>
                        {lifecycle === "expired"
                            ? formatDate(boundary, "LLL do yyyy")
                            : `in ${formatDurationCompact(boundary.getTime() - Date.now())}`}
                    </span>
                </div>

                <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-border/40">
                    <div className="flex min-w-0 items-center gap-2.5 text-[11px]">
                        {templateName !== undefined && (
                            <span className="flex min-w-0 items-center gap-1" title="Template">
                                <StackIcon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" weight="duotone" />
                                <span className={cn("truncate", templateName === null && "text-muted-foreground italic")}>
                                    {templateName ?? "Template deleted"}
                                </span>
                            </span>
                        )}
                        {rewards > 0 && (
                            <span className="flex shrink-0 items-center gap-1" title="Rewards">
                                <TrophyIcon className="h-3.5 w-3.5 text-muted-foreground" weight="duotone" />
                                <span className="font-semibold">{rewards}</span>
                            </span>
                        )}
                    </div>

                    <div className="relative z-10 flex shrink-0 items-center gap-0.5">
                        <Button variant="ghost" size="xs" asChild>
                            <Link to="/admin/quests/editor/$id" params={{ id }} aria-label={`Edit ${quest.title}`}>
                                <PencilSimpleIcon weight="bold" />
                                <span className="hidden @2xs:inline">Edit</span>
                            </Link>
                        </Button>
                        <Button
                            variant="ghost"
                            size="xs"
                            asChild
                            className="group-has-[.card-link:hover]/card:bg-accent group-has-[.card-link:hover]/card:text-accent-foreground"
                        >
                            <Link to="/admin/quests/$id" params={{ id }} aria-label={`View ${quest.title} details`}>
                                <ChartBarIcon weight="bold" />
                                <span className="hidden @2xs:inline">Details</span>
                            </Link>
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
