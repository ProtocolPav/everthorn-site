// app/events/[slug]/page.tsx

"use client"

import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { cn } from "@/lib/utils"
import {
    CalendarIcon,
    ClockIcon,
    ArrowLeftIcon,
    CheckCircleIcon,
    XCircleIcon,
    TrophyIcon,
    GlobeIcon,
    UsersIcon,
} from "@phosphor-icons/react"

import { events } from "../events-data"
import {use} from "react";

interface EventPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default function EventPage({ params }: EventPageProps) {
    const { slug } = use(params);

    const event = events.find(e => e.slug === slug);

    if (!event) {
        notFound();
    }

    const now = new Date();
    const isCurrent = now >= event.startTime && now <= event.endTime;
    const isPast = event.endTime < now;

    const getStatusConfig = () => {
        if (isCurrent) {
            return {
                label: "Live Now",
                color: "text-emerald-700 dark:text-emerald-300",
                bgColor: "bg-emerald-500/20 dark:bg-emerald-500/25",
                borderColor: "border-emerald-500/50",
                dotColor: "bg-emerald-600 dark:bg-emerald-400",
            };
        } else if (isPast) {
            return {
                label: "Ended",
                color: "text-orange-700 dark:text-orange-400",
                bgColor: "bg-orange-500/20 dark:bg-orange-500/25",
                borderColor: "border-orange-500/50",
                dotColor: "bg-orange-600 dark:bg-orange-400",
            };
        } else {
            return {
                label: "Upcoming",
                color: "text-blue-700 dark:text-blue-300",
                bgColor: "bg-blue-500/20 dark:bg-blue-500/25",
                borderColor: "border-blue-500/50",
                dotColor: "bg-blue-600 dark:bg-blue-400",
            };
        }
    };

    const statusConfig = getStatusConfig();

