"use client"

import * as React from "react"
import {Card, CardContent} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {ArrowRightIcon, CalendarIcon, ClockIcon, GlobeIcon, SparkleIcon, TrophyIcon, UsersIcon} from "@phosphor-icons/react"
import {cn} from "@/lib/utils"
import Link from "next/link"
import Image from "next/image"

// Updated EventData interface
interface EventData {
    slug: string;
    title: string;
    startTime: Date;
    endTime: Date;
    image: string;
    teaserImage?: string;
    description?: string;
    teaserText?: string;
    // Featured-only fields
    inWorld?: boolean;
    teams?: number; // 0 for no teams, any other number for team count
    rewardTeaser?: string;
}

// Example event with featured data
const events: EventData[] = [
    {
        slug: "winter-wonderland",
        title: "Winter Wonderland Festival",
        startTime: new Date("2025-11-01T10:00:00"),
        endTime: new Date("2025-12-25T23:59:59"),
        image: "/bg.png",
        description: "Celebrate the holidays with special winter-themed activities!",
        teaserText: "Something magical is coming to the server this winter...",
        inWorld: true,
        teams: 4,
        rewardTeaser: "Exculusvie abaah"
    },
    {
        slug: "trick-or-treat",
        title: "Trick Or Treat Event",
        startTime: new Date("2025-10-31T18:00:00"),
        endTime: new Date("2025-11-01T06:00:00"),
        image: "/bg.png",
        description: "Join us for a spooky night of fun and treats on the server!",
        teaserText: "Spooky surprises await in the shadows...",
        inWorld: false,
        teams: 0,
        rewardTeaser: "Spoons"
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
                color: "text-emerald-700 dark:text-emerald-300",
                bgColor: "bg-emerald-500/20 dark:bg-emerald-500/25",
                borderColor: "border-emerald-500/50",
                dotColor: "bg-emerald-600 dark:bg-emerald-400",
                cardGradient: "from-emerald-500/8 to-transparent",
            };
        } else {
            return {
                label: "Upcoming",
                color: "text-blue-700 dark:text-blue-300",
                bgColor: "bg-blue-500/20 dark:bg-blue-500/25",
                borderColor: "border-blue-500/50",
                dotColor: "bg-blue-600 dark:bg-blue-400",
                cardGradient: "from-blue-500/8 to-transparent",
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

    const getDuration = () => {
        const diffTime = Math.abs(event.endTime.getTime() - event.startTime.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const isStartPast = event.startTime < now;
    const isEndPast = event.endTime < now;

    // Check if we should show special badges
    const showCustomWorldBadge = event.inWorld === false;
    const showTeamsBadge = event.teams && event.teams > 0;

    return (
        <Link href={`/events/${event.slug}`} className="block">
            <Card className={cn(
                "transition-all duration-500 p-0 group overflow-hidden relative",
                "border",
                "hover:border-primary/50",
                "hover:shadow-xl"
            )}>
                {/* Top accent bar */}
                <div className={cn(
                    "absolute top-0 left-0 right-0 h-1 transition-all duration-500 z-20",
                    statusConfig.cardGradient,
                    "opacity-60 group-hover:opacity-100 group-hover:h-1.5"
                )} />

                {/* Subtle gradient overlay */}
                <div className={cn(
                    "absolute inset-0 bg-gradient-to-b opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0",
                    statusConfig.cardGradient
                )} />

                <div className="flex flex-col relative z-10">
                    {/* Very Compact Image Section */}
                    <div className="relative aspect-[16/9] sm:aspect-[21/9] lg:aspect-[28/9] overflow-hidden bg-gradient-to-br from-muted to-muted/60">
                        <Image
                            src={displayImage}
                            alt={event.title}
                            fill
                            className="object-cover transition-all duration-500"
                        />
                        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/3 transition-colors duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

                        {/* Badges at bottom of image */}
                        <div className="absolute bottom-2.5 sm:bottom-3 left-3 sm:left-4 flex flex-wrap gap-1.5 sm:gap-2 max-w-[calc(100%-1.5rem)]">
                            <Badge
                                variant="secondary"
                                className={cn(
                                    "text-[11px] sm:text-xs font-semibold px-2 sm:px-2.5 py-0.5 sm:py-1 border backdrop-blur-md shadow-lg",
                                    statusConfig.bgColor,
                                    statusConfig.borderColor,
                                    statusConfig.color
                                )}
                            >
                                <span className={cn("w-1.5 h-1.5 rounded-full mr-1 sm:mr-1.5", isCurrent && "animate-pulse", statusConfig.dotColor)} />
                                {statusConfig.label}
                            </Badge>

                            <Badge
                                variant="secondary"
                                className="text-[11px] sm:text-xs font-semibold px-2 sm:px-2.5 py-0.5 sm:py-1 border backdrop-blur-md shadow-lg bg-amber-500/20 dark:bg-amber-500/25 border-amber-500/50 text-amber-700 dark:text-amber-300"
                            >
                                <SparkleIcon className="h-2.5 sm:h-3 w-2.5 sm:w-3 mr-1" weight="duotone" />
                                Featured
                            </Badge>

                            {/* Custom World Badge */}
                            {showCustomWorldBadge && (
                                <Badge
                                    variant="secondary"
                                    className="text-[11px] sm:text-xs font-semibold px-2 sm:px-2.5 py-0.5 sm:py-1 border backdrop-blur-md shadow-lg bg-purple-500/20 dark:bg-purple-500/25 border-purple-500/50 text-purple-700 dark:text-purple-300"
                                >
                                    <GlobeIcon className="h-2.5 sm:h-3 w-2.5 sm:w-3 mr-1" weight="duotone" />
                                    Custom World
                                </Badge>
                            )}

                            {/* Teams Badge */}
                            {showTeamsBadge && (
                                <Badge
                                    variant="secondary"
                                    className="text-[11px] sm:text-xs font-semibold px-2 sm:px-2.5 py-0.5 sm:py-1 border backdrop-blur-md shadow-lg bg-blue-500/20 dark:bg-blue-500/25 border-blue-500/50 text-blue-700 dark:text-blue-300"
                                >
                                    <UsersIcon className="h-2.5 sm:h-3 w-2.5 sm:w-3 mr-1" weight="duotone" />
                                    {event.teams}-player Teams
                                </Badge>
                            )}
                        </div>
                    </div>

                    {/* Very Compact Content Section */}
                    <div className="p-4 sm:p-5 space-y-3 sm:space-y-3.5">
                        {/* Title and Description */}
                        <div className="space-y-2">
                            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight leading-tight group-hover:text-primary transition-colors duration-500">
                                {event.title}
                            </h2>
                            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-2">
                                {displayText || "Join us for an exciting event!"}
                            </p>
                        </div>

                        {/* Reward Teaser */}
                        {event.rewardTeaser && (
                            <div className="flex items-start gap-2 p-2.5 sm:p-3 rounded-lg bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20">
                                <TrophyIcon className="h-3.5 sm:h-4 w-3.5 sm:w-4 text-amber-600 dark:text-amber-500 mt-0.5 flex-shrink-0" weight="duotone" />
                                <div className="flex-1 min-w-0">
                                    <span className="text-[10px] sm:text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wide block mb-0.5">
                                        Rewards
                                    </span>
                                    <p className="text-xs sm:text-sm font-medium text-foreground leading-snug line-clamp-1">
                                        {event.rewardTeaser}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Divider */}
                        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

                        {/* Date and Duration Info - FROM REGULAR CARD */}
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
                    </div>
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
