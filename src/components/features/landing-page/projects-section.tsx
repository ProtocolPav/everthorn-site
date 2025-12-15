import {ProjectCard} from "@/components/features/projects/project-card.tsx";
import SimpleMarquee from "@/components/ui/fancy/simple-marquee.tsx";

export function ProjectsSection() {
    return (
        <section className="overflow-hidden space-y-4">
            <div className="space-y-4 px-4 md:px-0 md:mx-8">
                <h1 className="font-minecraft-ten text-5xl md:text-6xl">
                    Projects. Built Different.
                </h1>
                <p className="font-minecraft-seven text-xl md:text-2xl text-muted-foreground max-w-3xl">
                    Every build tells a story. Every project pushes limits.
                </p>
            </div>

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
        </section>
    )
}
