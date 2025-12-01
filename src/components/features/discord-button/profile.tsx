import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import {authClient} from "@/lib/auth-client.ts";
import {useEverthornMember} from "@/hooks/use-everthorn-member.ts";

export function DiscordProfile({user}: typeof authClient.$Infer.Session) {
    const {isMember, isCM} = useEverthornMember()

    return (
        <div className="mb-4">
            {/* Top banner and profile picture */}
            <div
                className={cn(
                    "relative h-24 w-full rounded",
                    { "h-14": !user.banner }
                )}
                style={{ backgroundColor: user.banner_color as string }}
            >
                {user.banner ? (
                    <img
                        src={user.banner}
                        alt="Profile banner"
                        className="size-full rounded-xs object-cover"
                    />
                ) : undefined}

                {/* Profile picture with decoration */}
                <div className="absolute -bottom-11 left-0 size-[5.5rem]">
                    <img
                        src={user.image as string}
                        alt="User profile picture."
                        className="absolute left-1/2 top-1/2 size-16 -translate-x-1/2 -translate-y-1/2 rounded-full outline-4 outline-card"
                    />

                    {user.decoration ? (
                        <img
                            src={user.decoration as string}
                            alt=""
                            className="absolute left-1/2 top-1/2 size-[5.5rem] -translate-x-1/2 -translate-y-1/2"
                        />
                    ) : undefined}
                </div>
            </div>

            {/* Badges */}
            <div className="mx-1 my-2 flex h-6 justify-end gap-1">
                {isMember && (
                    <Badge variant="cyan">Member</Badge>
                )}

                {isCM && (
                    <Badge variant="purple">Manager</Badge>
                )}
            </div>

            {/* Nickname and username */}
            <div className="mx-3">
                <p className="m-0 text-white text-lg">
                    <b>{user.nick}</b>
                </p>
                <p className="m-0 text-muted-foreground -mt-1 text-sm">
                    @{user.username}
                </p>
            </div>
        </div>
    )
}
