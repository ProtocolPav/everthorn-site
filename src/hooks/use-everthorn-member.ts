// hooks/use-everthorn-member.ts
import { useLookupUserV1GuildsMeUsersLookupGet } from "@/api/nexuscore/users/users.ts";
import { authClient } from "@/lib/auth-client";

export function useEverthornMember() {
    const { data: session, isPending: isSessionLoading } = authClient.useSession();

    const discordId = session?.user?.discord_id as unknown as number;

    const { data: thornyUser, isLoading, error } = useLookupUserV1GuildsMeUsersLookupGet(
        { discord_id: discordId ?? 0 },
        {
            query: {
                enabled: !!discordId,
            }
        }
    );

    return {
        isMember: !!thornyUser,
        isCM: thornyUser?.role === "Community Manager" || thornyUser?.role === "Owner",
        isPatron: thornyUser?.patron,
        thornyUser,
        isLoading: isSessionLoading || isLoading,
        error,
    };
}