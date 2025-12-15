export function WorldMapSection() {
    return (
        <section className="md:mx-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
                {/* Left: Content */}
                <div className="space-y-6 px-4 md:px-0">
                    <img
                        src={'/map/pins/project.png'}
                        alt="Map Pin Icon"
                        className="object-cover size-16"
                    />

                    <h2 className="font-minecraft-ten text-4xl md:text-5xl">
                        Explore Every Corner
                    </h2>

                    <div className="space-y-4 text-muted-foreground">
                        <p className="text-base md:text-lg leading-relaxed">
                            Our interactive world map brings Everthorn to life. Discover player builds, community projects, and hidden gems across the entire server.
                        </p>
                        <p className="text-base md:text-lg leading-relaxed">
                            Mark your own creations, find friends' bases, and watch the world grow with every pin placed.
                        </p>
                    </div>
                </div>

                {/* Right: Image */}
                <div className="relative rounded-xl overflow-hidden border md:order-last order-first">
                    <img
                        src="/landing/world-map-showcase.png"
                        alt="Everthorn world map"
                        className="object-cover w-full h-full"
                    />

                    map is on a mc map background. Steve arms holding it.
                    Animates down to reveal the text in center
                </div>
            </div>
        </section>
    )
}
