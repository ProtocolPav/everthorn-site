import { useMemo } from "react";
import { Clock } from "lucide-react";
import { InfoChip, type InfoChipGraph } from "@/components/features/geode-panel/chips/info-chip";
import { useGuildPlaytime } from "@/hooks/use-guild-playtime";

const GUILD_ID = "1213827104945471538";

export function HoursChip() {
    const { data: playtime } = useGuildPlaytime(GUILD_ID);

    function formatPlaytime(totalSeconds: number): { value: string; subtext: string } {
        const totalHours = Math.floor(totalSeconds / 3600);
        const days = Math.floor(totalHours / 24);

        if (totalHours < 24) {
            return {
                value: `${totalHours}h`,
                subtext: "Total played",
            };
        }

        return {
            value: `${days.toLocaleString()}d`,
            subtext: `${totalHours.toLocaleString()} hours total`,
        };
    }

    const { value: formattedValue, subtext } = useMemo(() => {
        if (!playtime?.total_playtime) return { value: "0h", subtext: "Total played" };
        return formatPlaytime(playtime.total_playtime);
    }, [playtime?.total_playtime]);

    const graph: InfoChipGraph | undefined = useMemo(() => {
        if (!playtime?.monthly_playtime?.length) return undefined;

        let cumulative = 0;
        return {
            data: playtime.monthly_playtime.map((d) => {
                cumulative += Math.round(d.total / 3600);
                return { hours: cumulative };
            }),
            dataKey: "hours",
            color: "#f7dc55",
            config: { hours: { label: "Total Hours Played", color: "#F7DC55" } },
        };
    }, [playtime?.monthly_playtime]);

    return (
        <InfoChip
            label="Playtime"
            value={formattedValue}
            subtext={subtext}
            icon={<Clock className="h-3.5 w-3.5" />}
            colorClass="bg-yellow-500/10"
            textClass="text-yellow-500"
            iconColorClass="text-yellow-400/60"
            graph={graph}
        />
    );
}