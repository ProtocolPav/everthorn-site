import {APIQuestSchema} from "@/types/quest";
import {Card, CardContent} from "@/components/ui/card";
import Link from "next/link";
import {Badge} from "@/components/ui/badge";
import {cn} from "@/lib/utils";
import {CaretRightIcon, ClockIcon, TargetIcon, TrophyIcon} from "@phosphor-icons/react";

export function QuestCard({ quest }: { quest: APIQuestSchema }) {
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