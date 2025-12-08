"use client"

import { Button } from "@/components/ui/button";
import athenaeum from "public/screenshots/athenaeum.png"
import ceras from "public/screenshots/ceras.png"
import gal_daral from "public/screenshots/gal_daral.png"
import lost_creek from "public/screenshots/lost_creek.png"
import redbeard_industries from "public/screenshots/redbeard_industries.png"
import spawn from "public/screenshots/spawn.png"

import {cn} from "@/lib/utils";
import Link from "next/link";
import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious} from "@/components/ui/carousel";
import Image from "next/image";

import Autoplay from "embla-carousel-autoplay"
import React from "react";

const carousel_tips = [
    {'text': 'Spawn Village', 'image': spawn},
    {'text': 'Ceras', 'image': ceras},
    {'text': 'Gal Daral', 'image': gal_daral},
    {'text': 'Lost Creek', 'image': lost_creek},
    {'text': 'The Athenaeum', 'image': athenaeum},
    {'text': 'Redbeard Industries', 'image': redbeard_industries},
]

export default function Hero({className}: {className?: string | undefined}) {
    const plugin = React.useRef(
        Autoplay({
            delay: 6000,
            stopOnLastSnap: false,
            stopOnMouseEnter: true,
            stopOnFocusIn: true,
            stopOnInteraction: false,
        })
    )

    return (
        <div className={cn(className, "pt-4 md:pt-16")}>
            <div className="grid lg:grid-cols-7 lg:gap-x-8 xl:gap-x-12">
                <div className="lg:col-span-3">
                    <h1 className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                        Everthorn
                    </h1>
                    <p className="mt-3 text-lg text-muted-foreground">
                        Explore Everthorn, a Minecraft Bedrock Community that's been together for 5+ years. <br/>
                        We are Everthorn, and Together We Stand.
                    </p>
                    <div className="mt-5 flex flex-row gap-2 sm:items-center sm:gap-3 lg:mt-8">
                        <Button asChild>
                            <Link href={'/map'}>View our World Map</Link>
                        </Button>
                        <Button asChild variant={'secondary'}>
                            <Link href={'/apply'}>Join Us</Link>
                        </Button>
                    </div>
                </div>
                <div className="mt-10 lg:col-span-4 lg:mt-0">
                    <Carousel
                        plugins={[plugin.current]}
                    >
                        <CarouselContent>
                            {carousel_tips.map(t => (
                                <CarouselItem key={t.text} className={'relative overflow-hidden'}>
                                    <Image
                                        className={'rounded-xl object-cover'}
                                        src={t.image}
                                        alt={t.text}
                                    />

                                    <div className={'absolute -bottom-0.25 left-4 right-0 bg-gradient-to-t from-black/90 to-black/0 h-2/3 px-10 rounded-b-xl flex items-end'}>
                                        <h4 className={'text-white mb-5'}>
                                            {t.text}
                                        </h4>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className={'absolute inset-y-1/2 left-2'} />
                        <CarouselNext className={'absolute inset-y-1/2 right-2'} />
                    </Carousel>

                </div>
            </div>
        </div>
    );
}
