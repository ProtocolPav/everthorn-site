import { TreeIcon, UsersThreeIcon, ClockCounterClockwiseIcon } from '@phosphor-icons/react'

export function AboutSection() {
    return (
        <section className="space-y-12">
            <div className="space-y-4">
                <h1 className="font-minecraft-ten text-5xl md:text-6xl">
                    Roots That Run Deep
                </h1>
                <p className="font-minecraft-seven text-xl md:text-2xl text-muted-foreground max-w-3xl">
                    Six years of stories, builds, and friendships that last.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 pt-4">
                <div className="space-y-3">
                    <TreeIcon className="w-12 h-12 text-green-600 dark:text-green-400" weight="duotone" />
                    <h3 className="font-minecraft-seven text-xl md:text-2xl">Survival Done Right</h3>
                    <p className="text-muted-foreground leading-relaxed">
                        Pure Bedrock survival where every build tells a story and every resource is earned through dedication.
                    </p>
                </div>

                <div className="space-y-3">
                    <UsersThreeIcon className="w-12 h-12 text-blue-600 dark:text-blue-400" weight="duotone" />
                    <h3 className="font-minecraft-seven text-xl md:text-2xl">Community First</h3>
                    <p className="text-muted-foreground leading-relaxed">
                        More than a server—a place where players become friends and friends become family.
                    </p>
                </div>

                <div className="space-y-3">
                    <ClockCounterClockwiseIcon className="w-12 h-12 text-amber-600 dark:text-amber-400" weight="duotone" />
                    <h3 className="font-minecraft-seven text-xl md:text-2xl">Built to Last</h3>
                    <p className="text-muted-foreground leading-relaxed">
                        Six years strong and growing. Your builds and memories are safe with us, always.
                    </p>
                </div>
            </div>
        </section>
    )
}
