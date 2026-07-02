import { Link } from '@tanstack/react-router'
import { CalendarIcon, ArrowRightIcon } from '@phosphor-icons/react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { EventOut } from '@/api/nexuscore/model'
import { EventStatusBadge } from './event-status-badge'

interface EventCardProps {
    event: EventOut
    className?: string
}

function formatDateRange(startTime: string, endTime: string): string {
    const start = new Date(startTime)
    const end = new Date(endTime)
    const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' }
    const startStr = start.toLocaleDateString('en-US', opts)
    const endStr = end.toLocaleDateString('en-US', { ...opts, year: 'numeric' })
    return `${startStr} – ${endStr}`
}

export function EventCard({ event, className }: EventCardProps) {
    return (
        <Link to="/events/$slug" params={{ slug: event.slug }} className={cn('group block', className)}>
            <Card className="overflow-hidden border transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 bg-card">
                <div className="relative aspect-video overflow-hidden">
                    {event.image_url ? (
                        <img
                            src={event.image_url}
                            alt={event.title}
                            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-muted/80 to-muted flex items-center justify-center">
                            <CalendarIcon className="w-12 h-12 text-muted-foreground/30" weight="duotone" />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute top-3 left-3">
                        <EventStatusBadge
                            status={event.status}
                            startTime={event.start_time}
                            endTime={event.end_time}
                            className="text-xs shadow-lg backdrop-blur-sm"
                        />
                    </div>
                </div>

                <CardContent className="p-4 space-y-3">
                    <div>
                        <h3 className="font-bold text-base leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                            {event.title}
                        </h3>
                        {event.description && (
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                {event.description}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-border/50">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <CalendarIcon className="w-3.5 h-3.5" weight="duotone" />
                            <span>{formatDateRange(event.start_time, event.end_time)}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                            <span>View</span>
                            <ArrowRightIcon className="w-3 h-3" weight="bold" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}
