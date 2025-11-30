// hooks/use-everthorn-member.ts
import { useThornyUserByDiscordId } from "@/hooks/use-thorny-user";
import { authClient } from "@/lib/auth-client";

const EVERTHORN_GUILD_ID = "611008530077712395";

export function useEverthornMember() {
    const { data: session } = authClient.useSession();

    const { data: thornyUser, isLoading, error } = useThornyUserByDiscordId(
        session?.user?.discord_id,
        EVERTHORN_GUILD_ID
    );

    return {
        isMember: !!thornyUser,
        isCM: thornyUser?.role === "Community Manager" || thornyUser?.role === "Owner",
        thornyUser,
        isLoading,
        error,
    };
}
