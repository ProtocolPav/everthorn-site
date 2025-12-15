import { TreeIcon, UsersThreeIcon, ClockCounterClockwiseIcon } from '@phosphor-icons/react'
import { Card, CardContent } from '@/components/ui/card'

export function AboutSection() {
    return (
        <section className="py-16 space-y-8">
            <div className="space-y-4">
                <h1 className="font-minecraft-ten text-5xl md:text-6xl">
                    Roots That Run Deep
                </h1>
                <p className="font-minecraft-seven text-xl md:text-2xl text-muted-foreground max-w-3xl">
                    Six years of stories, builds, and friendships that last.
                </p>
            </div>

            <div className="grid md:grid-cols-5 gap-4 md:gap-8">
                {/* Left: Image */}
                <div className="relative rounded-lg overflow-hidden border md:col-span-2">
                    <img
                        src="/landing/gal_daral.png"
                        alt="Everthorn community build"
                        className="object-cover w-full h-full"
                    />
                </div>

                {/* Right: Content Grid */}
                <div className="space-y-4 md:col-span-3">
                    {/* Full Width Card */}
                    <Card className={'bg-transparent border-none'}>
                        <CardContent className="p-6 space-y-3">
                            <img
                                src={'/icons/oak-sapling.png'}
                                alt="Oak Sapling Icon"
                                className="object-cover size-12"
                            />
                            <h3 className="font-minecraft-seven text-xl md:text-2xl">Survival Done Right</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Pure Bedrock survival where every build tells a story and every resource is earned through dedication.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Two Half-Width Cards */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <Card className={'bg-transparent border-none'}>
                            <CardContent className="p-6 space-y-3">
                                <img
                                    src={'/icons/heart-full.png'}
                                    alt="Heart Icon"
                                    className="object-cover size-12"
                                />
                                <h3 className="font-minecraft-seven text-lg md:text-xl">Community First</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    More than a server—a place where players become friends and friends become family.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className={'bg-transparent border-none'}>
                            <CardContent className="p-6 space-y-3">
                                <img
                                    src={'/icons/axolotl-bucket.png'}
                                    alt="Axolotl Bucket Icon"
                                    className="object-cover size-12"
                                />
                                <h3 className="font-minecraft-seven text-lg md:text-xl">Built to Last</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Six years strong and growing. Your builds and memories are safe with us, always.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    )
}
