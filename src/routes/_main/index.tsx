import {createFileRoute} from '@tanstack/react-router'
import {HeroCarousel} from "@/components/features/landing-page/hero.tsx";
import {AboutSection} from "@/components/features/landing-page/about.tsx";
import {WorldMapSection} from "@/components/features/landing-page/world-map.tsx";
import {ProjectsSection} from "@/components/features/landing-page/projects-section.tsx";
import {QuestsSection} from "@/components/features/landing-page/quests-section.tsx";

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

                <QuestsSection/>
                {/*
                "The Quest For ..."
                describes our quest system, and maybe shows some pictures that people
                can click through - like tabs? and each tab is a different quest
                Maybe it has a video of how the quests work playing in the background

                AI:
                A horizontal scroll quest board styled like a parchment notice board.
                Each quest is a pinned parchment card with a title, short description,
                and a thumbnail. Clicking a card expands it or switches to a detail view.

                On desktop, the board fills the width with 3-4 visible cards.
                On mobile, it becomes a swipeable horizontal scroll.

                Optional: faint aged paper texture and a video playing behind the board
                showing quests in action.
                */}

                {/* EventsSection */}
                {/*
                Its a card stack, like postcards, that the user can flick through and
                see the different events we had.
                "Postcards from our Events" or something
                "Hello from ..."

                Card stack will be in the center with the title text being split
                to either side, along with any additional minor text. Nice break from the "grid" feel

                */}

                {/*
                Seven Years and Counting

                A scroll card stack with a timeline of the server.
                on desktop, the side has a description. On mobile, each card has a shorter one.

                Ends with a link to watch our anniversary video.
                */}

                {/*
                Community Spotlight

                A masonry grid of different screenshots from our server
                People, builds, etc.
                */}

                {/*
                Meet the Team

                A minor section showing off our CM team
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
