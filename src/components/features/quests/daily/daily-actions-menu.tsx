import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowsClockwiseIcon, CopyIcon, DotsThreeVerticalIcon, StackIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button.tsx";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import { RerollDailyDialog } from "@/components/features/quests/daily/reroll-daily-dialog.tsx";
import { isDailyEdited } from "@/lib/daily-quests.ts";
import type { DailyQuestOut } from "@/api/nexuscore/model";

interface DailyActionsMenuProps {
    daily: DailyQuestOut;
    /** Past days can't be re-rolled (Nexuscore returns 400). */
    canReroll: boolean;
}

/** The "⋯" menu on a day card, like QuestCard's actions menu. */
export function DailyActionsMenu({ daily, canReroll }: DailyActionsMenuProps) {
    const [rerollOpen, setRerollOpen] = useState(false);
    const edited = isDailyEdited(daily);

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="relative z-10 h-6 w-6 shrink-0 p-0 hover:bg-accent/60 transition-all duration-200 hover:scale-105"
                    >
                        <DotsThreeVerticalIcon className="h-4 w-4 text-muted-foreground" weight="bold" />
                        <span className="sr-only">Day actions</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                    {canReroll && (
                        <DropdownMenuItem onClick={() => setRerollOpen(true)} className="gap-3 cursor-pointer">
                            <ArrowsClockwiseIcon className="h-4 w-4 text-amber-600 dark:text-amber-400" weight="duotone" />
                            <div className="flex flex-col gap-0.5 flex-1">
                                <span className="text-sm">Re-roll day</span>
                                {edited && <span className="text-xs text-amber-600 dark:text-amber-400">Discards your edits</span>}
                            </div>
                        </DropdownMenuItem>
                    )}
                    {daily.template_id !== null && (
                        <DropdownMenuItem asChild className="gap-3 cursor-pointer">
                            <Link to="/admin/quests/daily/templates/$templateId" params={{ templateId: `${daily.template_id}` }}>
                                <StackIcon className="h-4 w-4 text-muted-foreground" weight="duotone" />
                                <span className="text-sm">Open template</span>
                            </Link>
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild className="gap-3 cursor-pointer">
                        <Link to="/admin/quests/editor/$id" params={{ id: "new" }} search={{ from: daily.quest.quest_id }}>
                            <CopyIcon className="h-4 w-4 text-muted-foreground" weight="duotone" />
                            <span className="text-sm">Duplicate as quest</span>
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <RerollDailyDialog daily={daily} open={rerollOpen} onOpenChange={setRerollOpen} />
        </>
    );
}
