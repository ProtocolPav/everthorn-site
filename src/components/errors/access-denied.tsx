import {HouseIcon, FingerprintIcon} from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
    Empty,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
    EmptyDescription,
    EmptyContent,
} from "@/components/ui/empty";
import {DiscordButton} from "@/components/features/discord-button/discord.tsx";
import {useEverthornMember} from "@/hooks/use-everthorn-member.ts";
import {authClient} from "@/lib/auth-client.ts";

export function AccessDeniedScreen() {
    const { data: session } = authClient.useSession();
    const { isCM } = useEverthornMember()

    return (
        <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
            <Empty>
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <FingerprintIcon />
                    </EmptyMedia>
                    <EmptyTitle>Verification Required</EmptyTitle>

                    {!isCM && (
                        <EmptyDescription>
                            You're probably not supposed to be here.
                        </EmptyDescription>
                    )}

                    {!session?.user && (
                        <EmptyDescription>
                            If you think you are, log in.
                        </EmptyDescription>
                    )}
                </EmptyHeader>
                <EmptyContent>
                    <div className="flex gap-2">
                        <Link to="/">
                            <Button>
                                <HouseIcon /> Home
                            </Button>
                        </Link>

                        {!session?.user && (
                            <DiscordButton />
                        )}
                    </div>
                </EmptyContent>
            </Empty>
        </div>
    );
}
