import { Button } from "@/components/ui/button";
import { ArrowSquareOutIcon } from "@phosphor-icons/react";
import {ControlChip} from "@/components/features/geode-panel/chips/control-chip.tsx";
import {PlayersChip} from "@/components/features/geode-panel/chips/players-chip.tsx";
import {HoursChip} from "@/components/features/geode-panel/chips/hours-chip.tsx";
import {UptimeChip} from "@/components/features/geode-panel/chips/uptime-chip.tsx";

interface ServerOverviewProps {
    viewMore?: boolean;
    geodePanelUrl?: string;
}

export default function ServerOverview({
                                           viewMore = false,
                                           geodePanelUrl = "/admin/geode",
                                       }: ServerOverviewProps) {
    return (
        <div className="flex flex-col gap-2">
            <div className="w-full bg-card rounded-xl grid grid-cols-2 md:flex gap-2 p-2">
                <ControlChip className={'w-full'} />
                <PlayersChip guildId="611008530077712395" />
                <HoursChip />
                <UptimeChip />
            </div>

            {viewMore && (
                <div className="flex items-center justify-end px-1">
                    <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground gap-1.5" asChild>
                        <a href={geodePanelUrl} target="_blank" rel="noopener noreferrer">
                            Open in Geode Panel
                            <ArrowSquareOutIcon size={13} />
                        </a>
                    </Button>
                </div>
            )}
        </div>
    );
}