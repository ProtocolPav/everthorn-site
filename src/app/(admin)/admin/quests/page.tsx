"use client";

import { useState, useEffect, useMemo } from "react";
import { useQuestList } from "@/hooks/use-quest-list";
import { usePageTitle } from "@/hooks/use-context";
import {
    TrophyIcon,
    PlusIcon,
    XCircleIcon,
    MagnifyingGlassIcon,
    FunnelIcon,
    ClockIcon,
    TargetIcon,
    CaretRightIcon, ArchiveIcon, ClockCountdownIcon, CalendarDotsIcon,
} from "@phosphor-icons/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { APIQuestSchema } from "@/types/quest";

// Quest Card Component
function QuestCard({ quest }: { quest: APIQuestSchema }) {
    const now = new Date();
    const startTime = new Date(quest.start_time);
    const endTime = new Date(quest.end_time);
    const isActive = now >= startTime && now <= endTime;
    const isScheduled = now < startTime;
    const isPast = now > endTime;

    const getTotalRewards = (objectives: APIQuestSchema['objectives']) => {
        return objectives.reduce((total, obj) => {
            return total + (obj.rewards?.length || 0);
        }, 0);
    };

    const totalRewards = getTotalRewards(quest.objectives);

    const getStatusConfig = () => {
        if (isActive) {
            return {
                label: "Active",
                color: "text-green-600",
                bgColor: "bg-green-500/10",
                dotColor: "bg-green-500",
            };
        } else if (isScheduled) {
            return {
                label: "Scheduled",
                color: "text-blue-600",
                bgColor: "bg-blue-500/10",
                dotColor: "bg-blue-400",
            };
        } else {
            return {
                label: "Ended",
                color: "text-orange-800",
                bgColor: "bg-orange-800/10",
                dotColor: "bg-orange-800",
            };
        }
    };

    const statusConfig = getStatusConfig();

    const formatDateLong = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    };

    return (
        <Card className="hover:border-foreground/30 transition-all p-0 group overflow-hidden">
            <Link href={`/admin/quests/editor/${quest.quest_id}`}>
                {/* Status Banner */}
                <div className="px-3 py-1.5 bg-muted/30 border-b border-border/50 flex items-center justify-between">
                    <Badge
                        variant="secondary"
                        className={cn("text-xs font-medium h-4 px-1.5", statusConfig.bgColor, statusConfig.color)}
                    >
                        {statusConfig.label}
                    </Badge>
                    <div className={cn("w-1.5 h-1.5 rounded-full", statusConfig.dotColor)} />
                </div>

                {/* Main Content */}
                <CardContent className="p-3">
                    {/* Title */}
                    <h4 className="font-semibold text-sm mb-2 line-clamp-1 group-hover:text-primary">
                        {quest.title}
                    </h4>

                    {/* Description - Fixed height with proper clipping */}
                    <div className="h-8 mb-2 overflow-hidden">
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-[1rem]">
                            {quest.description || "No description provided"}
                        </p>
                    </div>

                    {/* Time Info */}
                    <div className="flex items-start gap-1.5 mb-2 p-1.5 rounded-md bg-muted/20">
                        <ClockIcon className="h-3 w-3 mt-0.5 flex-shrink-0 text-muted-foreground" />
                        <div className="text-xs leading-snug min-w-0 flex-1">
                            <span className="text-muted-foreground">
                                {isPast ? 'Ended ' : isScheduled ? 'Starts ' : 'Ends '}
                            </span>
                            <span className="font-medium text-foreground break-words">
                                {formatDateLong(isPast || !isScheduled ? quest.end_time : quest.start_time)} UTC
                            </span>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-3 pt-1.5 border-t border-border/50">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <div className="p-0.5 bg-primary/10 rounded">
                                <TargetIcon className="h-3 w-3 text-primary" />
                            </div>
                            <span className="font-medium">{quest.objectives.length}</span>
                            <span>objectives</span>
                        </div>
                        {totalRewards > 0 && (
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <div className="p-0.5 bg-amber-500/10 rounded">
                                    <TrophyIcon className="h-3 w-3 text-amber-600 dark:text-amber-500" />
                                </div>
                                <span className="font-medium">{totalRewards}</span>
                                <span>rewards</span>
                            </div>
                        )}
                        <div className="ml-auto">
                            <CaretRightIcon
                                size={14}
                                className="text-muted-foreground group-hover:text-primary"
                            />
                        </div>
                    </div>
                </CardContent>
            </Link>
        </Card>
    );
}

