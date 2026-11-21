import {FingerprintIcon, HouseIcon} from "@phosphor-icons/react";
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
import {authClient} from "@/lib/auth-client.ts";

export function WikiAccessDeniedScreen() {
    const { data: session } = authClient.useSession();

    return (
        <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
            <Empty>
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <FingerprintIcon />
                    </EmptyMedia>
                    <EmptyTitle>Sign in to contribute</EmptyTitle>


                    <EmptyDescription>
                        You must be a signed-in Everthorn member to write or edit pages in the wiki.
                    </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                    <div className="flex gap-2">
                        <Link to="/">
                            <Button variant={'outline'}>
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
