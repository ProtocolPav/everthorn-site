import uhc from '../../../../public/events/uhc.png'
import Image from "next/image";
import {Separator} from "@/components/ui/separator";
import {Badge} from "@/components/ui/badge";

export default function UHC() {
    return (
        <section className="mx-5 grid items-center justify-center gap-8 pb-10 pt-8 text-center md:mx-10 md:py-12 xl:mx-20">
            <Image src={uhc} alt="UHC Image" width={900} />
            <Separator />
            <h2 className="text-3xl font-bold">Game Overview</h2>
            <div className="mx-auto text-left md:w-9/12">
                <h3 className="mt-6 text-xl font-semibold">Grace Period (30 Minutes) - No PvP</h3>
                <p className="ml-4 list-inside list-disc">
                    <li>Teams of 3 spawn at random locations on the map.</li>
                    <li>Gather resources and prepare for monsters and other teams.</li>
                    <li>Start completing challenges to gain rewards.</li>
                </p>

                <h3 className="mt-6 text-xl font-semibold">Main Game (60 Minutes) - PvP Enabled</h3>
                <p className="ml-4 list-inside list-disc">
                    <li>PvP is now enabled—prepare to fight if you encounter another team.</li>
                    <li>Continue completing challenges while aiming to be the last team standing.</li>
                    <li>At halftime, all surviving players receive regeneration effects.</li>
                </p>

                <h3 className="mt-6 text-xl font-semibold">Deathmatch</h3>
                <p className="ml-4 list-inside list-disc">
                    <li>After 60 minutes, all remaining teams are teleported to the center of the map.</li>
                    <li>The border shrinks to a 100-block radius for an intense final showdown.</li>
                </p>
            </div>

            <h2 className="mt-10 text-3xl font-bold">Rules</h2>
            <div className="mx-auto text-left md:w-9/12">
                <h3 className="mt-6 text-xl font-semibold">Minecraft Gameplay Adjustments</h3>
                <p className="ml-4 list-inside list-disc">
                    <li>No natural regeneration—healing requires golden apples or potions.</li>
                    <li>No phantoms, and sleeping is disabled.</li>
                    <li>Custom crafting recipes:</li>
                    <p className="ml-8 list-inside list-disc">
                        <li><b>Enchanted (Notch) Apple</b>: 8 Gold Blocks + 1 Apple</li>
                        <li><b>Golden Apple</b>: 8 Gold Nuggets + 1 Apple</li>
                    </p>
                </p>

                <h3 className="mt-6 text-xl font-semibold">UHC-Specific Rules</h3>
                <p className="ml-4 list-inside list-disc">
                    <li>PvP is disabled during the first 30 minutes (Grace Period).</li>
                    <li>The map is a circular area with a radius of 1500 blocks (3000 blocks total).</li>
                    <li>A loot-filled structure is located at [0,0].</li>
                    <li>Once eliminated, players enter Spectator Mode and must leave their team’s VC to join the public Everthorn VC.</li>
                    <li>Special effects during gameplay:</li>
                    <p className="ml-8 list-inside list-disc">
                        <li><b>Halftime</b>: Regeneration I for 30 seconds.</li>
                        <li><b>Game Start & Deathmatch</b>: Full Resistance for 60 seconds.</li>
                    </p>
                </p>
            </div>

            <h2 className="mt-10 text-3xl font-bold">Challenges & Rewards</h2>
            <p className="mb-4 text-sm italic">Rewards apply to the main server, not during the game itself.</p>

            {/* Iron Challenges */}
            <div className="mx-auto text-left md:w-9/12">
                <h3 className="mt-6 text-xl font-semibold">Iron Challenges</h3>
                <p className="mb-2 text-sm italic">Available to all players individually.</p>
                <p className="ml-4 list-inside list-disc">
                    <li>Travel 500 blocks <Badge variant={'outline'}>1 Nug</Badge></li>
                    <li>Build up to Y320 <Badge variant={'outline'}>384 Blocks</Badge><sup>1</sup></li>
                    <li>Craft a lectern <Badge variant={'outline'}>Enchantment Book</Badge><sup>2</sup></li>
                    <li>Visit [0,0] <Badge variant={'outline'}>Enchanted Diamond Sword</Badge><sup>3</sup></li>
                </p>

                {/* Gold Challenges */}
                <h3 className="mt-6 text-xl font-semibold">Gold Challenges</h3>
                <p className="mb-2 text-sm italic">Team-based challenges with rewards for all members.</p>
                <p className="ml-4 list-inside list-disc">
                    <li>Jump from Y320 to Y-50 <Badge variant={'outline'}>640 Blocks</Badge><sup>1</sup></li>
                    <li>Survive past Halftime <Badge variant={'outline'}>10 Mineral Blocks</Badge><sup>4</sup></li>
                    <li>Kill 15 Skeletons <Badge variant={'outline'}>+40 XP Levels</Badge></li>
                    <li>Obtain a Blaze Rod <Badge variant={'outline'}>3 Nugs</Badge></li>
                </p>

                {/* Netherite Challenges */}
                <h3 className="mt-6 text-xl font-semibold">Netherite Challenges</h3>
                <p className="mb-2 text-sm italic">First team to complete each challenge earns the reward.</p>
                <p className="ml-4 list-inside list-disc">
                    <li>Collect all 16 colored wool <Badge variant={'outline'}>Shulker Box</Badge></li>
                    <li>Eliminate a team <Badge variant={'outline'}>Steve Head</Badge></li>
                    <li>Mine 128 ores<sup>5</sup> <Badge variant={'outline'}>64 Ores</Badge><sup>4</sup></li>
                    <li>Obtain an Ominous Trial Key <Badge variant={'outline'}>Enchanted Mace</Badge><sup>6</sup></li>
                </p>

                {/* Footnotes */}
                <div className="mt-6 text-xs">
                    {[
                        "Blocks can be mixed; ore blocks & non-survival blocks excluded.",
                        "Book contains one enchantment of choice (excludes Wind Burst, Breach, Density).",
                        "Diamond Sword Enchantments: Mending, Unbreaking III, Sharpness IV, Fire Aspect II, Looting III.",
                        "Ore rewards include Copper, Iron, Gold, Diamond, Emerald, Lapis, Redstone.",
                        "Valid ores: Gold, Diamond, Iron, Emerald, Redstone, Ancient Debris.",
                        "Mace Enchantments: Mending, Unbreaking III, Density IV, Wind Burst I, Fire Aspect II.",
                    ].map((note, index) => (
                        <>
                            {index + 1}. {note}
                            {index !== note.length - 1 && (
                                <>
                                    <br/>
                                </>
                            )}
                        </>
                    ))}
                </div>
            </div>
        </section>

                    )
}
