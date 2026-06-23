import { LandingQuestCard } from './quest-card-landing'
import { motion } from 'motion/react'

const QUEST_IDS: number[] = [
    933, 931, 926, 924, 909, 901, 900
]

const ease = [0.16, 1, 0.3, 1] as const

// Slight unique rotation + vertical offset per card so it feels hand-pinned
const cardTransforms = [
    { rotate: -2.5, y: 0 },
    { rotate: 1.2,  y: 12 },
    { rotate: -0.8, y: 4 },
    { rotate: 2.1,  y: -8 },
    { rotate: -1.5, y: 16 },
    { rotate: 0.9,  y: 6 },
    { rotate: -2.0, y: 2 },
]

export function QuestsSection() {
    return (
        <section className="relative overflow-hidden">
            {/* Heading — outside/above the board */}
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

            {/* Cork board */}
            <div
                className="relative w-full py-10"
                style={{
                    // Cork color base
                    backgroundColor: '#c4956a',
                    // Cork texture via repeating noise pattern
                    backgroundImage: `
                        url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='turbulence' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0.3'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")
                    `,
                    // Wood frame border
                    boxShadow: `
                        inset 0 8px 16px rgba(0,0,0,0.35),
                        inset 0 -8px 16px rgba(0,0,0,0.35),
                        inset 8px 0 16px rgba(0,0,0,0.25),
                        inset -8px 0 16px rgba(0,0,0,0.25),
                        0 4px 24px rgba(0,0,0,0.4)
                    `,
                    borderTop: '10px solid #6b3f1a',
                    borderBottom: '10px solid #6b3f1a',
                    borderLeft: '6px solid #7a4820',
                    borderRight: '6px solid #7a4820',
                }}
            >
                {/* Inner board shadow for depth */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.25) 100%)',
                    }}
                />

                {/* Edge fades into page */}
                <div className="absolute left-0 top-0 bottom-0 w-12 bg-linear-to-r from-background/60 to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-12 bg-linear-to-l from-background/60 to-transparent z-10 pointer-events-none" />

                {/* Cards */}
                <div className="flex gap-8 overflow-x-auto px-12 pb-8 pt-4 scrollbar-none">
                    {QUEST_IDS.map((id, i) => {
                        const t = cardTransforms[i % cardTransforms.length]
                        return (
                            <motion.div
                                key={`${id}-${i}`}
                                className="flex-shrink-0"
                                initial={{ opacity: 0, y: 32 }}
                                whileInView={{ opacity: 1, y: t.y }}
                                viewport={{ once: true, margin: '-40px' }}
                                transition={{ duration: 0.5, delay: i * 0.08, ease }}
                                style={{ rotate: t.rotate }}
                            >
                                <LandingQuestCard questId={id} />
                            </motion.div>
                        )
                    })}
                </div>
            </div>

            {/* Fade board into page background below */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-linear-to-b from-transparent to-background pointer-events-none z-10" />
        </section>
    )
}