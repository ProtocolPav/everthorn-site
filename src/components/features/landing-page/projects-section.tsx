import {ProjectCard} from "@/components/features/projects/project-card.tsx";
import SimpleMarquee from "@/components/ui/fancy/simple-marquee.tsx";

export function ProjectsSection() {
    const project_ids = [
        "padova",
        "solaris",
        "dwarven_city",
        "spawn_village",
        "yutakana_province",
        "phish_village",
        "icebound_castle"
    ]
    return (
        <section className="relative -mt-10 overflow-hidden">
            {/* Tile texture background */}
            <div
                className="absolute inset-0 pointer-events-none opacity-40"
                style={{
                    backgroundImage: "url('/textures/bricks.png')",
                    backgroundRepeat: "repeat",
                    backgroundSize: "auto",
                }}
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-linear-to-b from-transparent via-background/80 to-background pointer-events-none" />

            {/* Your actual content goes here, needs relative + z-10 */}
            <div className="relative z-10 space-y-6">
                <div className="space-y-4 pt-16 px-4 md:px-0 md:mx-8">
                    <h1 className="font-minecraft-ten text-4xl md:text-6xl">
                        Projects. Built Different.
                    </h1>
                    <p className="hidden md:block font-minecraft-seven text-md md:text-lg text-muted-foreground max-w-4xl">
                        From the fields of Sakana, to the top of Proving Mountain. <br/>
                        We've built a lot of things we're proud of. We'd love to be proud of yours too.
                    </p>
                    <p className="md:hidden font-minecraft-seven text-md md:text-lg text-muted-foreground max-w-4xl">
                        Yutakana. Shroomland. Proving Mountain. <br/>
                        We've built a lot of things we're proud of. We'd love to be proud of yours too.
                    </p>
                </div>

                <div className={'relative'}>
                    <div className="absolute left-0 top-0 bottom-0 w-20 md:w-32 bg-linear-to-r from-background to-transparent z-10 pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-20 md:w-32 bg-linear-to-l from-background to-transparent z-10 pointer-events-none" />

                    <SimpleMarquee
                        className="w-full"
                        baseVelocity={1.8}
                        repeat={4}
                        draggable={false}
                        scrollSpringConfig={{ damping: 50, stiffness: 400 }}
                        slowDownFactor={0.1}
                        slowdownOnHover
                        slowDownSpringConfig={{ damping: 60, stiffness: 300 }}
                        useScrollVelocity={true}
                        direction="left"
                    >
                        {project_ids.map((id) => (
                            <ProjectCard
                                projectId={id}
                                className={'mx-2 w-xs md:w-sm'}
                                onClick={() => {}}
                            />
                        ))}
                    </SimpleMarquee>
                </div>
            </div>
        </section>
    )
}
