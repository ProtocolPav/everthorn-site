import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Users } from "lucide-react";
import { InfoChip } from "@/components/features/geode-panel/chips/info-chip.tsx";
import {useGetOnlineMembersV1GuildsMeOnlineGet} from "@/api/nexuscore/guilds/guilds.ts";

export function PlayersChip() {
    const { data: players, isLoading } = useGetOnlineMembersV1GuildsMeOnlineGet();

    return (
        <InfoChip
            label="Players"
            value={isLoading ? <Skeleton className="h-6 w-8" /> : (players?.length ?? 0)}
            subtext="Online now"
            icon={<Users className="h-3.5 w-3.5" />}
            colorClass="bg-sky-500/10"
            textClass="text-sky-500"
            iconColorClass="text-sky-400/60"
        />
    );
}