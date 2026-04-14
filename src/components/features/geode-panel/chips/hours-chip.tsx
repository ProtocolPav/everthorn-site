import { Clock } from "lucide-react";
import { InfoChip, type InfoChipGraph } from "@/components/features/geode-panel/chips/info-chip.tsx";

// TODO: replace with real hook
const MOCK_HOURS_DATA = Array.from({ length: 16 }, (_, i) => ({
    hours: Math.round(20 + Math.sin(i * 0.7) * 12 + Math.random() * 8),
}));
const TOTAL_HOURS = 4821;

const graph: InfoChipGraph = {
    data: MOCK_HOURS_DATA,
    dataKey: "hours",
    color: "#a855f7",
    config: { hours: { label: "Hours Played", color: "#a855f7" } },
};

export function HoursChip() {
    return (
        <InfoChip
            label="Hours"
            value={TOTAL_HOURS.toLocaleString()}
            subtext="Total played"
            icon={<Clock className="h-3.5 w-3.5" />}
            colorClass="bg-purple-500/10"
            textClass="text-purple-500"
            iconColorClass="text-purple-400/60"
            graph={graph}
        />
    );
}