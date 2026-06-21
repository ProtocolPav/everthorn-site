import { Card, CardContent } from '@/components/ui/card'
import {Separator} from "@/components/ui/separator.tsx";

export function AboutSection() {
    return (
        <section className="space-y-8">
            <div className="space-y-4 px-4 md:px-0 md:mx-8">
                <h1 className="font-minecraft-ten text-5xl md:text-6xl">
                    Roots That Run Deep
                </h1>
                {/*<p className="font-minecraft-seven text-xl md:text-2xl text-muted-foreground max-w-3xl">*/}
                {/*    Six years of dedication. Zero compromises.*/}
                {/*</p>*/}
            </div>

            <div className="grid md:grid-cols-5 md:gap-0">
                <div className="relative overflow-hidden md:col-span-2">
                    <img
                        src="/landing/gal_daral.png"
                        alt="Everthorn community build"
                        className="object-cover w-full h-full"
                    />

                    <div className="hidden md:block absolute inset-0 bg-linear-to-l from-background via-background/40 to-transparent pointer-events-none" />
                </div>

                <div className="md:col-span-3">
                    <Card className={'bg-transparent border-none shadow-none'}>
                        <CardContent className="p-6 not-md:py-0 space-y-3">
                            <img
                                src={'/icons/heart-full.png'}
                                alt="Heart Icon"
                                className="object-cover size-12"
                            />
                            <h3 className="font-minecraft-seven font text-xl md:text-2xl">Community. That's the Point.</h3>
                            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                                We're more than just a Minecraft Server.
                                We're a place where we build together, laugh together, and grow together.
                            </p>
                        </CardContent>
                    </Card>

                    <Separator className={'bg-linear-to-l from-background via-border/5 to-background'}/>

                    <div className="grid md:grid-cols-2">
                        <Card className={'bg-transparent border-none shadow-none'}>
                            <CardContent className="p-6 not-md:py-0 space-y-3">
                                <img
                                    src={'/icons/oak-sapling.png'}
                                    alt="Oak Sapling Icon"
                                    className="object-cover size-12"
                                />
                                <h3 className="font-minecraft-seven text-xl">Survival Done Right</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Survival that respects the grind.
                                    We've got quests and events to keep things fresh, but you still earn everything that matters.
                                </p>
                            </CardContent>
                        </Card>

                        <Separator className={'md:hidden bg-linear-to-l from-background via-border/5 to-background'}/>

                        <Card className={'bg-transparent border-none shadow-none'}>
                            <CardContent className="p-6 not-md:py-0 space-y-3">
                                <img
                                    src={'/icons/axolotl-bucket.png'}
                                    alt="Axolotl Bucket Icon"
                                    className="object-cover size-12"
                                />
                                <h3 className="font-minecraft-seven text-xl">Here for the Long Haul</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    This isn't a server that'll disappear in a year.
                                    Six years later, and we're just getting started.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    )
}
