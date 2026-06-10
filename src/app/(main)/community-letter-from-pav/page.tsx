"use client"
import { Separator } from "@/components/ui/separator";

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
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/55" />

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
      <article className="max-w-2xl mx-auto px-6 py-14 sm:py-20">

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
            internet as some of my best friends. It amazes me every single day
            how this silly little world can create such close friendships.
          </p>

          <p>
            We've had so much fun together, whether it is just hopping on call
            and running around the server with no rhyme or reason, or getting on
            and collaborating on the most amazing projects I've ever seen.
            There's not many games that allow this sort of thing, but more
            importantly, there's not many communities that are close enough to
            do this sort of thing.
          </p>

          <p>
            As for myself, I have been able to develop my professional skills by
            creating new experiences for you all: The Live Map, Quests, Thorny,
            and so much more. Without you here to play, there would be no use
            for me to work on new coding projects. So in some ways, Everthorn
            has actually helped me in many more ways than one might think, and I
            invite you all to share your stories of how Everthorn has helped you
            too.
          </p>

          <p>
            There is so much more to come. So many new faces, so many new
            builds, so many new experiences. And the best part is that it will
            all be done{" "}
            <strong className="font-semibold">together</strong>.
            Because that's how we do things around here. Above all else, we are
            a community of amazing people. <strong className={'font-semibold text-stone-400'}>We are Everthorn, and Together We Stand.</strong>
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
