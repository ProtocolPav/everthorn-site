import {ProjectCard} from "@/components/features/projects/project-card.tsx";
import SimpleMarquee from "@/components/ui/fancy/simple-marquee.tsx";
import {Link} from "@tanstack/react-router";
import {Button} from "@/components/ui/button.tsx";
import {CaretRightIcon} from "@phosphor-icons/react";

export function ProjectsSection() {
    return (
        <section className="overflow-hidden space-y-8">
            <div className="space-y-4 px-4 md:px-0 md:mx-8">
                <h1 className="font-minecraft-ten text-4xl md:text-6xl">
                    Projects. Built Different.
                </h1>
                <p className="font-minecraft-seven text-xl md:text-2xl text-muted-foreground max-w-4xl">
                    Each project is a player's ideas made real. It’s how we build on Everthorn.
                </p>

                <Link to="/">
                    <Button variant="outline" className="font-minecraft-seven group">
                        See what we've been building
                        <CaretRightIcon />
                    </Button>
                </Link>
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
