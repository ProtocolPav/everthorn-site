"use client"

import * as React from "react"
import {Card, CardContent} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {ArrowRightIcon, CalendarIcon, ClockIcon, SparkleIcon} from "@phosphor-icons/react"
import {cn} from "@/lib/utils"
import Link from "next/link"
import Image from "next/image"

interface EventData {
    slug: string;
    title: string;
    startTime: Date;
    endTime: Date;
    image: string;
    teaserImage?: string;
    description?: string;
    teaserText?: string;
}

const events: EventData[] = [
    {
        slug: "winter-wonderland",
        title: "Winter Wonderland Festival",
        startTime: new Date("2025-12-20T10:00:00"),
        endTime: new Date("2025-12-25T23:59:59"),
        image: "/bg.png",
        description: "Celebrate the holidays with special winter-themed activities!",
        teaserText: "Something magical is coming to the server this winter..."
    },
    {
        slug: "trick-or-treat",
        title: "Trick Or Treat Event",
        startTime: new Date("2025-10-31T18:00:00"),
        endTime: new Date("2025-11-01T06:00:00"),
        image: "/bg.png",
        description: "Join us for a spooky night of fun and treats on the server!",
        teaserText: "Spooky surprises await in the shadows..."
    },
    {
        slug: "summer-festival",
        title: "Summer Festival",
        startTime: new Date("2024-08-15T12:00:00"),
        endTime: new Date("2024-08-20T23:59:59"),
        image: "/bg.png",
        description: "Epic summer celebration with exclusive rewards!"
    }
];

// Helper function to determine featured event
function getFeaturedEvent(events: EventData[]): EventData | null {
    const now = new Date();

    // Find current events
    const currentEvents = events.filter(
        event => now >= event.startTime && now <= event.endTime
    );

    if (currentEvents.length > 0) {
        return currentEvents[0];
    }

    // Find upcoming events
    const upcomingEvents = events
        .filter(event => event.startTime > now)
        .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

    if (upcomingEvents.length > 0) {
        return upcomingEvents[0];
    }

    return null;
}

// Featured Event Card Component
function FeaturedEventCard({ event }: { event: EventData }) {
    const now = new Date();
    const isCurrent = now >= event.startTime && now <= event.endTime;
    const isUpcoming = event.startTime > now;

    // Use teaser content for upcoming events, regular content otherwise
    const displayImage = isUpcoming && event.teaserImage ? event.teaserImage : event.image;
    const displayText = isUpcoming && event.teaserText ? event.teaserText : event.description;

    const getStatusConfig = () => {
        if (isCurrent) {
            return {
                label: "Live Now",
                color: "text-emerald-700 dark:text-emerald-400",
                bgColor: "bg-emerald-500/15 dark:bg-emerald-500/20",
                borderColor: "border-emerald-500/30",
                dotColor: "bg-emerald-500",
                gradient: "from-emerald-500/5 to-transparent",
            };
        } else {
            return {
                label: "Upcoming",
                color: "text-blue-700 dark:text-blue-400",
                bgColor: "bg-blue-500/15 dark:bg-blue-500/20",
                borderColor: "border-blue-500/30",
                dotColor: "bg-blue-500",
                gradient: "from-blue-500/5 to-transparent",
            };
        }
    };

    const statusConfig = getStatusConfig();

    const formatDateShort = (date: Date) => {
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
        });
    };

    return (
        <Link href={`/events/${event.slug}`} className="block">
            <Card className="hover:border-primary/40 hover:shadow-lg transition-all duration-300 p-0 group overflow-hidden relative">
                {/* Gradient overlay */}
                <div className={cn(
                    "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none",
                    statusConfig.gradient
                )} />

                <div className="flex flex-col">
                    {/* Image Section with Badges */}
                    <div className="relative aspect-[21/9] overflow-hidden bg-gradient-to-br from-muted to-muted/60">
                        <Image
                            src={displayImage}
                            alt={event.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />

                        {/* Badges on top of image */}
                        <div className="absolute top-4 left-4 flex gap-2 items-center">
                            <Badge
                                variant="secondary"
                                className={cn(
                                    "text-xs font-semibold px-2.5 py-1 border backdrop-blur-sm transition-colors duration-200",
                                    statusConfig.bgColor,
                                    statusConfig.borderColor,
                                    statusConfig.color
                                )}
                            >
                                <span className={cn("w-1.5 h-1.5 rounded-full mr-1.5", isCurrent && "animate-pulse", statusConfig.dotColor)} />
                                {statusConfig.label}
                            </Badge>
                            <Badge variant="secondary" className="text-xs font-semibold px-2.5 py-1 border backdrop-blur-sm bg-amber-500/15 border-amber-500/30 text-amber-700 dark:text-amber-400">
                                <SparkleIcon className="h-3 w-3 mr-1" weight="duotone" />
                                Featured
                            </Badge>
                        </div>
                    </div>

                    {/* Content */}
                    <CardContent className="p-5 space-y-4">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight mb-2 group-hover:text-primary transition-colors duration-300">
                                {event.title}
                            </h2>
                            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                                {displayText || "Join us for an exciting event!"}
                            </p>
                        </div>

                        {/* Time Info - Combined like regular cards */}
                        <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/30 border border-border/40">
                            <ClockIcon className="h-4 w-4 flex-shrink-0 text-muted-foreground" weight="duotone" />
                            <div className="text-sm leading-snug min-w-0 flex-1">
                                <span className="font-semibold text-foreground">
                                    {formatDateShort(event.startTime)} <ArrowRightIcon className="inline h-3 w-3 mx-1" weight="bold" /> {formatDateShort(event.endTime)}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </div>
            </Card>
        </Link>
    );
}

