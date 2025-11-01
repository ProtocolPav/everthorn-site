import {APIQuestSchema} from "@/types/quest";
import {useMemo, useState} from "react";
import {FunnelIcon, MagnifyingGlassIcon, TrophyIcon} from "@phosphor-icons/react";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {ScrollArea} from "@/components/ui/scroll-area";
import {QuestCard} from "@/components/features/quest_dashboard/quest-card";

export function QuestsSection({
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