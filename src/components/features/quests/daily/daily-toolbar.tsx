import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx";

export type DailyTab = "upcoming" | "templates";

interface DailyToolbarProps {
    active: DailyTab;
    counts: Partial<Record<DailyTab, number>>;
    /** Page controls (e.g. search), right of the tabs so the tabs never move between pages. */
    children?: ReactNode;
}

const TABS: { value: DailyTab; label: string; to: "/admin/quests/daily" | "/admin/quests/daily/templates" }[] = [
    { value: "upcoming", label: "Upcoming", to: "/admin/quests/daily" },
    { value: "templates", label: "Templates", to: "/admin/quests/daily/templates" },
];

/** Sticky toolbar shared by the daily quest pages. Same shape as the quest hub's QuestToolbar. */
export function DailyToolbar({ active, counts, children }: DailyToolbarProps) {
    return (
        <div className="sticky top-0 z-10 -mx-6 border-b bg-background/80 px-6 py-2 backdrop-blur-sm">
            <div className="flex flex-wrap items-center gap-1.5">
                <Tabs value={active} className="min-w-0">
                    <TabsList className="max-w-full overflow-x-auto scrollbar-hide">
                        {TABS.map(({ value, label, to }) => (
                            <TabsTrigger key={value} value={value} className="gap-1.5 px-2.5" asChild>
                                <Link to={to}>
                                    {label}
                                    {counts[value] !== undefined && (
                                        <span className="text-xs font-normal tabular-nums text-muted-foreground">
                                            {counts[value]}
                                        </span>
                                    )}
                                </Link>
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>
                {children && <div className="ml-auto flex min-w-0 flex-1 items-center justify-end gap-1.5">{children}</div>}
            </div>
        </div>
    );
}
