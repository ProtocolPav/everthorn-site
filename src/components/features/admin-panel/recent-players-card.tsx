import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { SessionUserCard } from './session-user-card'
import {SessionOut} from "@/api/nexuscore/model";
import {cn} from "@/lib/utils.ts";

interface RecentPlayersCardProps {
    sessions: SessionOut[]
    className?: string
    maxItems?: number
}

export function RecentPlayersCard({
                                      sessions,
                                      className,
                                      maxItems = 6,
                                  }: RecentPlayersCardProps) {
    const recentSessions = sessions.slice(0, maxItems)

    return (
        <Card className={cn("flex h-100 w-1/3 rounded-xl gap-2 p-2 border-0 overflow-y-hidden", className)}>
            <CardHeader className="p-0">
                <CardTitle className="text-base">Recent Players</CardTitle>
                <CardDescription>
                    Who's on recently
                </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col gap-2 p-0">
                {recentSessions.length > 0 ? (
                    recentSessions.map((session) => (
                        <SessionUserCard
                            key={`${session.user.user_id}-${session.start}-${session.end}`}
                            session={session}
                        />
                    ))
                ) : (
                    <div className="flex min-h-24 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
                        No recent sessions found
                    </div>
                )}
            </CardContent>
        </Card>
    )
}