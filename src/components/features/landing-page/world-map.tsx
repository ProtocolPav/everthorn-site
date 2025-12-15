import { Button } from '@/components/ui/button'
import { CaretRightIcon } from '@phosphor-icons/react'

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
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none" />

                {/* Content overlay */}
                <div className="absolute inset-x-0 bottom-0 pb-20">
                    <div className="max-w-4xl mx-auto px-8 space-y-6 items-center text-center">
                        <div className={'flex gap-2 items-end justify-center'}>
                            <img
                                src={'/map/pins/project.png'}
                                alt="Map Pin Icon"
                                className="object-cover"
                            />

                            <h2 className="font-minecraft-ten text-5xl lg:text-6xl text-white">
                                Explore Every Corner
                            </h2>
                        </div>

                        <div className="space-y-4 text-white/80 max-w-2xl mx-auto">
                            <p className="text-lg leading-relaxed">
                                Our interactive world map brings Everthorn to life. Discover player builds, community projects, and hidden gems across the entire server.
                            </p>
                            <p className="text-lg leading-relaxed">
                                Mark your own creations, find friends' bases, and watch the world grow with every pin placed.
                            </p>
                        </div>

                        <Button size="lg" className="font-minecraft-seven">
                            View the Map
                            <CaretRightIcon className="ml-2" weight="bold" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile: Compact layout */}
            <div className="md:hidden space-y-6 px-4 py-12">
                <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border">
                    <img
                        src={'/landing/map-hands.png'}
                        alt="Hands holding Map"
                        className="object-contain object-center w-full h-full"
                    />
                </div>

                <div className="space-y-6 text-center">
                    <img
                        src={'/map/pins/project.png'}
                        alt="Map Pin Icon"
                        className="object-cover mx-auto size-12"
                    />

                    <h2 className="font-minecraft-ten text-3xl">
                        Explore Every Corner
                    </h2>

                    <p className="text-sm text-muted-foreground leading-relaxed">
                        Our interactive world map brings Everthorn to life. Discover builds, projects, and hidden gems—then mark your own.
                    </p>

                    <Button size="lg" className="font-minecraft-seven w-full">
                        View the Map
                        <CaretRightIcon className="ml-2" weight="bold" />
                    </Button>
                </div>
            </div>
        </section>
    )
}
