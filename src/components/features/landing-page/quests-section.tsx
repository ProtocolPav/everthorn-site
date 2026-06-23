import { LandingQuestCard } from './quest-card-landing'
import { motion } from 'motion/react'

const QUEST_IDS: number[] = [
    933, 931, 926, 924, 909, 901, 900
]

const ease = [0.16, 1, 0.3, 1] as const

// Slight unique rotation + vertical offset per card so it feels hand-pinned
const cardTransforms = [
    { rotate: 5.4, y: 0 },
    { rotate: -1.4,  y: 12 },
    { rotate: -0.8, y: 4 },
    { rotate: 2.1,  y: -8 },
    { rotate: -1.5, y: 16 },
    { rotate: 0.9,  y: 6 },
    { rotate: -2.0, y: 2 },
]

export function QuestsSection() {
    return (
        <section className="relative overflow-hidden">
            <div className="grid grid-cols-2 items-start">
                <div className="relative z-10 space-y-4 px-4 md:px-0 md:mx-8 pt-16 pb-10">
                    <motion.h1
                        className="font-minecraft-ten text-4xl md:text-6xl"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-80px' }}
                        transition={{ duration: 0.7, ease }}
                    >
                        The Quest For...
                    </motion.h1>

                    <motion.p
                        className="font-minecraft-seven text-md md:text-lg text-muted-foreground max-w-2xl"
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-80px' }}
                        transition={{ duration: 0.7, delay: 0.1, ease }}
                    >
                        Challenges crafted by the community. Pick one up, see it through.
                    </motion.p>
                </div>

                <div className="relative w-full">
                    <img
                        src="/landing/lectern.png"
                        alt="Lectern"
                        className="w-3/4 mx-auto block"
                    />

                    {/* overlay layer */}
                    <div
                        className="absolute left-1/2 -translate-x-7/15 z-20 flex -space-x-10"
                        style={{
                            top: '7%', // manually tweak this
                        }}
                    >
                        {QUEST_IDS.slice(0, 2).map((id, i) => {
                            const t = cardTransforms[i % cardTransforms.length]

                            return (
                                <motion.div
                                    key={`${id}-${i}`}
                                    className="shrink-0 rounded-2xl drop-shadow-2xl drop-shadow-black/70"
                                    style={{ rotate: t.rotate }}
                                >
                                    <LandingQuestCard questId={id} className="w-[218px]" />
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </section>
    )
}