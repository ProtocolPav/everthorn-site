import { Card, CardContent } from '@/components/ui/card'
import { Separator } from "@/components/ui/separator.tsx";
import { motion } from "motion/react";
import {useIsMobile} from "@/hooks/use-mobile.ts";

const ease = [0.16, 1, 0.3, 1] as const
const words = ["Roots", "That", "Run", "Deep"]

export function AboutSection() {
    const isMobile = useIsMobile()

    return (
        <section className="space-y-8">
            <div className="space-y-4 px-4 md:px-0 md:mx-8">
                <h1 className="font-minecraft-ten text-5xl md:text-6xl flex flex-wrap gap-x-4 z-10">
                    {words.map((word, i) => {
                        const isLast = i === words.length - 1

                        return (
                            <motion.span
                                key={word}
                                initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
                                whileInView={isLast ? {
                                    opacity: [0, 1, 1, 1, 1, 1, 1],
                                    y: [24, 0, 0, 0, 0, 0, 0],
                                    filter: ["blur(6px)", "blur(0px)", "blur(0px)", "blur(0px)", "blur(0px)", "blur(0px)", "blur(0px)"],
                                    scaleY: [0.8, 2.4, 2.4, 0.85, 1.15, 0.95, 1],
                                } : { opacity: 1, y: 0, filter: "blur(0px)" }}
                                viewport={{ once: true, margin: "0px" }}
                                transition={isLast ? {
                                    duration: 1.8,
                                    delay: 0.2 + i * 0.12,
                                    ease: "easeOut",
                                    times: [0, 0.25, 0.55, 0.68, 0.8, 0.9, 1]
                                } : {
                                    duration: 0.7,
                                    delay: 0.2 + i * 0.12,
                                    ease
                                }}
                                style={{ display: "inline-block", transformOrigin: "top" }}
                            >
                                {word}
                            </motion.span>
                        )
                    })}
                </h1>
            </div>

            <div className="grid md:grid-cols-5 md:gap-0">
                <div className="relative overflow-hidden md:col-span-2">
                    <img
                        src="/landing/gal_daral.png"
                        alt="Everthorn community build"
                        className="object-cover w-full h-full"
                    />
                    <div className="hidden md:block absolute inset-0 bg-linear-to-l from-background via-background/40 to-transparent pointer-events-none" />
                </div>

                <div className="md:col-span-3">
                    {/* Card 1 */}
                    <Card className="bg-transparent border-none shadow-none">
                        <CardContent className="p-6 not-md:py-0 space-y-3">
                            <motion.img
                                src="/icons/heart-full.png"
                                alt="Heart Icon"
                                className="object-cover size-12"
                                initial={{ opacity: 0, scale: 0.7 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true, margin: isMobile ? "0px" : "-70px" }}
                                transition={{ duration: 0.5, delay: 0.7, ease }}
                            />
                            <motion.div
                                initial={{ opacity: 0, x: -12 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: isMobile ? "0px" : "-70px" }}
                                transition={{ duration: 0.6, delay: isMobile ? 0.8 : 0.92, ease }}
                                className="space-y-3"
                            >
                                <h3 className="font-minecraft-seven font text-xl md:text-2xl">Community. That's the Point.</h3>
                                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                                    We've always believed that the best part of Minecraft was never the blocks,
                                    it was the people placing them next to you.
                                    Everthorn takes that belief to our core.
                                </p>
                            </motion.div>
                        </CardContent>
                    </Card>

                    <Separator className="bg-linear-to-l from-background via-border/5 to-background" />

                    <div className="grid md:grid-cols-2">
                        {/* Card 2 */}
                        <Card className="bg-transparent border-none shadow-none">
                            <CardContent className="p-6 not-md:py-0 space-y-3">
                                <motion.img
                                    src="/icons/oak-sapling.png"
                                    alt="Oak Sapling Icon"
                                    className="object-cover size-12"
                                    initial={{ opacity: 0, scale: 0.7 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true, margin: isMobile ? "0px" : "-70px" }}
                                    transition={{ duration: 0.5, delay: 0.7, ease }}
                                />
                                <motion.div
                                    initial={{ opacity: 0, x: -12 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, margin: isMobile ? "0px" : "-70px" }}
                                    transition={{ duration: 0.6, delay: isMobile ? 0.8 : 0.92, ease }}
                                    className="space-y-3"
                                >
                                    <h3 className="font-minecraft-seven text-xl">Survival Done Our Way</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        Think vanilla. Then add quests, custom addons, and events made specifically for Everthorn.
                                        It's the same survival soul, with more to do.
                                    </p>
                                </motion.div>
                            </CardContent>
                        </Card>

                        <Separator className="md:hidden bg-linear-to-l from-background via-border/5 to-background" />

                        {/* Card 3 — same trigger as card 2 since they're side by side, stagger via delay only */}
                        <Card className="bg-transparent border-none shadow-none">
                            <CardContent className="p-6 not-md:py-0 space-y-3">
                                <motion.img
                                    src="/icons/axolotl-bucket.png"
                                    alt="Axolotl Bucket Icon"
                                    className="object-cover size-12"
                                    initial={{ opacity: 0, scale: 0.7 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true, margin: isMobile ? "0px" : "-70px" }}
                                    transition={{ duration: 0.5, delay: isMobile ? 0.7 : 0.8, ease }}
                                />
                                <motion.div
                                    initial={{ opacity: 0, x: -12 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, margin: isMobile ? "0px" : "-70px" }}
                                    transition={{ duration: 0.6, delay: isMobile ? 0.8 : 1.02, ease }}
                                    className="space-y-3"
                                >
                                    <h3 className="font-minecraft-seven text-xl">Here for the Long Haul</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        We've been around for seven years, and we plan to be around for seven more.
                                        Your builds aren't going anywhere, and neither are we.
                                    </p>
                                </motion.div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    )
}