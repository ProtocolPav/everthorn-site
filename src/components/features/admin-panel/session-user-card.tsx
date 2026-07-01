import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { SessionOut } from '@/api/nexuscore/model'
import { UserIcon } from '@phosphor-icons/react'
import { Skeleton } from '@/components/ui/skeleton.tsx'
import { formatPlaytime } from '@/lib/format.ts'

interface SessionUserCardProps {
    session: SessionOut
    className?: string
}

function formatDateTime(value: string) {
    return new Intl.DateTimeFormat('en-GB', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(value))
}

export function SessionUserCard({ session, className }: SessionUserCardProps) {
    const user = session.user

    const avatarSrc = user?.xuid
        ? `https://persona-secondary.franchise.minecraft-services.net/api/v1.0/profile/xuid/${user.xuid}/image/head`
        : undefined

    return (
        <div
            className={cn(
                'group flex items-center gap-3 rounded-xl bg-muted/40 px-3 py-2.5',
                'transition-colors duration-200 hover:bg-muted/70',
                className
            )}
        >
            <Avatar className="size-10 shrink-0 rounded-lg ring-1 ring-inset ring-foreground/[0.06]">
                <AvatarImage
                    src={avatarSrc}
                    alt={user?.whitelist ? `${user.whitelist} Minecraft avatar` : 'Minecraft Avatar'}
                    className="rounded-lg"
                />
                <AvatarFallback className="rounded-lg bg-secondary text-secondary-foreground">
                    <UserIcon className="size-4" />
                </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium leading-tight text-foreground">
                    {user?.whitelist ?? <Skeleton className="h-4 w-16" />}
                </p>

                <p className="truncate text-xs leading-tight text-muted-foreground">
                    {user?.username ? `@${user.username}` : 'Unknown player'}
                </p>
            </div>

            <div className="shrink-0 text-right">
                <p className="text-sm font-medium tabular-nums text-foreground">
                    {formatPlaytime(session.duration, 'full')}
                </p>
                <p className="text-xs tabular-nums text-muted-foreground">
                    {formatDateTime(session.end)}
                </p>
            </div>
        </div>
    )
}