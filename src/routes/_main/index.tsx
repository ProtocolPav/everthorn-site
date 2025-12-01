import {createFileRoute, Link} from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import { useRef, useState } from 'react'
import Autoplay from 'embla-carousel-autoplay'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { CarouselApi } from '@/components/ui/carousel'
import {ButtonGroup} from "@/components/ui/button-group.tsx";

export const Route = createFileRoute('/_main/')({
    component: IndexPage,
})

const projects = [
    { name: 'Spawn Village', image: '/landing/spawn_village.png' },
    { name: 'Padova', image: '/landing/padova.png' },
    { name: 'Solaris', image: '/landing/solaris.png' },
    { name: 'Proving Grounds', image: '/landing/provingground.png' },
    { name: 'Shroomland', image: '/landing/shroomland.png' },
]

function IndexPage() {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [api, setApi] = useState<CarouselApi>()
    const plugin = useRef(
        Autoplay({
            delay: 5000,
            stopOnInteraction: false,
            stopOnMouseEnter: true,
        })
    )

    return (
        <>
            <section className="relative h-[calc(100vh-var(--navbar-height))] w-full overflow-hidden">
                <Carousel
                    plugins={[plugin.current]}
                    className="h-full w-full"
                    opts={{ loop: true }}
                    setApi={(carouselApi) => {
                        setApi(carouselApi)
                        carouselApi?.on('select', () => {
                            setCurrentIndex(carouselApi.selectedScrollSnap())
                        })
                    }}
                >
                    <CarouselContent className="h-screen ml-0">
                        {projects.map((project) => (
                            <CarouselItem key={project.name} className="relative h-screen w-full pl-0 overflow-hidden">
                                {/* Full-width background image */}
                                <img
                                    src={project.image}
                                    alt={project.name}
                                    className="h-screen w-auto min-w-full object-cover"
                                />

                                {/* Gradient overlay - black to transparent, bottom to top */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/15 to-transparent pointer-events-none" />
                            </CarouselItem>
                        ))}
                    </CarouselContent>

                    {/* Fixed foreground text content - bottom left */}
                    <div className="absolute bottom-20 left-0 p-10 z-10 max-w-2xl pointer-events-auto">
                        <h1 className="font-minecraft-ten text-7xl font-extrabold tracking-tight text-white mb-4">
                            Everthorn
                        </h1>

                        <p className="font-minecraft-seven text-lg text-white/90 mb-8 leading-relaxed">
                            A world shaped by passion, preserved by community. <br/>
                            Build your story in a world where every block becomes history.
                        </p>

                        {/* Navigation buttons row */}
                        <ButtonGroup>
                            <Button
                                variant="outline"
                                size={'lg'}
                                className="bg-black/40 border-white/20 text-white hover:bg-black/60 backdrop-blur-sm"
                                onClick={() => api?.scrollPrev()}
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
                                        View {projects[currentIndex].name}
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
                                onClick={() => api?.scrollNext()}
                            >
                                <ChevronRight className="h-5 w-5" />
                            </Button>
                        </ButtonGroup>
                    </div>
                </Carousel>
            </section>

            {/* Temporary test section for scroll */}
            <section className="min-h-screen w-full bg-gradient-to-b from-gray-900 to-gray-800 p-20">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-5xl font-bold text-white mb-8">
                        Test Section
                    </h2>
                    <p className="text-xl text-white/80 mb-6">
                        This is a temporary section to test scrolling behavior.
                        Scroll down to see if the page navigation works correctly.
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
        </>
    )
}
