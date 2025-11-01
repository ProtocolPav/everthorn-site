"use client"

import { Card, CardContent } from "@/components/ui/card";
import * as React from "react";
import { useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePageTitle } from "@/hooks/use-context";
import { useQuestList } from "@/hooks/use-quest-list";
import {
    ClockIcon,
    PlusIcon,
    TargetIcon,
    TrophyIcon,
    FunnelIcon,
    CalendarIcon,
    ArchiveBoxIcon,
    XCircleIcon
} from "@phosphor-icons/react";
import { APIQuestSchema } from "@/types/quest";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function QuestsPage() {
    const {
        quests,
        isLoading,
        isError,
        uiFilters,
        handleFilterChange,
        clearFilters,
        getActiveFilterCount,
    } = useQuestList();

    const { setTitle } = usePageTitle();

    useEffect(() => {
        setTitle('Quests Dashboard');
    }, [setTitle]);

    const formatDateLong = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    const getTotalRewards = (objectives: APIQuestSchema['objectives']) => {
        return objectives.reduce((total, obj) => {
            return total + (obj.rewards?.length || 0);
        }, 0);
    };

    // Categorize quests
    const categorizedQuests = useMemo(() => {
        if (!quests) return { current: [], scheduled: [], past: [] };

        const now = new Date();
        const current: APIQuestSchema[] = [];
        const scheduled: APIQuestSchema[] = [];
        const past: APIQuestSchema[] = [];

        quests.forEach((quest) => {
            const startTime = new Date(quest.start_time);
            const endTime = new Date(quest.end_time);

            if (now < startTime) {
                scheduled.push(quest);
            } else if (now >= startTime && now <= endTime) {
                current.push(quest);
            } else {
                past.push(quest);
            }
        });

        return { current, scheduled, past };
    }, [quests]);

    const QuestCard = ({ quest }: { quest: APIQuestSchema }) => {
        const totalRewards = getTotalRewards(quest.objectives);
        const now = new Date();
        const startTime = new Date(quest.start_time);
        const endTime = new Date(quest.end_time);
        const isActive = now >= startTime && now <= endTime;
        const isScheduled = now < startTime;

        return (
            <Card className="hover:border-foreground/30 transition-all p-0 group h-full overflow-hidden">
                <Link href={`/admin/quests/editor/${quest.quest_id}`}>
                    <CardContent className="p-0 flex flex-col h-full">
                        {/* Status Banner */}
                        <div className="px-3 py-2 bg-muted/30 border-b border-border/50">
                            <Badge
                                variant={isActive ? "default" : isScheduled ? "secondary" : "outline"}
                                className="h-5 text-xs font-medium"
                            >
                                {isActive ? "Active" : isScheduled ? "Scheduled" : "Ended"}
                            </Badge>
                        </div>

                        {/* Main Content */}
                        <div className="p-4 flex flex-col flex-grow">
                            {/* Title */}
                            <h4 className="font-semibold text-base mb-3 line-clamp-2 leading-tight">
                                {quest.title}
                            </h4>

                            {/* Description */}
                            <p className="text-xs text-muted-foreground mb-4 line-clamp-3 leading-relaxed flex-grow">
                                {quest.description}
                            </p>

                            {/* Time Info */}
                            <div className="flex items-start gap-2 mb-3 p-2 rounded-md bg-muted/20">
                                <ClockIcon className="h-4 w-4 mt-0.5 flex-shrink-0 text-muted-foreground" />
                                <div className="text-xs leading-relaxed">
                                <span className="text-muted-foreground">
                                    {isScheduled ? 'Starts ' : 'Ends '}
                                </span>
                                    <span className="font-medium text-foreground">
                                    {formatDateLong(isScheduled ? quest.start_time : quest.end_time)}
                                </span>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="flex items-center gap-4 pt-3 border-t border-border/50">
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                    <div className="p-1 bg-primary/10 rounded">
                                        <TargetIcon className="h-3 w-3 text-primary" />
                                    </div>
                                    <span className="font-medium">{quest.objectives.length}</span>
                                    <span>objectives</span>
                                </div>
                                {totalRewards > 0 && (
                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                        <div className="p-1 bg-amber-500/10 rounded">
                                            <TrophyIcon className="h-3 w-3 text-amber-600 dark:text-amber-500" />
                                        </div>
                                        <span className="font-medium">{totalRewards}</span>
                                        <span>rewards</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Link>
            </Card>
        );
    };

    const QuestSection = ({
                              title,
                              icon: Icon,
                              quests,
                              emptyMessage
                          }: {
        title: string;
        icon: any;
        quests: APIQuestSchema[];
        emptyMessage: string;
    }) => (
        <div className="grid gap-2">
            {/* Section Header */}
            <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                    <div className="p-1 bg-primary/10 rounded-lg">
                        <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <h3 className="text-base font-bold">{title}</h3>
                    <Badge variant="secondary" className="h-5 text-xs">
                        {quests.length}
                    </Badge>
                </div>
            </div>

            {/* Quest Grid */}
            {quests.length > 0 ? (
                <div className="w-full overflow-hidden">
                    <ScrollArea className="w-full whitespace-nowrap rounded-lg">
                        <div className="flex gap-2 pb-2">
                            {quests.map((quest) => (
                                <div
                                    key={quest.quest_id}
                                    className="w-64 flex-shrink-0 inline-block"
                                >
                                    <QuestCard quest={quest} />
                                </div>
                            ))}
                        </div>
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                </div>
            ) : (
                <Card className="border-dashed p-0">
                    <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                        <div className="p-2 rounded-lg bg-muted/30 mb-2">
                            <XCircleIcon className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );

    return (
        <div className="grid gap-3">
            {/* Filters & Controls */}
            <Card className="bg-muted/15 border-none p-0">
                <CardContent className="p-2 grid gap-2">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-1.5 bg-primary/10 rounded-lg">
                                <TrophyIcon className="h-4 w-4 text-primary" />
                            </div>
                            <h2 className="text-lg font-bold">Quest Dashboard</h2>
                            {getActiveFilterCount() > 0 && (
                                <div className="inline-flex items-center bg-muted/50 rounded-md p-0.5">
                                    <div className="px-2 py-1 bg-primary/20 text-primary text-xs font-medium rounded-sm">
                                        {getActiveFilterCount()} filters
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={clearFilters}
                                        className="h-6 px-2 text-xs hover:bg-destructive/20 hover:text-destructive ml-0.5 rounded-sm"
                                    >
                                        Clear
                                    </Button>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-3 px-2">
                            {/* Create Quest */}
                            <Button asChild size="sm" className="h-8">
                                <Link href="/admin/quests/editor/new">
                                    <PlusIcon className="h-4 w-4 mr-1" />
                                    Create
                                </Link>
                            </Button>

                            {/* Total Count */}
                            <div className="text-right">
                                <div className="text-lg font-bold">{quests?.length || 0}</div>
                                <div className="text-xs text-muted-foreground">total</div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Loading State */}
            {isLoading && (
                <div className="grid gap-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="grid gap-2">
                            <Skeleton className="h-8 w-48" />
                            <div className="flex gap-2 overflow-hidden">
                                {[1, 2, 3].map((j) => (
                                    <Skeleton key={j} className="w-64 h-48 flex-shrink-0" />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Error State */}
            {isError && (
                <Card className="border-destructive/50 p-0">
                    <CardContent className="p-6 text-center">
                        <p className="text-sm text-destructive">Failed to load quests. Please try again.</p>
                    </CardContent>
                </Card>
            )}

            {/* Quest Sections */}
            {!isLoading && !isError && quests && (
                <>
                    {/* Current Quests */}
                    <QuestSection
                        title="Current Quests"
                        icon={TrophyIcon}
                        quests={categorizedQuests.current}
                        emptyMessage="No active quests at the moment"
                    />

                    {/* Scheduled Quests */}
                    <QuestSection
                        title="Scheduled Quests"
                        icon={CalendarIcon}
                        quests={categorizedQuests.scheduled}
                        emptyMessage="No upcoming quests scheduled"
                    />

                    {/* Past Quests */}
                    <QuestSection
                        title="Past Quests"
                        icon={ArchiveBoxIcon}
                        quests={categorizedQuests.past}
                        emptyMessage="No completed quests yet"
                    />
                </>
            )}
        </div>
    );
}
