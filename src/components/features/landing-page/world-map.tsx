import { Button } from '@/components/ui/button'
import { CaretRightIcon, MapPinIcon, CompassIcon, UsersThreeIcon } from '@phosphor-icons/react'

export function WorldMapSection() {
    return (
        <section className="relative">
            {/* Desktop: Full screen hero */}
            <div className="hidden md:block relative w-full h-screen">
                <img
                    src={'/landing/map-hands.png'}
                    alt="Hands holding Map"
                    className="object-cover object-center w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 dark:via-background/85 to-transparent dark:to-background/5 pointer-events-none" />

                {/* Content overlay */}
                <div className="absolute inset-x-0 bottom-0 pb-24">
                    <div className="max-w-5xl mx-auto text-center items-center px-8 space-y-8">
                        <img
                            src={'/map/pins/project.png'}
                            alt="Map Pin Icon"
                            className="object-cover mx-auto"
                        />

                        <h2 className="font-minecraft-ten text-5xl lg:text-7xl">
                            Explore Every Corner
                        </h2>

                        <p className="text-xl text-foreground/80 max-w-3xl mx-auto text-center leading-relaxed">
                            Our interactive world map brings Everthorn to life. Discover player builds, community projects, and hidden gems across the entire server—then mark your own creations for everyone to find.
                        </p>

                        <div className="flex justify-center">
                            <Button className="font-minecraft-seven">
                                View the Map
                                <CaretRightIcon weight="bold" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile: Split view */}
            <div className="md:hidden">
                <div className="relative w-full h-[48vh]">
                    <img
                        src={'/landing/map-hands.png'}
                        alt="Hands holding Map"
                        className="object-cover object-center w-full h-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background pointer-events-none" />
                </div>

                <div className="px-4 py-8 space-y-6 -mt-12 relative z-10">
                    <div className="bg-background/95 backdrop-blur-sm border rounded-xl p-6 shadow-xl space-y-6">
                        <div className="flex gap-3 items-center justify-center">
                            <img
                                src={'/map/pins/project.png'}
                                alt="Map Pin Icon"
                                className="object-cover size-10"
                            />
                            <h2 className="font-minecraft-ten text-3xl">
                                Explore Every Corner
                            </h2>
                        </div>

                        <p className="text-sm text-muted-foreground leading-relaxed text-center">
                            Navigate Everthorn with our interactive world map. Discover builds, mark your creations, and explore every corner of our world.
                        </p>

                        <div className="grid grid-cols-3 gap-3 py-2">
                            <div className="flex flex-col items-center gap-2 text-center">
                                <MapPinIcon className="size-6 text-primary" weight="duotone" />
                                <span className="text-xs text-muted-foreground">Mark Builds</span>
                            </div>
                            <div className="flex flex-col items-center gap-2 text-center">
                                <CompassIcon className="size-6 text-primary" weight="duotone" />
                                <span className="text-xs text-muted-foreground">Discover</span>
                            </div>
                            <div className="flex flex-col items-center gap-2 text-center">
                                <UsersThreeIcon className="size-6 text-primary" weight="duotone" />
                                <span className="text-xs text-muted-foreground">Find Friends</span>
                            </div>
                        </div>

                        <Button size="lg" className="font-minecraft-seven w-full">
                            View the Map
                            <CaretRightIcon className="ml-2" weight="bold" />
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}