// Regular Event Card Component
function EventCard({ event }: { event: EventData }) {
    const now = new Date();
    const isCurrent = now >= event.startTime && now <= event.endTime;
    const isPast = event.endTime < now;
    const isUpcoming = event.startTime > now;

    // Use teaser content for upcoming events, regular content otherwise
    const displayImage = isUpcoming && event.teaserImage ? event.teaserImage : event.image;
    const displayText = isUpcoming && event.teaserText ? event.teaserText : event.description;

    const getStatusConfig = () => {
        if (isCurrent) {
            return {
                label: "Live",
                color: "text-white dark:text-white",
                bgColor: "bg-emerald-600/95 dark:bg-emerald-500/95",
                borderColor: "border-emerald-400/80",
                dotColor: "bg-white",
                cardGradient: "from-emerald-500/4 via-emerald-500/2 to-transparent",
                borderGlow: "shadow-emerald-500/20",
            };
        } else if (isPast) {
            return {
                label: "Ended",
                color: "text-white dark:text-white",
                bgColor: "bg-orange-600/50 dark:bg-orange-500/50",
                borderColor: "border-orange-400/80",
                dotColor: "bg-orange-200",
                cardGradient: "from-gray-500/4 via-gray-500/2 to-transparent",
                borderGlow: "shadow-gray-500/20",
            };
        } else {
            return {
                label: "Upcoming",
                color: "text-white dark:text-white",
                bgColor: "bg-blue-600/95 dark:bg-blue-500/95",
                borderColor: "border-blue-400/80",
                dotColor: "bg-white",
                cardGradient: "from-blue-500/4 via-blue-500/2 to-transparent",
                borderGlow: "shadow-blue-500/20",
            };
        }
    };

    const statusConfig = getStatusConfig();

    const formatDateShort = (date: Date) => {
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
        });
    };

    // Calculate duration or show dates
    const getDuration = () => {
        const diffTime = Math.abs(event.endTime.getTime() - event.startTime.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    // Check if dates are in the past
    const isStartPast = event.startTime < now;
    const isEndPast = event.endTime < now;

    return (
        <Link href={`/events/${event.slug}`} className="block h-full">
            <Card className={cn(
                "transition-all duration-500 p-0 group overflow-hidden relative h-full flex flex-col",
                "border",
                "hover:border-primary/40",
                "hover:shadow-lg",
                statusConfig.borderGlow
            )}>
                {/* Subtle gradient overlay that fades in */}
                <div className={cn(
                    "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0",
                    statusConfig.cardGradient
                )} />

                {/* Animated border shine effect - more subtle */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-50 transition-opacity duration-700 pointer-events-none z-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/3 to-transparent animate-shimmer" />
                </div>

                <div className="flex flex-col h-full relative z-10">
                    {/* Image with Badge on top */}
                    <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-muted to-muted/60">
                        <Image
                            src={displayImage}
                            alt={event.title}
                            fill
                            className="object-cover transition-all duration-500"
                        />
                        {/* Subtle brightness increase on hover - reduced */}
                        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/3 transition-colors duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/30 to-transparent" />

                        {/* Badge on top of image */}
                        <div className="absolute top-3 right-3">
                            <Badge
                                variant="secondary"
                                className={cn(
                                    "text-xs font-semibold px-2.5 py-1 border backdrop-blur-md shadow-lg",
                                    statusConfig.bgColor,
                                    statusConfig.borderColor,
                                    statusConfig.color
                                )}
                            >
                                <span className={cn("w-1.5 h-1.5 rounded-full mr-1.5", isCurrent && "animate-pulse", statusConfig.dotColor)} />
                                {statusConfig.label}
                            </Badge>
                        </div>
                    </div>

                    {/* Content */}
                    <CardContent className="p-5 flex flex-col flex-1 gap-4">
                        {/* Title */}
                        <div>
                            <h3 className="font-bold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors duration-500">
                                {event.title}
                            </h3>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 flex-1">
                            {displayText || "Join us for this event!"}
                        </p>

                        {/* Divider */}
                        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

                        {/* Date and Duration Info */}
                        <div className="flex items-center justify-between gap-3 text-xs">
                            {/* Start Date */}
                            <div className="flex items-center gap-2 flex-1">
                                <div className={cn(
                                    "flex items-center justify-center w-8 h-8 rounded-lg transition-colors duration-500",
                                    isStartPast
                                        ? "bg-muted/50 group-hover:bg-muted/70"
                                        : "bg-primary/10 group-hover:bg-primary/20"
                                )}>
                                    <CalendarIcon
                                        className={cn(
                                            "h-4 w-4",
                                            isStartPast ? "text-muted-foreground" : "text-primary"
                                        )}
                                        weight="duotone"
                                    />
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                                        {!isStartPast ? "Starts" : "Started"}
                                    </span>
                                    <span className={cn(
                                        "font-semibold truncate text-xs",
                                        isStartPast ? "text-muted-foreground" : "text-foreground"
                                    )}>
                                        {formatDateShort(event.startTime)}
                                    </span>
                                </div>
                            </div>

                            {/* Duration Indicator */}
                            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-muted/50 border border-border/40">
                                <ClockIcon className="h-3.5 w-3.5 text-muted-foreground" weight="duotone" />
                                <span className="font-medium text-muted-foreground">
                                    {getDuration()}{getDuration() === 1 ? 'd' : 'd'}
                                </span>
                            </div>

                            {/* End Date */}
                            <div className="flex items-center gap-2 flex-1 justify-end">
                                <div className="flex flex-col items-end min-w-0">
                                    <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                                        {!isEndPast ? "Ends" : "Ended"}
                                    </span>
                                    <span className={cn(
                                        "font-semibold truncate text-xs",
                                        isEndPast ? "text-muted-foreground" : "text-foreground"
                                    )}>
                                        {formatDateShort(event.endTime)}
                                    </span>
                                </div>
                                <div className={cn(
                                    "flex items-center justify-center w-8 h-8 rounded-lg transition-colors duration-500",
                                    isEndPast
                                        ? "bg-muted/50 group-hover:bg-muted/70"
                                        : "bg-orange-500/10 group-hover:bg-orange-500/20"
                                )}>
                                    <CalendarIcon
                                        className={cn(
                                            "h-4 w-4",
                                            isEndPast ? "text-muted-foreground" : "text-orange-600 dark:text-orange-500"
                                        )}
                                        weight="duotone"
                                    />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </div>
            </Card>
        </Link>
    );
}

// Main Events Page Component
export default function EventsPage() {
    const featuredEvent = getFeaturedEvent(events);
    const regularEvents = events.filter(event => event.slug !== featuredEvent?.slug);

    return (
        <section className="w-full">
            {/* Header */}
            <div className="px-5 md:px-10 xl:px-20 pt-8 pb-6">
                <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex-shrink-0">
                        <CalendarIcon weight="duotone" className="w-6 h-6 text-primary" />
                    </div>
                    <div className="min-w-0">
                        <h1 className="text-3xl font-bold tracking-tight">Events</h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Discover upcoming and ongoing server events
                        </p>
                    </div>
                </div>
            </div>

            {/* Featured Event */}
            {featuredEvent && (
                <div className="px-5 md:px-10 xl:px-20 pb-8">
                    <h2 className="text-xl font-bold tracking-tight mb-4">Featured Event</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                        <div className="lg:col-span-2">
                            <FeaturedEventCard event={featuredEvent} />
                        </div>
                    </div>
                </div>
            )}

            {/* Regular Events Grid */}
            {regularEvents.length > 0 && (
                <div className="px-5 md:px-10 xl:px-20 pb-10">
                    <h2 className="text-xl font-bold tracking-tight mb-4">
                        {featuredEvent ? "All Events" : "Events"}
                    </h2>
                    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                        {regularEvents.map((event) => (
                            <EventCard key={event.slug} event={event} />
                        ))}
                    </div>
                </div>
            )}

            {/* Empty State */}
            {events.length === 0 && (
                <div className="px-5 md:px-10 xl:px-20 pb-10">
                    <Card className="p-16 text-center bg-gradient-to-br from-muted/50 to-muted/20">
                        <CalendarIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground/40" weight="duotone" />
                        <h3 className="text-xl font-bold mb-2">No Events Scheduled</h3>
                        <p className="text-sm text-muted-foreground max-w-md mx-auto">
                            Check back later for upcoming server events!
                        </p>
                    </Card>
                </div>
            )}
        </section>
    );
}
