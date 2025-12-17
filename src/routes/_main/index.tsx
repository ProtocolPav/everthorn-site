import {createFileRoute} from '@tanstack/react-router'
import {HeroCarousel} from "@/components/features/landing-page/hero.tsx";
import {AboutSection} from "@/components/features/landing-page/about.tsx";
import {WorldMapSection} from "@/components/features/landing-page/world-map.tsx";
import {ProjectsSection} from "@/components/features/landing-page/projects-section.tsx";

export const Route = createFileRoute('/_main/')({
    component: IndexPage,
})

function IndexPage() {

    return (
        <div>
            <HeroCarousel/>

            <div className={'md:max-w-12/14 grid gap-16 mx-auto md:pt-20 md:border-l md:border-r'}>
                <AboutSection/>

                <WorldMapSection/>

                <ProjectsSection/>

                {/* EventsSection */}

                {/* QuestSection */}

                {/* Apply CTA (For non-signed in, not isMember) */}
                {/* Donate Link (For signed in, isMember) */}
            </div>

            {/* Read More About Us Links (TOGETHER WE STAND?) */}
            {/* <h1 className={'font-minecraft-ten text-6xl md:text-9xl'}>Together</h1> */}
            {/* <h1 className={'font-minecraft-ten text-6xl text-end md:text-9xl'}>We stand</h1> */}
        </div>
    )
}
