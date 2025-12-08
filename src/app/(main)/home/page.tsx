import Hero from "./_sections/hero";
import Feature from "./_sections/feature";
import History from "./_sections/history";
import {WrappedHeroBanner} from "@/components/features/wrapped/wrapped-hero-banner";

export default function IndexPage() {
    return (
        <section className="mx-5 grid items-center gap-6 pb-8 pt-6 md:mx-10 md:py-10 xl:mx-20">

            <Hero/>

            <WrappedHeroBanner/>

            <Feature className={'pt-16'}/>

            <History className={'mx-0 pt-16 md:mx-24'}/>

        </section>
    )
}
