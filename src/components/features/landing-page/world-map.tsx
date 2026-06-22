import { Button } from '@/components/ui/button'
import { CaretRightIcon } from '@phosphor-icons/react'
import { Link } from "@tanstack/react-router";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import {cubicBezier} from "motion";

export function WorldMapSection() {
    const sectionRef = useRef<HTMLDivElement>(null)

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start 0.7", "start start"]
    })

    const ease = cubicBezier(0.4, 0, 0.2, 1)

    const opacity = useTransform(scrollYProgress, [0, 1], [0.3, 1], { ease})
    const scale = useTransform(scrollYProgress, [0.1, 1], [1.25, 1], { ease })
    const translateY = useTransform(scrollYProgress, [0, 1], [-100, 0], { ease })
    const rotateX = useTransform(scrollYProgress, [0, 1], [40, 0], { ease })

    const mobileOpacity = useTransform(scrollYProgress, [0, 1], [0.35, 1], { ease })
    const mobileScale = useTransform(scrollYProgress, [0, 1], [1.15, 1], { ease })
    const mobileTranslateY = useTransform(scrollYProgress, [0, 1], [-50, 0], { ease })
    const mobileRotateX = useTransform(scrollYProgress, [0, 1], [15, 0], { ease })

    return (
        <section className="relative" ref={sectionRef}>
            {/* Desktop: Full screen hero */}
            <div
                className="hidden md:block relative w-full h-screen overflow-hidden"
                style={{ perspective: "1200px" }}
            >
                <motion.img
                    src={'/landing/map-hands.png'}
                    alt="Hands holding Map"
                    className="object-cover object-center w-full h-full"
                    style={{ opacity, scale, translateY, rotateX }}
                />
                <div className="absolute inset-0 bg-linear-to-t from-background via-background/60 dark:via-background/85 to-transparent dark:to-background/5 pointer-events-none" />

                {/* Content overlay */}
                <div className="absolute inset-x-0 bottom-0 pb-24">
                    <div className="max-w-5xl mx-auto text-center items-center px-8 space-y-8">
                        <img
                            src={'/map/pins/project.png'}
                            alt="Map Pin Icon"
                            className="object-cover mx-auto"
                        />

                        <h2 className="font-minecraft-ten text-5xl lg:text-7xl">
                            Explore Every Corner
                        </h2>

                        <p className="font-minecraft-seven text-lg text-foreground/80 max-w-3xl mx-auto text-center leading-relaxed">
                            Our interactive world map brings Everthorn to life.
                            Discover player-made projects, farms and shops across the server. Then see the world
                            evolve before your eyes.
                        </p>

                        <div className="flex justify-center">
                            <Link to="/">
                                <Button className="font-minecraft-seven">
                                    Explore our Map
                                    <CaretRightIcon />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile: Split view */}
            <div className="md:hidden">
                <div
                    className="relative w-full h-[48vh]"
                    style={{ perspective: "1200px" }}
                >
                    <motion.img
                        src={'/landing/map-hands.png'}
                        alt="Hands holding Map"
                        className="object-cover object-center w-full h-full"
                        style={{ opacity: mobileOpacity, scale: mobileScale, translateY: mobileTranslateY, rotateX: mobileRotateX }}
                    />
                    <div className="absolute inset-0 bg-linear-to-b from-transparent via-background/20 to-background pointer-events-none" />
                </div>

                <div className="px-2 py-8 space-y-6 -mt-12 relative z-10">
                    {/* Gradient border container */}
                    <div className="rounded-xl p-px bg-linear-to-b from-border/80 via-border/10 to-transparent">
                        <div className="bg-background backdrop-blur-sm rounded-xl p-6 shadow-xl space-y-6">
                            <div className="text-center space-y-4">
                                <img
                                    src={'/map/pins/project.png'}
                                    alt="Map Pin Icon"
                                    className="object-cover size-10 mx-auto"
                                />
                                <h2 className="font-minecraft-ten text-3xl">
                                    Explore Every Corner
                                </h2>
                            </div>

                            <p className="font-minecraft-seven text-sm text-muted-foreground leading-relaxed text-center">
                                Our interactive world map brings Everthorn to life.
                                Discover builds, track projects, and watch the world evolve in real time.
                            </p>

                            <Link to="/">
                                <Button className="font-minecraft-seven w-full">
                                    Explore our Map
                                    <CaretRightIcon />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}