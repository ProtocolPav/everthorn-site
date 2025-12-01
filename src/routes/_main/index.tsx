import {createFileRoute, Link} from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import { useEffect, useRef, useState } from 'react'
import Autoplay from 'embla-carousel-autoplay'
import Fade from "embla-carousel-fade";
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { CarouselApi } from '@/components/ui/carousel'
import {ButtonGroup} from "@/components/ui/button-group.tsx";
import {GradientText} from "@/components/ui/shadcn-io/gradient-text";
import {cn} from "@/lib/utils.ts";
import {CaretRightIcon} from "@phosphor-icons/react";
import {hero_images} from "@/config/hero-images.ts";

export const Route = createFileRoute('/_main/')({
    component: IndexPage,
})

function IndexPage() {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [api, setApi] = useState<CarouselApi>()
    const [progress, setProgress] = useState(0)

    const autoplayPlugin = useRef(
        Autoplay({
            delay: 10000,
            stopOnInteraction: false,
        })
    )

    const fadePlugin = useRef(Fade())

    useEffect(() => {
        if (!api) return

        const delay = 10000

        const updateProgress = () => {
            const timeLeft = autoplayPlugin.current.timeUntilNext()
            if (timeLeft !== null) {
                const elapsed = delay - timeLeft
                const currentProgress = (elapsed / delay) * 100
                setProgress(currentProgress)
            }
        }

        const interval = setInterval(updateProgress, 50)

        return () => {
            clearInterval(interval)
        }
    }, [api])

    return (
        <div>
            <section className="relative w-full overflow-hidden">
                <Carousel
                    plugins={[autoplayPlugin.current, fadePlugin.current]}
                    className="h-full w-full"
                    opts={{ loop: true }}
                    setApi={(carouselApi) => {
                        setApi(carouselApi)
                        carouselApi?.on('select', () => {
                            setCurrentIndex(carouselApi.selectedScrollSnap())
                        })
                    }}
                >
                    {/* Carousel content */}
                    <div className="relative h-[calc(60vh-var(--navbar-height))] md:h-[calc(100vh-var(--navbar-height))]">
                        <CarouselContent className="h-full ml-0">
                            {hero_images.map((project) => (
                                <CarouselItem key={project.name} className="relative h-[calc(60vh-var(--navbar-height))] w-full pl-0 overflow-hidden md:h-[calc(100vh-var(--navbar-height))]">
                                    {/* Full-width background image */}
                                    <img
                                        src={project.image}
                                        alt={project.name}
                                        className="h-[calc(60vh-var(--navbar-height))] w-auto min-w-full object-cover md:h-[calc(100vh-var(--navbar-height))]"
                                    />

                                    {/* Gradient overlay - black to transparent, bottom to top */}
                                    <div className="hidden md:block absolute inset-0 bg-gradient-to-tr from-black/70 via-black/20 to-transparent pointer-events-none" />

                                    <div className="absolute md:hidden inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />
                                </CarouselItem>
                            ))}
                        </CarouselContent>

                        {/* Fixed foreground text content - Desktop Only */}
                        <div className="hidden md:block absolute bottom-8 md:bottom-20 left-0 right-0 md:right-auto p-4 md:p-10 z-10 max-w-full md:max-w-2xl pointer-events-auto">
                            <GradientText
                                text="Everthorn"
                                gradient={"linear-gradient(45deg, #ecd4ff 0%, #ecd4ff 10%, #ffd9c4 20%, #fff9d4 30%, #d4ffd4 40%, #d4f4ff 50%, #d4dcff 60%, #e4d4ff 70%, #ffd4eb 80%, #ecd4ff 100%)"}
                                className={"font-minecraft-ten text-4xl md:text-7xl font-extrabold tracking-tight mb-2 md:mb-4"}
                                transition={{duration: 20, repeat: Infinity, ease: 'linear'}}
                            />

                            <p className="font-minecraft-seven text-sm md:text-lg text-white/90 mb-4 md:mb-8 leading-relaxed">
                                A world shaped by passion, preserved by community. <br/>
                                Build your story in a world where every block becomes history.
                            </p>

                            {/* Navigation buttons row */}
                            <ButtonGroup>
                                <Button
                                    variant="outline"
                                    size={'lg'}
                                    className="bg-black/40 border-white/20 text-white hover:bg-black/60 backdrop-blur-sm"
                                    onClick={() => {
                                        api?.scrollPrev()
                                        autoplayPlugin.current.reset()
                                    }}
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </Button>

                                <Button
                                    variant={"outline"}
                                    size={'lg'}
                                    className="w-[220px] bg-black/40 border-white/20 text-white hover:bg-black/60 backdrop-blur-sm"
                                    asChild
                                >
                                    <Link to={"/"}>
                                        <div key={currentIndex} className="inline-block animate-in fade-in duration-1500">
                                            View {hero_images[currentIndex].name}
                                        </div>
                                    </Link>
                                </Button>

                                <Button
                                    variant={"outline"}
                                    size={'lg'}
                                    className="bg-black/40 border-white/20 text-white hover:bg-black/60 backdrop-blur-sm"
                                    asChild
                                >
                                    <Link to={"/apply"}>
                                        Join Everthorn
                                    </Link>
                                </Button>

                                <Button
                                    variant="outline"
                                    size={'lg'}
                                    className="bg-black/40 border-white/20 text-white hover:bg-black/60 backdrop-blur-sm"
                                    onClick={() => {
                                        api?.scrollNext()
                                        autoplayPlugin.current.reset()
                                    }}
                                >
                                    <ChevronRight className="h-5 w-5" />
                                </Button>
                            </ButtonGroup>
                        </div>

                        {/* Project Name Heading - Mobile only */}
                        <div className="md:hidden absolute flex gap-1 bottom-14 right-0 px-6 z-10 pointer-events-auto">
                            <h2
                                key={currentIndex}
                                className="font-minecraft-ten text-2xl font-extrabold text-white animate-in fade-in duration-1500"
                            >
                                {hero_images[currentIndex].name}
                            </h2>

                            <Button size={'icon-sm'} variant={'ghost'} asChild>
                                <Link to={'/'}>
                                    <CaretRightIcon/>
                                </Link>
                            </Button>
                        </div>

                        {/* Progress dots - bottom center */}
                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 pointer-events-auto">
                            <div className="flex items-center gap-1.5">
                                {hero_images.map((project, index) => {
                                    const isActive = index === currentIndex

                                    return (
                                        <div
                                            key={project.name}
                                            className={cn(
                                                "relative overflow-hidden transition-all duration-300 bg-white/25 rounded-full",
                                                isActive ? "w-8 h-1.5" : "w-1.5 h-1.5"
                                            )}
                                        >
                                            {isActive && (
                                                <div
                                                    className="h-full bg-white/30 rounded-full transition-all duration-50 ease-linear"
                                                    style={{ width: `${progress}%` }}
                                                />
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </Carousel>

                {/* Hero Content - Mobile Only */}
                <div className="md:hidden p-5 text-center">
                    <GradientText
                        text="Everthorn"
                        gradient={"linear-gradient(45deg, #ecd4ff 0%, #ecd4ff 10%, #ffd9c4 20%, #fff9d4 30%, #d4ffd4 40%, #d4f4ff 50%, #d4dcff 60%, #e4d4ff 70%, #ffd4eb 80%, #ecd4ff 100%)"}
                        className={"font-minecraft-ten text-6xl font-extrabold tracking-tight mb-2"}
                        transition={{duration: 20, repeat: Infinity, ease: 'linear'}}
                    />

                    <p className="font-minecraft-seven text-xl text-foreground mb-4 leading-relaxed">
                        A world shaped by passion, preserved by community. <br/>
                        Build your story in a world where every block becomes history.
                    </p>

                    {/* Navigation buttons row */}
                    <div className="relative inline-flex overflow-hidden rounded-lg p-[1px]">
                        <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#ecd4ff_0%,#ffd9c4_14%,#fff9d4_28%,#d4ffd4_42%,#d4f4ff_56%,#d4dcff_70%,#e4d4ff_84%,#ecd4ff_100%)]" />
                        <Button
                            variant={"invisible"}
                            size={'lg'}
                            className="relative rounded-lg bg-background"
                            asChild
                        >
                            <Link to={"/apply"}>
                                Join Everthorn
                            </Link>
                        </Button>
                    </div>

                </div>

            </section>

            {/* Temporary test section for scroll */}
            <section className="min-h-screen w-full p-20">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-5xl font-bold text-white mb-8">
                        Test Section
                    </h2>
                    <p className="text-xl text-white/80 mb-6">
                        (Optional) Ongoing Event section which shows only if theres one
                        Then a World Map section, showing a screenshot of the world map and a link
                        Projects section, with marquee of scrolling projects
                        Quests & Events section, explaining events and quests. Some images
                        About Us: History timeline (??)

                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
                                <h3 className="text-2xl font-semibold text-white mb-4">
                                    Card {i}
                                </h3>
                                <p className="text-white/70">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                    Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}
