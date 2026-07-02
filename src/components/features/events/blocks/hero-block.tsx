import { Link } from '@tanstack/react-router'
import { ArrowLeftIcon } from '@phosphor-icons/react'
import type { HeroBlock as HeroBlockType, EventOut } from '@/api/nexuscore/model'
import { EventStatusBadge } from '../event-status-badge'

interface HeroBlockProps {
    block: HeroBlockType
    event: EventOut
}

export function HeroBlock({ block, event }: HeroBlockProps) {
    return (
        <div className="relative h-[45vh] md:h-[55vh] overflow-hidden">
            {block.background_image_url ? (
                <img
                    src={block.background_image_url}
                    alt={block.title}
                    className="absolute inset-0 w-full h-full object-cover"
                />
            ) : event.image_url ? (
                <img
                    src={event.image_url}
                    alt={block.title}
                    className="absolute inset-0 w-full h-full object-cover"
                />
            ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-muted" />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/10" />

            <Link
                to="/events"
                className="absolute top-5 left-5 md:top-7 md:left-7 z-10 flex items-center gap-1.5 px-3 py-2 rounded-lg bg-background/80 backdrop-blur-sm border border-border/60 hover:bg-background transition-all text-sm font-medium shadow-sm"
            >
                <ArrowLeftIcon className="w-4 h-4" weight="bold" />
                Back
            </Link>

            <div className="absolute top-5 right-5 md:top-7 md:right-7 z-10">
                <EventStatusBadge
                    status={event.status}
                    startTime={event.start_time}
                    endTime={event.end_time}
                    className="shadow-lg backdrop-blur-sm"
                />
            </div>

            <div className="absolute bottom-0 left-0 right-0 px-5 pb-7 md:px-10 md:pb-10">
                <div className="max-w-5xl">
                    {block.eyebrow && (
                        <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">
                            {block.eyebrow}
                        </p>
                    )}
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-3">
                        {block.title}
                    </h1>
                    {block.subtitle && (
                        <p className="text-base md:text-lg text-muted-foreground max-w-2xl">
                            {block.subtitle}
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}
