// hooks/use-everthorn-member.ts
import { authClient } from "@/lib/auth-client";
import {
    getUserByGamertagOrDiscordIDV02UsersGuildGuildIdIdGetResponseSuccess,
    useGetUserByGamertagOrDiscordIDV02UsersGuildGuildIdIdGet
} from "@/api/api.ts";
import {UserModel} from "@/api/api.schemas.ts";

const EVERTHORN_GUILD_ID = "611008530077712395";

export function useEverthornMember() {
    const { data: session } = authClient.useSession();

    const { data, isLoading, error } = useGetUserByGamertagOrDiscordIDV02UsersGuildGuildIdIdGet(
        session?.user?.discord_id,
        EVERTHORN_GUILD_ID,
        {
            query: {
                select: (data) => data as getUserByGamertagOrDiscordIDV02UsersGuildGuildIdIdGetResponseSuccess
            }
        }
    );

    return {
        isMember: !!thornyUser,
        isCM: thornyUser?.role === "Community Manager" || thornyUser?.role === "Owner",
        thornyUser,
        isLoading,
        error,
    };
}
