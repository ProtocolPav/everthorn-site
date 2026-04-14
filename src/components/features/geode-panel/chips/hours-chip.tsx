import { useMemo } from "react";
import { Clock } from "lucide-react";
import { InfoChip, type InfoChipGraph } from "@/components/features/geode-panel/chips/info-chip";
import { useGuildPlaytime } from "@/hooks/use-guild-playtime";

const GUILD_ID = "1213827104945471538";

export function HoursChip() {
    const { data: playtime } = useGuildPlaytime(GUILD_ID);

    const totalHours = useMemo(() => {
        if (!playtime?.total_playtime) return 0;
        return Math.round(playtime.total_playtime / 3600);
    }, [playtime?.total_playtime]);

    const graph: InfoChipGraph | undefined = useMemo(() => {
        if (!playtime?.monthly_playtime?.length) return undefined;
        return {
            data: playtime.monthly_playtime.map((d) => ({
                hours: Math.round(d.total / 3600),
            })),
            dataKey: "hours",
            color: "#a855f7",
            config: { hours: { label: "Hours Played", color: "#a855f7" } },
        };
    }, [playtime?.daily_playtime]);

    return (
        <InfoChip
            label="Hours"
            value={totalHours.toLocaleString()}
            subtext="Total played"
            icon={<Clock className="h-3.5 w-3.5" />}
            colorClass="bg-purple-500/10"
            textClass="text-purple-500"
            iconColorClass="text-purple-400/60"
            graph={graph}
        />
    );
}