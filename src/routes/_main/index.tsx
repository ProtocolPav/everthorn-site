import {createFileRoute} from '@tanstack/react-router'
import {HeroCarousel} from "@/components/features/landing-page/hero.tsx";
import {AboutSection} from "@/components/features/landing-page/about.tsx";
import {WorldMapSection} from "@/components/features/landing-page/world-map.tsx";

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
            </div>

            {/* Temporary test section for scroll */}
            {/*<section className="min-h-screen w-full md:px-40">*/}

            {/*    <h1 className={'font-minecraft-ten text-6xl md:text-9xl'}>Together</h1>*/}
            {/*    <h1 className={'font-minecraft-ten text-6xl text-end md:text-9xl'}>We stand</h1>*/}

            {/*    <h1 className={'font-minecraft-ten text-6xl'}>6+ Years</h1>*/}

            {/*    <div className="max-w-6xl mx-auto">*/}
            {/*        <h2 className="text-5xl font-bold text-white mb-8">*/}
            {/*            Test Section*/}
            {/*        </h2>*/}
            {/*        <p className="text-xl text-white/80 mb-6">*/}
            {/*            (Optional) Ongoing Event section which shows only if theres one*/}
            {/*            Then a World Map section, showing a screenshot of the world map and a link*/}
            {/*            Projects section, with marquee of scrolling projects*/}
            {/*            Quests & Events section, explaining events and quests. Some images*/}
            {/*            About Us: History timeline (??)*/}

            {/*        </p>*/}
            {/*        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">*/}
            {/*            {[1, 2, 3].map((i) => (*/}
            {/*                <div key={i} className="bg-white/10 backdrop-blur-sm rounded-lg p-8">*/}
            {/*                    <h3 className="text-2xl font-semibold text-white mb-4">*/}
            {/*                        Card {i}*/}
            {/*                    </h3>*/}
            {/*                    <p className="text-white/70">*/}
            {/*                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.*/}
            {/*                        Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.*/}
            {/*                    </p>*/}
            {/*                </div>*/}
            {/*            ))}*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</section>*/}
        </div>
    )
}
