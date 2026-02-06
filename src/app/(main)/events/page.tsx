"use client"

import * as React from "react"
import {Card, CardContent} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {ArrowRightIcon, CalendarIcon, ClockIcon, GlobeIcon, SparkleIcon, TrophyIcon, UsersIcon} from "@phosphor-icons/react"
import {cn} from "@/lib/utils"
import Link from "next/link"
import Image from "next/image"
import {events} from "./events-data";
import {EventData} from "@/types/events";
import {format} from "date-fns";

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
    const showTeamsBadge = event.teams !== undefined && event.teams > 0;

    const isClickable = isUpcoming || event.clickable

    // Wrapper component - conditionally use Link
    const Wrapper = !isClickable ? 'div' : Link;
    const wrapperProps = !isClickable ? { className: "block" } : { href: `/events/${event.slug}`, className: "block" };

    return (
        // @ts-ignore
        <Wrapper {...wrapperProps}>
            <Card className={cn(
                "transition-all duration-500 p-0 overflow-hidden relative",
                "border",
                isClickable && "group hover:border-primary/30 hover:shadow-xl cursor-pointer",
                !isClickable && "cursor-default"
            )}>
                {/* Top accent bar */}
                <div className={cn(
                    "absolute top-0 left-0 right-0 h-1 transition-all duration-500 z-20",
                    statusConfig.cardGradient,
                    isClickable && "opacity-60 group-hover:opacity-100 group-hover:h-1.5",
                    !isClickable && "opacity-60"
                )} />

                {/* Subtle gradient overlay */}
                <div className={cn(
                    "absolute inset-0 bg-gradient-to-b transition-opacity duration-700 pointer-events-none z-0",
                    statusConfig.cardGradient,
                    isClickable && "opacity-0 group-hover:opacity-100",
                    !isClickable && "opacity-0"
                )} />

                <div className="flex flex-col relative z-10">
                    {/* Very Compact Image Section */}
                    <div className="relative aspect-[16/9] sm:aspect-[21/9] lg:aspect-[24/9] overflow-hidden bg-gradient-to-br from-muted to-muted/60">
                        <Image
                            src={displayImage}
                            alt={event.title}
                            fill
                            className="object-cover transition-all duration-500"
                        />
                        <div className={cn(
                            "absolute inset-0 transition-colors duration-500"
                        )} />
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
                                    className="text-[11px] sm:text-xs font-semibold px-2 sm:px-2.5 py-0.5 sm:py-1 border backdrop-blur-md shadow-lg bg-red-500/20 dark:bg-red-500/25 border-red-500/50 text-red-700 dark:text-red-300"
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
                            <h2 className={cn(
                                "text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight leading-tight transition-colors duration-500",
                                !isUpcoming && "group-hover:text-primary"
                            )}>
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

                        {/* Date and Duration Info */}
                        <div className="flex items-center justify-between gap-3 text-xs">
                            {/* Start Date */}
                            <div className="flex items-center gap-2 flex-1">
                                <div className={cn(
                                    "flex items-center justify-center w-8 h-8 rounded-lg transition-colors duration-500",
                                    isStartPast
                                        ? "bg-muted/50"
                                        : !isUpcoming ? "bg-primary/10 group-hover:bg-primary/20" : "bg-primary/10"
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
                                        {format(event.startTime, "E PP")}
                                    </span>
                                </div>
                            </div>

                            {/* Duration Indicator */}
                            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-muted/50 border border-border/40">
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
                                        {format(event.endTime, "E PP")}
                                    </span>
                                </div>
                                <div className={cn(
                                    "flex items-center justify-center w-8 h-8 rounded-lg transition-colors duration-500",
                                    isEndPast
                                        ? "bg-muted/50"
                                        : !isUpcoming ? "bg-orange-500/10 group-hover:bg-orange-500/20" : "bg-orange-500/10"
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

                        {/* Duration Indicator - Mobile */}
                        <div className="flex md:hidden justify-center items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-muted/50 border border-border/40">
                            <ClockIcon className="h-3.5 w-3.5 text-muted-foreground" weight="duotone" />
                            <span className="text-sm font-medium text-muted-foreground">
                                    {getDuration()} {getDuration() === 1 ? 'day' : 'days'}
                            </span>
                        </div>
                    </div>
                </div>
            </Card>
        </Wrapper>
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

    const getDuration = () => {
        const diffTime = Math.abs(event.endTime.getTime() - event.startTime.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const isStartPast = event.startTime < now;
    const isEndPast = event.endTime < now;

    // Wrapper component - conditionally use Link
    const Wrapper = isUpcoming ? 'div' : Link;
    const wrapperProps = isUpcoming ? { className: "block h-full" } : { href: `/events/${event.slug}`, className: "block h-full" };

    return (
        // @ts-ignore
        <Wrapper {...wrapperProps}>
            <Card className={cn(
                "transition-all duration-500 p-0 overflow-hidden relative h-full flex flex-col",
                "border",
                statusConfig.borderGlow,
                !isUpcoming && "group hover:border-primary/40 hover:shadow-lg cursor-pointer",
                isUpcoming && "cursor-default"
            )}>
                {/* Subtle gradient overlay */}
                <div className={cn(
                    "absolute inset-0 bg-gradient-to-br transition-opacity duration-700 pointer-events-none z-0",
                    statusConfig.cardGradient,
                    !isUpcoming && "opacity-0 group-hover:opacity-100",
                    isUpcoming && "opacity-0"
                )} />

                {/* Animated border shine effect */}
                {!isUpcoming && (
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-50 transition-opacity duration-700 pointer-events-none z-0">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/3 to-transparent animate-shimmer" />
                    </div>
                )}

                <div className="flex flex-col h-full relative z-10">
                    {/* Image with Badge on top */}
                    <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-muted to-muted/60">
                        <Image
                            src={displayImage}
                            alt={event.title}
                            fill
                            className="object-cover transition-all duration-500"
                        />
                        <div className={cn(
                            "absolute inset-0 transition-colors duration-500",
                            !isUpcoming && "bg-white/0 group-hover:bg-white/3"
                        )} />
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
                            <h3 className={cn(
                                "font-bold text-lg leading-tight line-clamp-2 transition-colors duration-500",
                                !isUpcoming && "group-hover:text-primary"
                            )}>
                                {event.title}
                            </h3>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 flex-1">
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
                                        ? "bg-muted/50"
                                        : !isUpcoming ? "bg-primary/10 group-hover:bg-primary/20" : "bg-primary/10"
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
                                        {format(event.startTime, "E PP")}
                                    </span>
                                </div>
                            </div>

                            {/* Duration Indicator */}
                            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-muted/50 border border-border/40">
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
                                        {format(event.endTime, "E PP")}
                                    </span>
                                </div>
                                <div className={cn(
                                    "flex items-center justify-center w-8 h-8 rounded-lg transition-colors duration-500",
                                    isEndPast
                                        ? "bg-muted/50"
                                        : !isUpcoming ? "bg-orange-500/10 group-hover:bg-orange-500/20" : "bg-orange-500/10"
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

                        {/* Duration Indicator - Mobile */}
                        <div className="flex md:hidden justify-center items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-muted/50 border border-border/40">
                            <ClockIcon className="h-3.5 w-3.5 text-muted-foreground" weight="duotone" />
                            <span className="text-sm font-medium text-muted-foreground">
                                    {getDuration()} {getDuration() === 1 ? 'day' : 'days'}
                            </span>
                        </div>
                    </CardContent>
                </div>
            </Card>
        </Wrapper>
    );
}

// Main Events Page Component
export default function EventsPage() {
    const shownEvents = events.filter(event => !event.hidden)

    const featuredEvent = getFeaturedEvent(shownEvents);
    const regularEvents = shownEvents.filter(event => event.slug !== featuredEvent?.slug);

    return (
        <section className="w-full">
            {/* Compact Header */}
            <div className="px-5 md:px-10 xl:px-20 pt-8 pb-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                            <CalendarIcon weight="duotone" className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold">Events</h1>
                            <p className="text-xs text-muted-foreground">Discover what's happening</p>
                        </div>
                    </div>

                    {shownEvents.length > 0 && (
                        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                            <span className="text-xs font-medium text-muted-foreground">
                                {shownEvents.length} {shownEvents.length === 1 ? 'Event' : 'Events'}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="px-5 md:px-10 xl:px-20 pb-16 space-y-10">
                {/* Featured Event Section - Special Container */}
                {featuredEvent && (
                    <div className="relative -mx-5 md:mx-0">
                        {/* Background container with gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-background to-background md:rounded-2xl -z-10" />
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent md:rounded-2xl -z-10" />

                        {/* Decorative blur elements */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -z-10" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10" />

                        {/* Content */}
                        <div className="relative px-5 md:px-8 py-5 md:py-8 space-y-4 md:space-y-5">
                            <div className="flex items-center gap-2.5">
                                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-500/10">
                                    <SparkleIcon className="h-4 w-4 text-amber-600 dark:text-amber-500" weight="duotone" />
                                </div>
                                <h2 className="text-xl font-bold">Featured Event</h2>
                            </div>

                            <div className="max-w-4xl">
                                <FeaturedEventCard event={featuredEvent} />
                            </div>
                        </div>
                    </div>
                )}

                {/* Regular Events Grid */}
                {regularEvents.length > 0 && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <CalendarIcon className="h-5 w-5 text-primary" weight="duotone" />
                                <h2 className="text-xl font-bold">
                                    {featuredEvent ? "More Events" : "All Events"}
                                </h2>
                            </div>
                            <span className="text-xs text-muted-foreground font-medium">
                                {regularEvents.length} {regularEvents.length === 1 ? 'event' : 'events'}
                            </span>
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                            {regularEvents.map((event) => (
                                <EventCard key={event.slug} event={event} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {shownEvents.length === 0 && (
                    <div className="flex items-center justify-center min-h-[50vh]">
                        <div className="text-center max-w-md">
                            <div className="relative w-20 h-20 mx-auto mb-6">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl rotate-6" />
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent rounded-xl flex items-center justify-center">
                                    <CalendarIcon className="w-10 h-10 text-muted-foreground/40" weight="duotone" />
                                </div>
                            </div>
                            <h3 className="text-xl font-bold mb-2">No Events Scheduled</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Check back soon for upcoming events and activities!
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
