import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Users } from "lucide-react";
import { InfoChip } from "@/components/features/geode-panel/chips/info-chip.tsx";
import { usePlayers } from "@/hooks/use-players.ts";

export function PlayersChip({ guildId }: { guildId: string }) {
    const { data: players, isLoading } = usePlayers(guildId);

    return (
        <InfoChip
            label="Players"
            value={isLoading ? <Skeleton className="h-6 w-8" /> : (players?.length ?? 0)}
            subtext="Online now"
            icon={<Users className="h-3.5 w-3.5" />}
            colorClass="bg-orange-500/10"
            textClass="text-orange-500"
            iconColorClass="text-orange-400/60"
        />
    );
}