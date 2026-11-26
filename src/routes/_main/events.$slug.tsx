import {createFileRoute, Link} from '@tanstack/react-router'
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
    InfoIcon,
    ImagesIcon
} from "@phosphor-icons/react"

import {events} from "@/config/events"
import {NotFoundScreen} from "@/components/errors/not-found.tsx";

export const Route = createFileRoute('/_main/events/$slug')({
    component: EventPage,
    loader: async ({ params }) => {
        const event = events.find(e => e.slug === params.slug);
        if (!event) return { event: null };
        return {
            event: {
                title: event.title,
                description: event.description,
                image: event.image,
            }
        };
    },
    head: ({ params, loaderData }) => ({
        meta: [
            {
                property: 'og:title',
                content: `${loaderData?.event?.title ?? 'Event'} | Everthorn`,
            },
            {
                property: 'og:description',
                content: loaderData?.event?.description ?? "An Everthorn Event",
            },
            {
                property: 'og:image',
                content: loaderData?.event?.image
                    ? `${import.meta.env.VITE_BASE_URL}${loaderData.event.image}`
                    : `${import.meta.env.VITE_BASE_URL}/landing/spawn.png`,
            },
            {
                property: 'og:url',
                content: `${import.meta.env.VITE_BASE_URL}/events/${params.slug}`,
            },
            {
                name: 'twitter:title',
                content: `${loaderData?.event?.title ?? 'Event'} | Everthorn`
            },
            {
                name: 'twitter:description',
                content: loaderData?.event?.description ?? "An Everthorn Event"
            },
            {
                name: 'twitter:image',
                content: loaderData?.event?.image
                    ? `${import.meta.env.VITE_BASE_URL}${loaderData.event.image}`
                    : `${import.meta.env.VITE_BASE_URL}/landing/spawn.png`,
            },
            {
                name: 'twitter:url',
                content: `${import.meta.env.VITE_BASE_URL}/events/${params.slug}`,
            }
        ],
    }),
})

