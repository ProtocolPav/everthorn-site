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
    const isActive = !session.end

    const avatarSrc = user?.xuid
        ? `https://persona-secondary.franchise.minecraft-services.net/api/v1.0/profile/xuid/${user.xuid}/image/head`
        : undefined

    return (
        <div
            className={cn(
                'group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors duration-200',
                isActive
                    ? 'bg-primary/[0.07] hover:bg-primary/11'
                    : 'bg-muted/40 hover:bg-muted/70',
                className
            )}
        >
            <div className="relative shrink-0">
                <Avatar className="size-10 rounded-md ring-1 ring-inset ring-foreground/6">
                    <AvatarImage
                        src={avatarSrc}
                        alt={user?.whitelist ? `${user.whitelist} Minecraft avatar` : 'Minecraft Avatar'}
                    />
                    <AvatarFallback className="bg-secondary text-secondary-foreground">
                        <UserIcon className="size-4" />
                    </AvatarFallback>
                </Avatar>

                {isActive && (
                    <span className="absolute -bottom-0.5 -right-0.5 flex size-3">
                        <span className="absolute inline-flex size-full animate-ping rounded-full bg-green-500/60" />
                        <span className="relative inline-flex size-3 rounded-full bg-green-500 ring-2 ring-muted" />
                    </span>
                )}
            </div>

            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium leading-tight text-foreground">
                    {user?.whitelist ?? <Skeleton className="h-4 w-16" />}
                </p>

                <p className="truncate text-xs leading-tight text-muted-foreground">
                    {user?.username ? `@${user.username}` : 'Unknown player'}
                </p>
            </div>

            <div className="shrink-0 text-right">
                {isActive ? (
                    <>
                        <p className="text-sm font-medium text-primary">Online</p>
                        <p className="text-xs text-muted-foreground">
                            Since {formatDateTime(session.start)}
                        </p>
                    </>
                ) : (
                    <>
                        <p className="text-sm font-medium tabular-nums text-foreground">
                            {formatPlaytime(session.duration, 'full')}
                        </p>
                        <p className="text-xs tabular-nums text-muted-foreground">
                            {formatDateTime(session.end)}
                        </p>
                    </>
                )}
            </div>
        </div>
    )
}