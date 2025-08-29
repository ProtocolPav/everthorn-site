'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    type CarouselApi
} from '@/components/ui/carousel'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'
import {
    CalendarIcon,
    ClockIcon,
    UsersIcon,
    GhostIcon,
    CubeIcon,
    MapPinIcon,
    DiamondIcon,
    WarningIcon,
    SkullIcon,
    CoinsIcon,
    CheckCircleIcon,
    XCircleIcon
} from '@phosphor-icons/react'

// Halloween Event Configuration - MODULAR
const eventConfig = {
    title: "Trick or Treat",
    subtitle: "Halloween Survival Adventure",
    startDate: "October 31, 2025",
    endDate: "November 2, 2025",
    shortDescription: "Venture into a spooky pale oak forest filled with mysteries, lucky blocks, and supernatural surprises!",

    overview: "Enter a mysterious pale oak forest where nothing is as it seems. Armed with only basic copper gear, you must survive, explore, and collect resources to trade for lucky blocks.",

    stats: [
        { icon: MapPinIcon, label: "World Size", value: "2000x2000 blocks", color: "text-blue-500" },
        { icon: ClockIcon, label: "Duration", value: "3 days", color: "text-green-500" },
        { icon: UsersIcon, label: "Players", value: "Unlimited", color: "text-purple-500" },
        { icon: SkullIcon, label: "Difficulty", value: "Survival", color: "text-red-500" }
    ],

    luckyBlocks: [
        {
            icon: DiamondIcon,
            name: "Super Lucky Block",
            cost: "10 Diamonds",
            description: "Highest tier with extreme rewards and risks",
            color: "text-cyan-400"
        },
        {
            icon: CoinsIcon,
            name: "Lucky Block",
            cost: "10 Gold Ingots",
            description: "Balanced tier with moderate surprises",
            color: "text-yellow-500"
        },
        {
            icon: CubeIcon,
            name: "Kinda Lucky Block",
            cost: "10 Iron Ingots",
            description: "Entry level with basic tricks and treats",
            color: "text-slate-400"
        }
    ],

    eventRules: [
        "Spawn automatically at base camp in the pale oak forest",
        "Collect starting gear from supply chests at base camp",
        "Stay within the 2000x2000 block world border",
        "Mine resources to trade for lucky blocks",
        "Only items in your shulker box transfer back",
        "No raw ores can be transferred back",
        "Event runs for 3 days total"
    ],

    transferRules: [
        { icon: CheckCircleIcon, rule: "Items in shulker box", allowed: true },
        { icon: XCircleIcon, rule: "Raw ores (diamonds, gold, iron)", allowed: false },
        { icon: XCircleIcon, rule: "Lucky blocks themselves", allowed: false },
        { icon: CheckCircleIcon, rule: "Event-exclusive items", allowed: true },
        { icon: CheckCircleIcon, rule: "Crafted items", allowed: true },
        { icon: WarningIcon, rule: "Rare items (admin approval)", allowed: null }
    ],

    faq: [
        {
            q: "How do I start the event?",
            a: "You'll automatically spawn at base camp. Collect your gear and start exploring."
        },
        {
            q: "What's the goal?",
            a: "Survive, gather resources, trade for lucky blocks, and collect transferable rewards."
        },
        {
            q: "Can I work with others?",
            a: "Yes! Team up to gather resources and share risks."
        },
        {
            q: "What transfers back?",
            a: "Only items in your shulker box transfer to the main world."
        }
    ],

    images: [
        { src: "/bg.png", alt: "Spooky forest" }
    ]
}

const EventPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-background">
            <div>
                <div className="w-full h-[45vh] md:h-[60vh] overflow-hidden">
                    <img
                        src={eventConfig.images[0].src}
                        alt={eventConfig.images[0].alt}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Content Section - Below Image */}
                <div className="max-w-4xl mx-auto px-4 py-8 -mt-16 relative z-10">
                    <div className="bg-background rounded-lg shadow-lg p-6 md:p-8">
                        <div className="flex flex-wrap gap-2 mb-4">
                            <Badge className="bg-orange-600 text-xs">
                                <CalendarIcon className="w-3 h-3 mr-1" />
                                {eventConfig.startDate}
                            </Badge>
                            <Badge className="bg-purple-600 text-xs">
                                <GhostIcon className="w-3 h-3 mr-1" />
                                Halloween
                            </Badge>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-4">
                            {eventConfig.title}
                        </h1>

                        {/* Overview moved here */}
                        <p className="mb-4 text-sm text-muted-foreground">{eventConfig.overview}</p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {eventConfig.stats.map((stat, index) => {
                                const Icon = stat.icon
                                return (
                                    <div key={index} className="text-center p-2 bg-muted/50 rounded">
                                        <Icon className={`w-4 h-4 ${stat.color} mx-auto mb-1`} />
                                        <div className="font-semibold text-xs">{stat.value}</div>
                                        <div className="text-xs text-muted-foreground">{stat.label}</div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">

                <Card className={'gap-0'}>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base">Event Rules</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <div className="space-y-3">
                            {eventConfig.eventRules.map((rule, index) => (
                                <div key={index} className="flex gap-3">
                    <span className="text-orange-600 font-bold text-sm">
                        {String(index + 1).padStart(2, '0')}.
                    </span>
                                    <span className="text-sm">{rule}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Lucky Block Trading - Enhanced */}
                <Card className={'gap-0'}>
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-base">
                            <CubeIcon className="w-4 h-4 text-yellow-500" />
                            Lucky Block Trading
                        </CardTitle>
                        <CardDescription className="text-sm">
                            Trade resources at base camp for different tiers of lucky blocks
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <div className="space-y-2">
                            {eventConfig.luckyBlocks.map((block, index) => {
                                const Icon = block.icon
                                return (
                                    <div key={index} className="flex items-start gap-3 p-2 border rounded-sm">
                                        <Icon className={`w-4 h-4 ${block.color} mt-0.5`} />
                                        <div className="flex-grow">
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="font-medium text-sm">{block.name}</span>
                                                <span className="text-xs text-muted-foreground">{block.cost}</span>
                                            </div>
                                            <p className="text-xs text-muted-foreground">{block.description}</p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Transfer Rules - Grid with Icons */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-base">
                            <WarningIcon className="w-4 h-4 text-amber-500" />
                            Transfer Rules
                        </CardTitle>
                        <CardDescription className="text-sm">
                            What you can and cannot bring back to the main world
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <div className="grid md:grid-cols-2 gap-2">
                            {eventConfig.transferRules.map((rule, index) => {
                                const Icon = rule.icon
                                const colorClass = rule.allowed === true ? 'text-green-500' :
                                    rule.allowed === false ? 'text-red-500' : 'text-amber-500'
                                return (
                                    <div key={index} className="flex items-center gap-2 p-2 border rounded-sm">
                                        <Icon className={`w-3 h-3 ${colorClass}`} />
                                        <span className="text-xs">{rule.rule}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* FAQ */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base">FAQ</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <Accordion type="single" collapsible>
                            {eventConfig.faq.map((item, index) => (
                                <AccordionItem key={index} value={`item-${index}`}>
                                    <AccordionTrigger className="text-sm font-medium py-2">
                                        {item.q}
                                    </AccordionTrigger>
                                    <AccordionContent className="text-sm text-muted-foreground">
                                        {item.a}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default EventPage