function EventPage() {
    const { slug } = Route.useParams();

    const event = events.find(e => e.slug === slug);

    if (!event) {
        return NotFoundScreen()
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
            <div className="relative h-[38vh] md:h-[44vh] overflow-hidden border-b">
                <img
                    src={event.image}
                    alt={event.title}
                    className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/75 to-background/20"/>
                <div className="absolute inset-0 bg-gradient-to-r from-background/40 via-transparent to-transparent"/>

                {/* Back Button */}
                <Link to="/events" className="absolute top-4 left-4 md:top-6 md:left-6 z-10">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background/80 backdrop-blur-md border border-border/60 hover:bg-background transition-colors shadow-sm">
                        <ArrowLeftIcon className="h-4 w-4" weight="bold"/>
                        <span className="text-sm font-medium">Back</span>
                    </div>
                </Link>

                {/* Badges */}
                <div className="absolute top-4 right-4 md:top-6 md:right-6 flex flex-wrap gap-2 justify-end z-10 max-w-[55%]">
                    <Badge
                        variant="secondary"
                        className={cn(
                            "text-xs font-semibold px-2.5 py-1 border backdrop-blur-md shadow-sm",
                            statusConfig.bgColor,
                            statusConfig.borderColor,
                            statusConfig.color
                        )}
                    >
                        <span className={cn("w-1.5 h-1.5 rounded-full mr-1.5", isCurrent && "animate-pulse", statusConfig.dotColor)}/>
                        {statusConfig.label}
                    </Badge>

                    {event.inWorld === false && (
                        <Badge variant="secondary" className="text-xs font-semibold px-2.5 py-1 border backdrop-blur-md shadow-sm bg-purple-500/30 border-purple-500/50 text-purple-900 dark:text-purple-100">
                            <GlobeIcon className="h-3 w-3 mr-1" weight="duotone"/>
                            Custom World
                        </Badge>
                    )}

                    {event.teams !== undefined && event.teams > 0 && (
                        <Badge variant="secondary" className="text-xs font-semibold px-2.5 py-1 border backdrop-blur-md shadow-sm bg-blue-500/30 border-blue-500/50 text-blue-900 dark:text-blue-100">
                            <UsersIcon className="h-3 w-3 mr-1" weight="duotone"/>
                            {event.teams}-player Teams
                        </Badge>
                    )}
                </div>

                {/* Title */}
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                    <div className="max-w-5xl mx-auto">
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 leading-tight tracking-tight">
                            {event.title}
                        </h1>
                        {event.description && (
                            <p className="text-sm md:text-base text-muted-foreground max-w-2xl">
                                {event.description}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-12 space-y-12">

                {/* Event Times + Stats — unified info strip */}
                <div className="rounded-xl border bg-card/50 overflow-hidden">
                    <div className="grid grid-cols-2 sm:grid-cols-3 divide-x divide-y sm:divide-y-0 divide-border">
                        <div className="flex items-center gap-2.5 p-3.5 sm:p-4 col-span-2 sm:col-span-1">
                            <CalendarIcon className="h-4 w-4 text-primary flex-shrink-0" weight="duotone"/>
                            <div className="min-w-0">
                                <p className="text-[10px] sm:text-[11px] text-muted-foreground font-medium uppercase tracking-wide">Starts</p>
                                <p className="font-semibold text-xs sm:text-sm truncate">{formatDateTime(event.startTime)}</p>
                            </div>
                        </div>
                        <div className="hidden sm:flex items-center gap-2.5 p-4 justify-center">
                            <ClockIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" weight="duotone"/>
                            <span className="text-sm font-medium text-muted-foreground">{getDuration()} {getDuration() === 1 ? 'Day' : 'Days'}</span>
                        </div>
                        <div className="flex items-center gap-2.5 p-3.5 sm:p-4 col-span-2 sm:col-span-1">
                            <CalendarIcon className="h-4 w-4 text-orange-500 flex-shrink-0" weight="duotone"/>
                            <div className="min-w-0">
                                <p className="text-[10px] sm:text-[11px] text-muted-foreground font-medium uppercase tracking-wide">Ends</p>
                                <p className="font-semibold text-xs sm:text-sm truncate">{formatDateTime(event.endTime)}</p>
                            </div>
                        </div>

                        {/* Duration shown as its own full-width row on mobile only */}
                        <div className="col-span-2 sm:hidden flex items-center justify-center gap-2 p-2.5 border-t border-border bg-muted/20">
                            <ClockIcon className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" weight="duotone"/>
                            <span className="text-xs font-medium text-muted-foreground">{getDuration()} {getDuration() === 1 ? 'Day' : 'Days'}</span>
                        </div>
                    </div>

                    {event.stats && event.stats.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 border-t divide-x divide-y sm:divide-y-0 divide-border">
                            {event.stats.map((stat, index) => (
                                <div key={index} className="flex items-center gap-2 p-3.5 sm:p-4 min-w-0">
                                    <stat.icon className={cn("h-4 w-4 flex-shrink-0", stat.color || "text-primary")} weight="duotone"/>
                                    <div className="min-w-0">
                                        <p className="text-[10px] sm:text-[11px] text-muted-foreground font-medium uppercase tracking-wide">{stat.label}</p>
                                        <p className="font-bold text-xs sm:text-sm truncate">{stat.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* About */}
                <div>
                    <h2 className="text-xl font-bold mb-4">About This Event</h2>
                    <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-3">
                        {event.about.map((point, index) => (
                            <li key={index} className="flex items-start gap-2.5">
                                <CheckCircleIcon className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" weight="bold"/>
                                <span className="text-sm text-muted-foreground leading-relaxed">{point}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Extra Info — Timeline */}
                {event.extraInfo && event.extraInfo.length > 0 && (
                    <div>
                        <div className="flex items-center gap-2.5 mb-6">
                            <InfoIcon className="h-5 w-5 text-primary" weight="duotone"/>
                            <h2 className="text-xl font-bold">Event Timeline</h2>
                        </div>
                        <div className="relative pl-8 space-y-8">
                            <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border"/>
                            {event.extraInfo.map((info, index) => (
                                <div key={index} className="relative">
                                    <span className="absolute -left-8 top-1 w-3.5 h-3.5 rounded-full bg-primary ring-4 ring-background"/>
                                    <h3 className="font-bold mb-1.5 leading-snug">{info.title}</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">{info.content}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Custom Cards */}
                {event.customCards &&
                    event.customCards.map((c) => {
                        return (
                            <div>
                                <h2 className="text-xl font-bold mb-4">{c.sectionTitle}</h2>
                                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {c.cards.map((card, index) => (
                                        <div key={index} className="p-5 rounded-xl border bg-card hover:border-primary/40 hover:shadow-sm transition-all">
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
                        )
                    }
                )}

                {/* Rewards */}
                <div>
                    <div className="flex items-center gap-2.5 mb-5">
                        <TrophyIcon className="h-5 w-5 text-amber-600 dark:text-amber-500" weight="duotone"/>
                        <h2 className="text-xl font-bold">Rewards & Prizes</h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                        {event.rewards.map((reward, index) => (
                            <div key={index} className="rounded-xl border overflow-hidden">
                                <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-500/10 to-transparent border-b">
                                    {reward.icon && <reward.icon className={cn("h-4.5 w-4.5", reward.color || "text-amber-600 dark:text-amber-500")} weight="duotone"/>}
                                    <h3 className="font-bold text-sm">{reward.title}</h3>
                                </div>
                                <ul className="p-4 space-y-2.5">
                                    {reward.items.map((item, idx) => (
                                        <li key={idx} className="text-sm text-muted-foreground flex gap-2">
                                            <span className="text-amber-600 dark:text-amber-500 flex-shrink-0">•</span>
                                            <span className="leading-relaxed">{item}</span>
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
                    <div className="rounded-xl border bg-card/50 overflow-hidden">
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
                        <div className="flex items-center gap-2.5 mb-4">
                            <ImagesIcon className="h-5 w-5 text-primary" weight="duotone"/>
                            <h2 className="text-xl font-bold">Gallery</h2>
                        </div>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {event.images.map((image, index) => (
                                <div key={index} className="relative aspect-video rounded-xl overflow-hidden border hover:border-primary/40 transition-colors">
                                    <img src={image.src} alt={image.alt} className="object-cover w-full h-full"/>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