    const formatDateTime = (date: Date) => {
        return date.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
        });
    };

    const getDuration = () => {
        const diffTime = Math.abs(event.endTime.getTime() - event.startTime.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <div className="relative h-[35vh] md:h-[40vh] overflow-hidden border-b">
                <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30"/>

                {/* Back Button */}
                <Link href="/events" className="absolute top-4 left-4 md:top-6 md:left-6 z-10">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background/90 backdrop-blur-sm border hover:bg-background transition-colors shadow-sm">
                        <ArrowLeftIcon className="h-4 w-4" weight="bold"/>
                        <span className="text-sm font-medium">Back</span>
                    </div>
                </Link>

                {/* Badges */}
                <div className="absolute top-4 right-4 md:top-6 md:right-6 flex flex-wrap gap-2 justify-end z-10 max-w-[50%]">
                    <Badge
                        variant="secondary"
                        className={cn(
                            "text-xs font-semibold px-2.5 py-1 border backdrop-blur-md shadow-lg",
                            statusConfig.bgColor,
                            statusConfig.borderColor,
                            statusConfig.color
                        )}
                    >
                        <span className={cn("w-1.5 h-1.5 rounded-full mr-1.5", isCurrent && "animate-pulse", statusConfig.dotColor)}/>
                        {statusConfig.label}
                    </Badge>

                    {event.inWorld === false && (
                        <Badge variant="secondary" className="text-xs font-semibold px-2.5 py-1 border backdrop-blur-md shadow-lg bg-purple-500/40 dark:bg-purple-500/40 border-purple-500/60 text-purple-900 dark:text-purple-100">
                            <GlobeIcon className="h-3 w-3 mr-1" weight="duotone"/>
                            Custom World
                        </Badge>
                    )}

                    {event.teams !== undefined && event.teams > 0 && (
                        <Badge variant="secondary" className="text-xs font-semibold px-2.5 py-1 border backdrop-blur-md shadow-lg bg-blue-500/40 dark:bg-blue-500/40 border-blue-500/60 text-blue-900 dark:text-blue-100">
                            <UsersIcon className="h-3 w-3 mr-1" weight="duotone"/>
                            {event.teams}-player Teams
                        </Badge>
                    )}
                </div>

                {/* Title */}
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                    <div className="max-w-6xl mx-auto">
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 leading-tight">
                            {event.title}
                        </h1>
                        {event.description && (
                            <p className="text-sm md:text-base text-muted-foreground max-w-3xl">
                                {event.description}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-10 space-y-8">
                {/* Event Times Bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-lg bg-muted/30 border">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <CalendarIcon className="h-4 w-4 text-primary" weight="duotone"/>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Starts</p>
                            <p className="font-semibold text-sm">{formatDateTime(event.startTime)}</p>
                        </div>
                    </div>

                    <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md bg-background/50 border">
                        <ClockIcon className="h-4 w-4 text-muted-foreground" weight="duotone"/>
                        <span className="text-sm font-medium text-muted-foreground">{getDuration()} {getDuration() === 1 ? 'Day' : 'Days'}</span>
                    </div>

                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                            <CalendarIcon className="h-4 w-4 text-orange-600 dark:text-orange-500" weight="duotone"/>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Ends</p>
                            <p className="font-semibold text-sm">{formatDateTime(event.endTime)}</p>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                {event.stats && event.stats.length > 0 && (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        {event.stats.map((stat, index) => (
                            <div key={index} className="p-4 rounded-lg border bg-card hover:bg-muted/20 transition-colors">
                                <div className="flex items-center gap-2 mb-1.5">
                                    <stat.icon className={cn("h-4 w-4", stat.color || "text-primary")} weight="duotone"/>
                                    <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{stat.label}</span>
                                </div>
                                <p className="font-bold text-base">{stat.value}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* About */}
                <div>
                    <h2 className="text-xl font-bold mb-4">About This Event</h2>
                    <div className="p-5 rounded-lg border bg-card space-y-2.5">
                        {event.about.map((point, index) => (
                            <div key={index} className="flex items-start gap-2.5">
                                <CheckCircleIcon className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" weight="bold"/>
                                <span className="text-sm text-muted-foreground leading-relaxed">{point}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Extra Info */}
                {event.extraInfo && event.extraInfo.length > 0 && (
                    <div>
                        <h2 className="text-xl font-bold mb-4">Details</h2>
                        <div className="space-y-3">
                            {event.extraInfo.map((info, index) => (
                                <div key={index} className="p-5 rounded-lg border bg-card">
                                    <h3 className="font-bold mb-2">{info.title}</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">{info.content}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Custom Cards */}
                {event.customCards && (
                    <div>
                        <h2 className="text-xl font-bold mb-4">{event.customCards.sectionTitle}</h2>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {event.customCards.cards.map((card, index) => (
                                <div key={index} className="p-5 rounded-lg border bg-card hover:bg-muted/20 transition-colors">
                                    <div className="flex items-start gap-3 mb-3">
                                        <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center flex-shrink-0">
                                            <card.icon className={cn("h-5 w-5", card.color || "text-primary")} weight="duotone"/>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold leading-tight">{card.title}</h3>
                                            {card.subtitle && <p className="text-xs text-muted-foreground mt-0.5">{card.subtitle}</p>}
                                        </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-relaxed">{card.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Rewards */}
                <div>
                    <div className="flex items-center gap-2.5 mb-4">
                        <TrophyIcon className="h-6 w-6 text-amber-600 dark:text-amber-500" weight="duotone"/>
                        <h2 className="text-xl font-bold">Rewards & Prizes</h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                        {event.rewards.map((reward, index) => (
                            <div key={index} className="p-5 rounded-lg border bg-gradient-to-br from-amber-500/5 to-transparent">
                                <div className="flex items-center gap-2 mb-3">
                                    {reward.icon && <reward.icon className={cn("h-5 w-5", reward.color || "text-amber-600 dark:text-amber-500")} weight="duotone"/>}
                                    <h3 className="font-bold">{reward.title}</h3>
                                </div>
                                <ul className="space-y-1.5">
                                    {reward.items.map((item, idx) => (
                                        <li key={idx} className="text-sm text-muted-foreground flex gap-2">
                                            <span className="text-amber-600 dark:text-amber-500">•</span>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Rules */}
                {event.rules && (
                    <div className="grid md:grid-cols-2 gap-4">
                        {event.rules.allowed && (
                            <div>
                                <div className="flex items-center gap-2.5 mb-4">
                                    <CheckCircleIcon className="h-6 w-6 text-emerald-600 dark:text-emerald-500" weight="duotone"/>
                                    <h3 className="font-bold text-lg">Allowed</h3>
                                </div>
                                <div className="space-y-2">
                                    {event.rules.allowed.map((rule, index) => (
                                        <div key={index} className="flex items-start gap-2.5 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-sm">
                                            <CheckCircleIcon className="h-4 w-4 text-emerald-600 dark:text-emerald-500 flex-shrink-0 mt-0.5" weight="fill"/>
                                            <span>{rule}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {event.rules.disallowed && (
                            <div>
                                <div className="flex items-center gap-2.5 mb-4">
                                    <XCircleIcon className="h-6 w-6 text-red-600 dark:text-red-500" weight="duotone"/>
                                    <h3 className="font-bold text-lg">Not Allowed</h3>
                                </div>
                                <div className="space-y-2">
                                    {event.rules.disallowed.map((rule, index) => (
                                        <div key={index} className="flex items-start gap-2.5 p-3 rounded-lg bg-red-500/5 border border-red-500/20 text-sm">
                                            <XCircleIcon className="h-4 w-4 text-red-600 dark:text-red-500 flex-shrink-0 mt-0.5" weight="fill"/>
                                            <span>{rule}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* FAQ */}
                <div>
                    <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
                    <div className="rounded-lg border bg-card overflow-hidden">
                        <Accordion type="single" collapsible className="w-full">
                            {event.faq.map((item, index) => (
                                <AccordionItem key={index} value={`item-${index}`} className="border-b last:border-0 px-5">
                                    <AccordionTrigger className="text-left font-semibold py-4 hover:no-underline">
                                        {item.question}
                                    </AccordionTrigger>
                                    <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
                                        {item.answer}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </div>

                {/* Gallery */}
                {event.images && event.images.length > 0 && (
                    <div>
                        <h2 className="text-xl font-bold mb-4">Gallery</h2>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {event.images.map((image, index) => (
                                <div key={index} className="relative aspect-video rounded-lg overflow-hidden border hover:border-primary/40 transition-colors">
                                    <Image src={image.src} alt={image.alt} fill className="object-cover"/>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
