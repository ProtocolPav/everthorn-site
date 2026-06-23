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

            <div className={'md:max-w-14/16 grid gap-16 mx-auto pt-5 md:pt-20 md:border-l md:border-r'}>
                <AboutSection/>

                {/* Any temporary blocks go here. */}

                <WorldMapSection/>

                <ProjectsSection/>

                {/* EventsSection */}
                {/*
                Its a card stack, like postcards, that the user can flick through and
                see the different events we had.
                "Postcards from our Events" or something
                "Hello from ..."
                */}

                {/* QuestSection */}
                {/*
                "The Quest For ..."
                describes our quest system, and maybe shows some pictures that people
                can click through - like tabs? and each tab is a different quest
                Maybe it has a video of how the quests work playing in the background
                */}

                {/*
                Seven Years and Counting

                A scroll card stack with a timeline of the server.
                on desktop, the side has a description. On mobile, each card has a shorter one.

                Ends with a link to watch our anniversary video.
                */}

                {/*
                We'd Love To Have You!

                This is the apply CTA, shown for non signed in, or not isMember.
                Picture of many people, with a call to apply.
                */}

                {/*
                Support the server

                For signed in, isMember, this is the donate CTA.

                Everthorn can not exist without you! Support the server by donating.
                */}
            </div>

            {/* Read More About Us Links (TOGETHER WE STAND?) */}
            {/*
            Together we stand animates from the sides, as you scroll they go to the middle,
             and then exit from the opposite side it came in
             */}
            {/* <h1 className={'font-minecraft-ten text-6xl md:text-9xl'}>Together</h1> */}
            {/* <h1 className={'font-minecraft-ten text-6xl text-end md:text-9xl'}>We stand</h1> */}
        </div>
    )
}
