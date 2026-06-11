"use client"
import {Separator} from "@/components/ui/separator";

export default function Page() {
    return (
        <main className="min-h-screen font-alegreya">
            {/* ── Banner / Hero Image ──────────────────────────────────────── */}
            <div className="relative w-full h-72 sm:h-96 overflow-hidden bg-stone-200">
                {/* Replace the src below with your actual banner image */}
                <img
                    src="/screenshots/spawn_village.png"
                    alt="Everthorn community banner"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                />

                {/* Gradient overlay so the title pops */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/55"/>

                {/* Title over the banner */}
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-8 px-4 text-center">
                    <p className="text-stone-200/80 text-sm sm:text-lg tracking-widest uppercase font-smythe font-medium mb-1">
                        A Community Letter from Pav
                    </p>
                    <h1 className="text-white text-3xl sm:text-5xl font-smythe font-bold tracking-tight drop-shadow-md">
                        Happy 7 Years, Everthorn
                    </h1>
                </div>
            </div>

            {/* ── Letter Body ──────────────────────────────────────────────── */}
            <article className="max-w-2xl mx-auto px-6 py-7 sm:py-20">

                <div className="space-y-7 leading-8 text-[1.075rem] sm:text-[1.1rem] text-stone-700">
                    <p>
                        I want to start off by saying <em>thank you</em>. Thank you all for
                        playing every day. Thank you all for chatting every day. Thank you
                        all for being you. If not for you, Everthorn would not be the
                        community it is today, and I think it is safe to say a lot of our
                        lives would look just a little different without Everthorn.
                    </p>

                    <p>
                        Seven years ago, when I made a silly little Minecraft world with my
                        friends and decided to open it up to complete strangers on the
                        internet, I never imagined the sheer magnitude that it would grow
                        to. And now today, 7 years later, I see those same strangers on the
                        internet as some of my best friends.
                    </p>

                    <p>
                        We've had so much fun together, whether it is hopping on call and running
                        around the server and causing some chaos, or joining forces and fighting the Ender Dragon.
                        Personally, I enjoyed collaborating with people on projects. Caedarn's Keep at spawn,
                        Sakana, Solaris, the list goes on. I also enjoyed our events, most notably the UHC last year when we had our
                        largest turnout ever for an event. Looking back, it's these moments that make Everthorn so special to me.
                        There's not many games that allow this sort of thing, but more
                        importantly, there's not many communities that are close enough to
                        do this sort of thing.
                    </p>

                    <p>
                        I've seen so many people grow, and friendships flourish that you'd never have expected.
                        I've seen people laugh with each other through the good times, and lean on each other through the hard ones.
                        It's no secret that we've had our rough patches. People coming and going, activity dropping, motivation fading.
                        But that's the thing about this community: it's never permanent.
                        We find new faces, we rediscover that spark, and before long we're all back at it, <em>together</em>.
                        That resilience is what makes Everthorn different. Anyone can build a server.
                        Not everyone can build something worth coming back to.
                    </p>

                    <p>
                        Everthorn has given me more than I ever expected.
                        Building the Live Map, Quests, Thorny, and everything in between.
                        None of it would exist without you here to play it, break it, and tell me what to build next.
                        You've pushed me to create things I didn't know I was capable of.
                        In that way, this community has shaped me just as much as I've tried to shape it.
                        And I suspect I'm not alone in that. So I invite you all to share your stories of how Everthorn
                        has helped you too.
                    </p>

                    <p>
                        This is just the beginning. Everthorn's not going anywhere any time soon.
                        We've still got 3 more events left for this year, with our next event starting in just a few days.
                        Later this summer, we will be introducing the biggest update to Quests we have ever seen, along
                        with the long awaited Website overhaul, including a new Live Map and the Everthorn Wiki.
                    </p>

                    <p>
                        There is so much more to come. So many new faces, so many new
                        builds, so many new experiences. And the best part is that it will
                        all be done <em>together</em>.
                        Because that's how we do things around here. Above all else, we are
                        a community of amazing people. <strong className={'font-semibold text-stone-400'}>We are Everthorn, and
                        Together We Stand.</strong>
                    </p>

                    <p>
                        Thank you.
                    </p>
                </div>

                {/* ── Signature block ──────────────────────────────────────── */}
                <div className="flex flex-col items-start gap-4 my-2">
                    <div>
                        <p
                            className="text-center text-stone-200 text-3xl font-rock-salt -rotate-4"
                        >
                            ProtocolPav
                        </p>
                    </div>
                </div>

            </article>
        </main>
    );
}
