import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { EventOutStatus } from '@/api/nexuscore/model'

interface EventStatusBadgeProps {
    status: EventOutStatus
    startTime: string
    endTime: string
    className?: string
    showDot?: boolean
}

export function getEventDisplayStatus(
    status: EventOutStatus,
    startTime: string,
    endTime: string
): 'live' | 'upcoming' | 'ended' {
    if (status === 'archived') return 'ended'
    if (status === 'draft') return 'upcoming'
    const now = new Date()
    const start = new Date(startTime)
    const end = new Date(endTime)
    if (now >= start && now <= end) return 'live'
    if (now > end) return 'ended'
    return 'upcoming'
}

export function EventStatusBadge({
    status,
    startTime,
    endTime,
    className,
    showDot = true,
}: EventStatusBadgeProps) {
    const displayStatus = getEventDisplayStatus(status, startTime, endTime)

    const config = {
        live: {
            label: 'Live Now',
            variant: 'event-live' as const,
        },
        upcoming: {
            label: 'Upcoming',
            variant: 'event-upcoming' as const,
        },
        ended: {
            label: 'Ended',
            variant: 'event-ended' as const,
        },
    }[displayStatus]

    return (
        <Badge variant={config.variant} className={cn('gap-1.5', className)}>
            {showDot && (
                <span
                    className={cn(
                        'w-1.5 h-1.5 rounded-full',
                        displayStatus === 'live' && 'animate-pulse bg-current',
                        displayStatus !== 'live' && 'bg-current opacity-70'
                    )}
                />
            )}
            {config.label}
        </Badge>
    )
}
