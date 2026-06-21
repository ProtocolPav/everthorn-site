// hooks/use-everthorn-member.ts
import { useLookupUserV1GuildsMeUsersLookupGet } from "@/api/nexuscore/users/users.ts";
import { authClient } from "@/lib/auth-client";

export function useEverthornMember() {
    const { data: session } = authClient.useSession();

    const { data: thornyUser, isLoading, error } = useLookupUserV1GuildsMeUsersLookupGet(
        { discord_id: session ? session?.user?.discord_id as unknown as number : 0 }
    );

    return {
        isMember: !!thornyUser,
        isCM: thornyUser?.role === "Community Manager" || thornyUser?.role === "Owner",
        thornyUser,
        isLoading,
        error,
    };
}