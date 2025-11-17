"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { GameControllerIcon, MagnifyingGlassIcon, LockKeyIcon, CalendarIcon } from "@phosphor-icons/react";
import {
    Card,
    CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface EventData {
    slug: string;
    title: string;
    date: Date;
    image: string;
    description?: string;
    teaserText?: string;
}

const eventsData: EventData[] = [
    {
        slug: "winter-wonderland",
        title: "Winter Wonderland Festival",
        date: new Date("2025-12-20"),
        image: "/bg.png",
        description: "Celebrate the holidays with special winter-themed activities!",
        teaserText: "Something magical is coming to the server this winter..."
    },
    {
        slug: "trick-or-treat",
        title: "Trick Or Treat Event",
        date: new Date("2025-10-31"),
        image: "/bg.png",
        description: "Join us for a spooky night of fun and treats on the server!",
        teaserText: "Spooky surprises await in the shadows..."
    },
    {
        slug: "summer-festival",
        title: "Summer Festival",
        date: new Date("2024-08-15"),
        image: "/bg.png",
        description: "Epic summer celebration with exclusive rewards!"
    }
];

export default function EventsPage() {
    const [searchQuery, setSearchQuery] = useState("");

    const getEventStatus = (date: Date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const eventDate = new Date(date);
        eventDate.setHours(0, 0, 0, 0);

        if (eventDate > today) return "upcoming";
        if (eventDate.getTime() === today.getTime()) return "live";
        return "past";
    };

    const formatDate = (date: Date) => {
        return {
            month: date.toLocaleDateString("en-US", { month: "short" }),
            day: date.getDate(),
            year: date.getFullYear(),
            fullDate: date.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric"
            })
        };
    };

    const filteredEvents = useMemo(() => {
        let filtered = [...eventsData];

        if (searchQuery.trim()) {
            filtered = filtered.filter(event =>
                event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                event.description?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        return filtered.sort((a, b) => b.date.getTime() - a.date.getTime());
    }, [searchQuery]);

    const TeaserCard = ({ event }: { event: EventData }) => {
        const dateInfo = formatDate(event.date);

        return (
            <div className="group relative">
                <Card className="overflow-hidden border-0 h-[400px] relative bg-transparent">
                    {/* Full background image */}
                    <div className="absolute inset-0">
                        <Image
                            src={event.image}
                            alt={event.title}
                            fill
                            className="object-cover"
                        />
                    </div>

                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

                    {/* Glassmorphism overlay for content */}
                    <div className="absolute inset-0 flex flex-col justify-end p-6">
                        {/* Top badges */}
                        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                            <Badge
                                className="bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold px-3 py-1"
                            >
                                <LockKeyIcon className="w-3.5 h-3.5 mr-1.5" weight="duotone" />
                                Coming Soon
                            </Badge>

                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-medium px-3 py-1.5 rounded-full">
                                <CalendarIcon className="w-3.5 h-3.5" weight="duotone" />
                                {dateInfo.month} {dateInfo.day}, {dateInfo.year}
                            </div>
                        </div>

                        {/* Content area with blur */}
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 space-y-3">
                            <h3 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                                {event.title}
                            </h3>

                            {event.teaserText && (
                                <p className="text-white/80 text-base md:text-lg italic">
                                    {event.teaserText}
                                </p>
                            )}

                            <div className="pt-2">
                                <span className="text-white/60 text-sm">
                                    Details will be revealed soon
                                </span>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        );
    };

    const RegularCard = ({ event }: { event: EventData }) => {
        const status = getEventStatus(event.date);
        const dateInfo = formatDate(event.date);
        const isLive = status === "live";

        return (
            <Link href={`/events/${event.slug}`} className="group block">
                <Card className="overflow-hidden border hover:border-foreground/20 transition-all duration-300 hover:shadow-lg h-[320px] relative p-0">
                    {/* Full background image */}
                    <div className="absolute inset-0">
                        <Image
                            src={event.image}
                            alt={event.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    </div>

                    {/* Gradient overlay - always visible but subtle */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                    {/* Content */}
                    <CardContent className="absolute inset-0 p-4 flex flex-col justify-between">
                        {/* Top section with badges */}
                        <div className="flex items-start justify-between">
                            {isLive && (
                                <Badge className="bg-emerald-500/90 backdrop-blur-sm border-0 text-white font-semibold">
                                    <span className="w-1.5 h-1.5 rounded-full bg-white mr-1.5 animate-pulse" />
                                    Live Now
                                </Badge>
                            )}
                            {!isLive && (
                                <Badge variant="secondary" className="bg-muted/80 backdrop-blur-sm font-medium">
                                    Past Event
                                </Badge>
                            )}
                        </div>

                        {/* Bottom section with title and description */}
                        <div className="space-y-2">
                            {event.description && (
                                <p className="text-white/70 text-xs line-clamp-2 leading-relaxed">
                                    {event.description}
                                </p>
                            )}

                            <h4 className="text-white text-xl font-bold leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                                {event.title}
                            </h4>

                            <div className="flex items-center gap-2 text-white/60 text-xs font-medium pt-1">
                                <CalendarIcon className="w-3.5 h-3.5" weight="duotone" />
                                {dateInfo.fullDate}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </Link>
        );
    };

    const groupedEvents = useMemo(() => {
        return {
            upcoming: filteredEvents.filter(e => getEventStatus(e.date) === "upcoming"),
            other: filteredEvents.filter(e => getEventStatus(e.date) !== "upcoming")
        };
    }, [filteredEvents]);

    return (
        <section className="mx-5 grid items-center gap-6 pt-6 md:mx-10 md:pb-10 xl:mx-20">
            {/* Header Section */}
            <div className="grid gap-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted flex-shrink-0">
                        <GameControllerIcon weight={'duotone'} className="w-5 h-5 text-muted-foreground"/>
                    </div>
                    <div className="min-w-0">
                        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Server Events</h1>
                        <p className="text-sm text-muted-foreground">Join exciting events and compete for rewards</p>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative max-w-sm">
                    <MagnifyingGlassIcon
                        className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                        weight="bold"
                    />
                    <Input
                        placeholder="Search events..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 h-9"
                    />
                </div>
            </div>

            {/* Upcoming Events (Teaser Cards) */}
            {groupedEvents.upcoming.length > 0 && (
                <div className="space-y-3">
                    <h2 className="text-lg font-semibold">Upcoming Events</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {groupedEvents.upcoming.map((event) => (
                            <TeaserCard key={event.slug} event={event} />
                        ))}
                    </div>
                </div>
            )}

            {/* Past & Live Events (Regular Cards) */}
            {groupedEvents.other.length > 0 && (
                <div className="space-y-3">
                    {groupedEvents.upcoming.length > 0 && (
                        <h2 className="text-lg font-semibold">Past Events</h2>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {groupedEvents.other.map((event) => (
                            <RegularCard key={event.slug} event={event} />
                        ))}
                    </div>
                </div>
            )}

            {/* Empty State */}
            {filteredEvents.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-muted mb-3">
                        <CalendarIcon className="w-6 h-6 text-muted-foreground" weight="duotone" />
                    </div>
                    <h3 className="text-sm font-semibold mb-1">No Events Found</h3>
                    <p className="text-xs text-muted-foreground">
                        Try adjusting your search
                    </p>
                </div>
            )}
        </section>
    );
}