// Quests Section Component
function QuestsSection({
                           quests,
                           isLoading,
                           filterType
                       }: {
    quests: APIQuestSchema[] | undefined;
    isLoading: boolean;
    filterType: "current" | "scheduled" | "past";
}) {
    const [searchTerm, setSearchTerm] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");

    const filteredQuests = useMemo(() => {
        if (!quests || quests.length === 0) return [];

        const now = new Date();

        // First filter by time category
        const categoryFiltered = quests.filter((quest) => {
            const startTime = new Date(quest.start_time);
            const endTime = new Date(quest.end_time);

            if (filterType === "current") {
                return now >= startTime && now <= endTime;
            } else if (filterType === "scheduled") {
                return now < startTime;
            } else if (filterType === "past") {
                return now > endTime;
            }
            return false;
        });

        // Then apply search and type filters
        return categoryFiltered.filter((quest) => {
            const matchesSearch =
                quest.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (quest.description && quest.description.toLowerCase().includes(searchTerm.toLowerCase()));
            const matchesType = typeFilter === "all" || quest.quest_type === typeFilter;
            return matchesSearch && matchesType;
        });
    }, [quests, searchTerm, typeFilter, filterType]);

    // Get unique quest types for filter
    const questTypes = useMemo(() => {
        if (!quests) return [];
        const now = new Date();
        const categoryFiltered = quests.filter((quest) => {
            const startTime = new Date(quest.start_time);
            const endTime = new Date(quest.end_time);

            if (filterType === "current") {
                return now >= startTime && now <= endTime;
            } else if (filterType === "scheduled") {
                return now < startTime;
            } else if (filterType === "past") {
                return now > endTime;
            }
            return false;
        });
        return Array.from(new Set(categoryFiltered.map((q) => q.quest_type)));
    }, [quests, filterType]);

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                <p className="text-sm text-muted-foreground mt-0 pl-1">
                    {filteredQuests.length} of {quests?.length || 0} quests
                </p>

                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <MagnifyingGlassIcon
                            size={16}
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                        />
                        <Input
                            placeholder="Search quests..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    {questTypes.length > 1 && (
                        <Select value={typeFilter} onValueChange={setTypeFilter}>
                            <SelectTrigger className="w-[180px]">
                                <FunnelIcon size={16} />
                                <SelectValue placeholder="All Types" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                {questTypes.map((type) => (
                                    <SelectItem key={type} value={type}>
                                        {type}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                </div>
            </div>

            <div className="h-[calc(100vh-260px)]">
                {isLoading ? (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-sm text-muted-foreground">Loading quests...</p>
                    </div>
                ) : filteredQuests.length === 0 ? (
                    <div className="text-center py-8">
                        <TrophyIcon size={32} className="mx-auto text-muted-foreground mb-4" />
                        <p className="text-sm text-muted-foreground mb-4">
                            {searchTerm ? "No quests found" : `No ${filterType} quests`}
                        </p>
                    </div>
                ) : (
                    <ScrollArea className="h-full">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pr-4">
                            {filteredQuests.map((quest) => (
                                <QuestCard key={quest.quest_id} quest={quest} />
                            ))}
                        </div>
                    </ScrollArea>
                )}
            </div>
        </div>
    );
}

// Main Quest Dashboard Page
export default function QuestsPage() {
    const { setTitle } = usePageTitle();
    const {
        quests,
        isLoading,
        isError,
    } = useQuestList();

    const [questTab, setQuestTab] = useState<"current" | "scheduled" | "past">("current");

    useEffect(() => {
        setTitle("Quests Dashboard");
    }, [setTitle]);

    if (isError) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <XCircleIcon size={48} className="mx-auto text-red-500 mb-4" />
                    <h2 className="text-lg font-semibold mb-2">Error Loading Quests</h2>
                    <p className="text-muted-foreground">Please try refreshing the page</p>
                </div>
            </div>
        );
    }

    return (
        <div className="grid gap-3 h-full">
            <Card className="p-3">
                <Tabs value={questTab} onValueChange={(tab) => setQuestTab(tab as "current" | "scheduled" | "past")}>
                    <CardHeader className="p-0">
                        <div className="w-full">
                            <CardTitle className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
                                <TabsList className="w-full sm:w-auto">
                                    <TabsTrigger value="current" className="flex-1 sm:flex-none">
                                        <CalendarDotsIcon size={20} className="sm:mr-1" />
                                        <span className="hidden sm:inline">Current</span>
                                    </TabsTrigger>
                                    <TabsTrigger value="scheduled" className="flex-1 sm:flex-none">
                                        <ClockCountdownIcon size={20} className="sm:mr-1" />
                                        <span className="hidden sm:inline">Scheduled</span>
                                    </TabsTrigger>
                                    <TabsTrigger value="past" className="flex-1 sm:flex-none">
                                        <ArchiveIcon size={20} className="sm:mr-1" />
                                        <span className="hidden sm:inline">Past</span>
                                    </TabsTrigger>
                                </TabsList>

                                <Button size="sm" asChild className="w-full sm:w-auto">
                                    <Link href="/admin/quests/editor/new">
                                        <PlusIcon size={16} className="mr-2" />
                                        Create
                                    </Link>
                                </Button>
                            </CardTitle>
                        </div>
                    </CardHeader>

                    <TabsContent value="current">
                        <QuestsSection
                            quests={quests}
                            isLoading={isLoading}
                            filterType="current"
                        />
                    </TabsContent>

                    <TabsContent value="scheduled">
                        <QuestsSection
                            quests={quests}
                            isLoading={isLoading}
                            filterType="scheduled"
                        />
                    </TabsContent>

                    <TabsContent value="past">
                        <QuestsSection
                            quests={quests}
                            isLoading={isLoading}
                            filterType="past"
                        />
                    </TabsContent>
                </Tabs>
            </Card>
        </div>
    );
}
