import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuestActions } from "@/hooks/use-quest-actions.ts";
import { getQuestLifecycle } from "@/lib/quest-lifecycle.ts";
import { QUEST_EXTENSION_DAYS } from "@/config/quests/constants.ts";
import {
    ArrowCounterClockwiseIcon,
    ChartBarIcon,
    ClockIcon,
    DotsThreeIcon,
    DownloadSimpleIcon,
    PencilSimpleIcon,
    PlayIcon,
    XCircleIcon,
} from "@phosphor-icons/react";
import type { QuestOut } from "@/api/nexuscore/model";

interface QuestActionsMenuProps {
    quest: QuestOut;
    /** Adds Open stats / Edit shortcuts. Cards need them; the quest page itself does not. */
    showNavigation?: boolean;
    className?: string;
}

/** One menu for every place a quest can be managed: cards, hero and the quest page. */
export function QuestActionsMenu({ quest, showNavigation = false, className }: QuestActionsMenuProps) {
    const { expireNow, extend, resume, startNow, exportJson } = useQuestActions(quest);
    const lifecycle = getQuestLifecycle(quest);
    const id = `${quest.quest_id}`;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-sm" className={className}>
                    <DotsThreeIcon className="size-5" weight="bold" />
                    <span className="sr-only">Actions for {quest.title}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                {showNavigation && (
                    <>
                        <DropdownMenuItem asChild>
                            <Link to="/admin/quests/$id/performance" params={{ id }}>
                                <ChartBarIcon /> Performance
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link to="/admin/quests/editor/$id" params={{ id }}>
                                <PencilSimpleIcon /> Edit quest
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                    </>
                )}

                {lifecycle === "active" && (
                    <>
                        <DropdownMenuItem onClick={extend}>
                            <ClockIcon /> Extend {QUEST_EXTENSION_DAYS} days
                        </DropdownMenuItem>
                        <DropdownMenuItem variant="destructive" onClick={expireNow}>
                            <XCircleIcon /> Expire now
                        </DropdownMenuItem>
                    </>
                )}
                {lifecycle === "scheduled" && (
                    <DropdownMenuItem onClick={startNow}>
                        <PlayIcon /> Start now
                    </DropdownMenuItem>
                )}
                {lifecycle === "expired" && (
                    <DropdownMenuItem onClick={resume}>
                        <ArrowCounterClockwiseIcon /> Reactivate for {QUEST_EXTENSION_DAYS} days
                    </DropdownMenuItem>
                )}

                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={exportJson}>
                    <DownloadSimpleIcon /> Copy as JSON
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
