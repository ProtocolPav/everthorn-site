import {APIQuestSchema} from "@/types/quest";
import {Card, CardContent} from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {Badge} from "@/components/ui/badge";
import {cn} from "@/lib/utils";
import {
    CaretRightIcon,
    ClockIcon,
    TargetIcon,
    TrophyIcon,
    DotsThreeVerticalIcon,
    CopyIcon,
    PlayIcon,
    ChartBarIcon,
    DownloadIcon,
    LightningIcon,
    TrashIcon, ClockCountdownIcon, PauseIcon, XIcon
} from "@phosphor-icons/react";
import {toast} from "sonner";

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
                color: "text-emerald-700 dark:text-emerald-400",
                bgColor: "bg-emerald-500/15 dark:bg-emerald-500/20 border-emerald-500/30",
                dotColor: "bg-emerald-500",
                gradient: "from-emerald-500/5 to-transparent",
            };
        } else if (isScheduled) {
            return {
                label: "Scheduled",
                color: "text-blue-700 dark:text-blue-400",
                bgColor: "bg-blue-500/15 dark:bg-blue-500/20 border-blue-500/30",
                dotColor: "bg-blue-500",
                gradient: "from-blue-500/5 to-transparent",
            };
        } else {
            return {
                label: "Expired",
                color: "text-orange-700 dark:text-orange-400",
                bgColor: "bg-orange-500/15 dark:bg-orange-500/20 border-orange-500/30",
                dotColor: "bg-orange-500",
                gradient: "from-orange-500/5 to-transparent",
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

    const handleQuickAction = (e: React.MouseEvent, action: string) => {
        e.preventDefault();
        e.stopPropagation();

        switch(action) {
            case 'expire_now':
                toast.success(`Quest ${quest.title} has been Expired. (NOT REALLY)`)
                break;
            case 'extend':
                toast.success(`Quest ${quest.title} has been Extended by 1 week. (NOT REALLY)`)
                break;
            case 'resume':
                toast.success(`Quest ${quest.title} has been resumed for another week. (NOT REALLY)`)
                break;
            case 'start_now':
                toast.success(`Quest ${quest.title} has been released NOW!. (NOT REALLY)`)
                break;
            case 'use_as_template':
                toast.success(`Quest ${quest.title} has been used as a template. (NOT REALLY)`)
                break;
            case 'analytics':
                toast.success(`Quest ${quest.title} analytics. (NOT REALLY)`)
                break;
            case 'export_json':
                toast.success(`Quest ${quest.title} JSON has been copied to clipboard. (NOT REALLY)`)
                break;
            case 'delete':
                toast.success(`Quest ${quest.title} has been Deleted Permanently. (NOT REALLY)`)
                break;
        }
    };

    return (
        <Card className="hover:border-foreground/30 hover:shadow-md transition-all duration-300 p-0 group overflow-hidden relative h-full flex flex-col">
            {/* Gradient overlay */}
            <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none", statusConfig.gradient)} />

            <Link href={`/admin/quests/editor/${quest.quest_id}`} className="flex flex-col h-full">
                {/* Status Banner */}
                <div className="px-2.5 py-1.5 bg-muted/50 dark:bg-muted/30 backdrop-blur-sm border-b border-border/50 flex items-center justify-between relative flex-shrink-0">
                    <div className={'flex gap-1.5 items-center'}>
                        <Badge
                            variant="secondary"
                            className={cn(
                                "text-xs font-semibold px-2 border transition-colors duration-200",
                                statusConfig.bgColor,
                                statusConfig.color
                            )}
                        >
                            <span className={cn("w-1.5 h-1.5 rounded-full mr-1.5 animate-pulse", statusConfig.dotColor)} />
                            {statusConfig.label}
                        </Badge>

                        <Badge variant="outline">{quest.quest_type} quest</Badge>
                    </div>

                    {/* Quick Actions Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger
                            onClick={(e) => e.preventDefault()}
                            asChild
                        >
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-5 w-5 p-0 hover:bg-accent"
                            >
                                <DotsThreeVerticalIcon className="h-3.5 w-3.5" weight="bold" />
                                <span className="sr-only">Quest actions</span>
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="w-44">
                            {isActive && (
                                <>
                                    <DropdownMenuItem onClick={(e) => handleQuickAction(e, 'expire_now')} className="text-xs">
                                        <XIcon className="mr-2 h-3.5 w-3.5" />
                                        <span>Expire Now</span>
                                    </DropdownMenuItem>

                                    <DropdownMenuItem onClick={(e) => handleQuickAction(e, 'extend')} className="text-xs">
                                        <ClockCountdownIcon className="mr-2 h-3.5 w-3.5" />
                                        <span>Extend By +1 Week</span>
                                    </DropdownMenuItem>
                                </>
                            )}

                            {isPast && (
                                <DropdownMenuItem onClick={(e) => handleQuickAction(e, 'resume')} className="text-xs">
                                    <PlayIcon className="mr-2 h-3.5 w-3.5" />
                                    <span>Resume For +1 Week</span>
                                </DropdownMenuItem>
                            )}

                            {isScheduled && (
                                <>
                                    <DropdownMenuItem onClick={(e) => handleQuickAction(e, 'start_now')} className="text-xs">
                                        <LightningIcon className="mr-2 h-3.5 w-3.5" />
                                        <span>Start Now</span>
                                    </DropdownMenuItem>
                                </>
                            )}

                            <DropdownMenuItem onClick={(e) => handleQuickAction(e, 'use_as_template')} className="text-xs">
                                <CopyIcon className="mr-2 h-3.5 w-3.5" />
                                <span>Create Similar</span>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem disabled onClick={(e) => handleQuickAction(e, 'analytics')} className="text-xs">
                                <ChartBarIcon className="mr-2 h-3.5 w-3.5" />
                                <span>View Analytics</span>
                            </DropdownMenuItem>

                            <DropdownMenuItem onClick={(e) => handleQuickAction(e, 'export_json')} className="text-xs">
                                <DownloadIcon className="mr-2 h-3.5 w-3.5" />
                                <span>Export JSON</span>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                                disabled
                                onClick={(e) => handleQuickAction(e, 'delete')}
                                className="text-destructive focus:text-destructive text-xs"
                            >
                                <TrashIcon className="mr-2 h-3.5 w-3.5" />
                                <span>Delete Quest</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Main Content - uses flex-1 to grow and push footer down */}
                <CardContent className="p-3 flex flex-col flex-1">
                    {/* Title */}
                    <h4 className="font-semibold text-sm leading-tight line-clamp-1 group-hover:text-primary transition-colors duration-200 mb-1.5">
                        {quest.title}
                    </h4>

                    {/* Description - fixed height */}
                    <div className="h-8 mb-4">
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-4">
                            {quest.description || "No description provided"}
                        </p>
                    </div>

                    {/* Time Info */}
                    <div className="flex items-start gap-1.5 mb-2 p-2 rounded-md bg-muted/30 border border-border/40">
                        <ClockIcon className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 text-muted-foreground" weight="duotone" />
                        <div className="text-xs leading-snug min-w-0 flex-1">
                            <span className="text-muted-foreground">
                                {isPast ? 'Ended ' : isScheduled ? 'Starts ' : 'Ends '}
                            </span>
                            <span className="font-medium text-foreground">
                                {formatDateLong(isPast || !isScheduled ? quest.end_time : quest.start_time)}
                            </span>
                        </div>
                    </div>

                    {/* Stats - mt-auto pushes this to the bottom */}
                    <div className="flex items-center gap-3 pt-2 border-t border-border/50 mt-auto">
                        <div className="flex items-center gap-1.5 text-xs">
                            <div className="p-0.5 bg-primary/10 rounded">
                                <TargetIcon className="h-3.5 w-3.5 text-primary" weight="duotone" />
                            </div>
                            <span className="font-semibold text-foreground">{quest.objectives.length}</span>
                            <span className="text-muted-foreground">Objectives</span>
                        </div>

                        {totalRewards > 0 && (
                            <div className="flex items-center gap-1.5 text-xs">
                                <div className="p-0.5 bg-amber-500/10 rounded">
                                    <TrophyIcon className="h-3.5 w-3.5 text-amber-600 dark:text-amber-500" weight="duotone" />
                                </div>
                                <span className="font-semibold text-foreground">{totalRewards}</span>
                                <span className="text-muted-foreground">Rewards</span>
                            </div>
                        )}

                        <div className="ml-auto">
                            <CaretRightIcon
                                size={14}
                                weight="bold"
                                className="text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-200"
                            />
                        </div>
                    </div>
                </CardContent>
            </Link>
        </Card>
    );
}
