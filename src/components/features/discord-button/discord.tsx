import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client.ts";
import {SignOutIcon, PencilSimpleIcon, ChartBarIcon} from "@phosphor-icons/react";
import {DiscordProfile} from "@/components/features/discord-button/profile";
import {LoginWithDiscord} from "@/components/features/discord-button/login-with-discord";
import {Spinner} from "@/components/ui/spinner.tsx";

export function DiscordButton({className}: {className?: string}) {
    const {data, isPending} = authClient.useSession()

    if (!data?.user) {
        return <LoginWithDiscord className={className}/>
    }

    if (isPending) {
        return (
            <Button variant="invisible" size={'icon'} className="gap-2 overflow-hidden rounded-full">
                <Spinner/>
            </Button>
        )
    }

    return (
        <DropdownMenu>

            <DropdownMenuTrigger asChild>
                <Button variant="invisible" size={'icon'} className="gap-2 overflow-hidden rounded-full">
                    <img src={data?.user?.image || ""} className="aspect-square" alt="Avatar"/>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-64 mr-2" align={"center"}>

                <DiscordProfile session={data.session} user={data.user}/>

                <DropdownMenuSeparator />

                <DropdownMenuItem disabled={true} className={'gap-1'}>
                    <ChartBarIcon className="mr-2" />
                    <span>View My Stats</span>
                </DropdownMenuItem>

                <DropdownMenuItem disabled={true} className={'gap-1'}>
                    <PencilSimpleIcon className="mr-2" />
                    <span>Edit Profile</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator/>

                <DropdownMenuItem onClick={async () => { await authClient.signOut() }} className={'gap-1'}>
                    <SignOutIcon className="mr-2" />
                    <span>Log out</span>
                </DropdownMenuItem>

            </DropdownMenuContent>

        </DropdownMenu>
    );

}

