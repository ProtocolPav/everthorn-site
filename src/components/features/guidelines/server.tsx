import GuidelineItem from "./guideline-item";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {XCircleIcon, HeartIcon, WrenchIcon, GlobeIcon} from "@phosphor-icons/react";

export default function ServerRules() {
    return (
        <GuidelineItem name={'Server Rules'} important>
            <div className="grid gap-6">
                <div className="grid gap-4">
                    <Alert variant={'red'}>
                        <XCircleIcon weight={'duotone'} className="size-4" />
                        <AlertDescription>
                            <strong className="font-semibold">Zero Tolerance</strong>
                            <div>No griefing, stealing, or abusing any in-game exploits</div>
                        </AlertDescription>
                    </Alert>

                    <div className="flex items-start gap-3">
                        <HeartIcon weight={'duotone'} className="size-5 text-fuchsia-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <h5>Be Good</h5>
                            <p className="text-sm">
                                Our community is built on trust and mutual respect.
                                Respect people's builds, and be a good minecraftian :D
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <GlobeIcon weight={'duotone'} className="size-5 text-orange-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <h5>Natural Progression</h5>
                            <p className="text-sm mb-2">These limitations create a balanced, collaborative experience enforced by in-game systems:</p>
                            <ul className="text-sm grid gap-2 list-disc pl-4">
                                <li>Single Nether Portal (encourages use of roads)</li>
                                <li>Each dimension has a circular world border. The overworld's is 2000 blocks.</li>
                                <li>The End Border can be expanded by sacrificing items to the Altar</li>
                                <li>Elytra cannot be enchanted with Mending</li>
                            </ul>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <WrenchIcon weight={'duotone'} className="size-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <h5>Farm Guidelines</h5>
                            <p className="text-sm mb-2">When building redstone farms, please follow these guidelines:</p>
                            <ul className="text-sm grid gap-2 list-disc pl-4">
                                <li>Keep farms reasonably sized and spaced out</li>
                                <li>Farms must be decorated</li>
                                <li>No tall or floating farms</li>
                            </ul>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <XCircleIcon weight={'duotone'} className="size-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <h5>Prohibited Farms</h5>
                            <p className="text-sm mb-2">To ensure a balanced and lag-free experience, these farms are not allowed:</p>
                            <div className="grid gap-2 md:gap-5 md:grid-cols-2">
                                <ul className="text-sm grid gap-2 list-disc pl-4">
                                    <li>Raid Farms</li>
                                    <li>Boss Farms (Wither, Dragon, Warden)</li>
                                    <li>Nether Portal Farms</li>
                                </ul>
                                <ul className="text-sm grid gap-2 list-disc pl-4">
                                    <li>0-tick Farms</li>
                                    <li>Flying Machines</li>
                                    <li>Chunk Loaders</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </GuidelineItem>
    )
}