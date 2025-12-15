import {ProjectCard} from "@/components/features/projects/project-card.tsx";
import SimpleMarquee from "@/components/ui/fancy/simple-marquee.tsx";

export function ProjectsSection() {
    return (
        <section className="overflow-hidden space-y-8">
            <div className="space-y-4 px-4 md:px-0 md:mx-8">
                <h1 className="font-minecraft-ten text-5xl md:text-6xl">
                    Projects. Built Different.
                </h1>
                <p className="font-minecraft-seven text-xl md:text-2xl text-muted-foreground max-w-3xl">
                    Every build tells a story. Every project pushes limits.
                </p>
            </div>

            <div className={'relative'}>
                <div className="absolute left-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

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
                    {new Array(10).fill(null).map((_) => (
                        <ProjectCard projectId={'padovese_railway'} className={'mx-2'}/>
                    ))}
                </SimpleMarquee>
            </div>
        </section>
    )
}
