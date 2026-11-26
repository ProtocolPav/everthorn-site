import { Link } from "@tanstack/react-router";
import { CaretRightIcon, CheckCircleIcon } from "@phosphor-icons/react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toneDot } from "@/lib/quest-health.ts";
import { cn } from "@/lib/utils";
import type { QuestsOverviewAttention, QuestsOverviewTopQuest } from "@/types/quests-overview.d.ts";

const ROW =
    "group flex items-center gap-3 px-4 py-2.5 outline-none transition-colors hover:bg-muted/40 focus-visible:bg-muted/40";

function AttentionRow({ item }: { item: QuestsOverviewAttention }) {
    return (
        <Link to="/admin/quests/$id" params={{ id: `${item.quest_id}` }} data-slot="attention-row" className={ROW}>
            <span className={cn("size-1.5 shrink-0 rounded-full", toneDot[item.tone])} aria-hidden="true" />
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="truncate text-sm font-medium">{item.title}</span>
                <span className="truncate text-[11px] text-muted-foreground">
                    <span className="font-medium text-foreground/80">{item.label}.</span> {item.detail}
                </span>
            </div>
            <CaretRightIcon
                className="size-3.5 shrink-0 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5"
                weight="bold"
            />
        </Link>
    );
}

function TopQuestRow({ item, rank }: { item: QuestsOverviewTopQuest; rank: number }) {
    const percent = Math.round(item.completion_rate * 100);

    return (
        <Link to="/admin/quests/$id" params={{ id: `${item.quest_id}` }} data-slot="top-quest-row" className={ROW}>
            <span className="w-3 shrink-0 text-right text-[11px] tabular-nums text-muted-foreground">{rank}</span>
            <div className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="truncate text-sm font-medium">{item.title}</span>
                <div className="flex items-center gap-2">
                    <Progress value={percent} className="h-1 w-16 shrink-0" aria-label={`${percent}% completed`} />
                    <span className="text-[11px] tabular-nums text-muted-foreground">{percent}% complete</span>
                </div>
            </div>
            <span className="shrink-0 text-right text-[11px] tabular-nums text-muted-foreground">
                <span className="text-sm font-semibold text-foreground">{item.accepts.toLocaleString()}</span> accepts
            </span>
        </Link>
    );
}

interface OverviewInsightsProps {
    attention: QuestsOverviewAttention[];
    topQuests: QuestsOverviewTopQuest[];
    windowDays: number;
}

/**
 * The "where should I look" panel next to the activity chart. Opens on
 * attention when something is flagged, otherwise on the most popular quests.
 */
export function OverviewInsights({ attention, topQuests, windowDays }: OverviewInsightsProps) {
    return (
        <Card data-slot="overview-insights" className="gap-0 overflow-hidden py-0 shadow-none">
            <Tabs defaultValue={attention.length > 0 ? "attention" : "top"} className="gap-0">
                <CardHeader className="flex items-center border-b px-3 py-2">
                    <TabsList className="h-8">
                        <TabsTrigger value="attention" className="text-xs">
                            Needs attention
                            {attention.length > 0 && (
                                <span className="rounded-full bg-amber-500/15 px-1.5 text-[10px] font-semibold tabular-nums text-amber-700 dark:text-amber-400">
                                    {attention.length}
                                </span>
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="top" className="text-xs">
                            Top quests
                        </TabsTrigger>
                    </TabsList>
                </CardHeader>

                <CardContent className="px-0">
                    <TabsContent value="attention" className="max-h-64 overflow-y-auto">
                        {attention.length === 0 ? (
                            <p className="flex items-center gap-2 px-4 py-8 text-sm font-light text-muted-foreground">
                                <CheckCircleIcon className="size-4 text-emerald-500" weight="duotone" />
                                Every active quest is running smoothly.
                            </p>
                        ) : (
                            <div className="divide-y">
                                {attention.map((item) => (
                                    <AttentionRow key={`${item.quest_id}-${item.reason}`} item={item} />
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="top" className="max-h-64 overflow-y-auto">
                        {topQuests.length === 0 ? (
                            <p className="px-4 py-8 text-sm font-light text-muted-foreground">
                                No accepts in the last {windowDays} days.
                            </p>
                        ) : (
                            <div className="divide-y">
                                {topQuests.map((item, index) => (
                                    <TopQuestRow key={item.quest_id} item={item} rank={index + 1} />
                                ))}
                            </div>
                        )}
                    </TabsContent>
                </CardContent>
            </Tabs>
        </Card>
    );
}

export function OverviewInsightsSkeleton() {
    return (
        <Card className="gap-0 py-0 shadow-none">
            <div className="border-b px-3 py-2">
                <Skeleton className="h-8 w-56" />
            </div>
            <div className="flex flex-col gap-3 p-4">
                {Array.from({ length: 4 }).map((_, index) => (
                    <Skeleton key={index} className="h-9 w-full" />
                ))}
            </div>
        </Card>
    );
}
