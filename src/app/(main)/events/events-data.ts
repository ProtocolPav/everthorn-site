// events-data.ts

import {
    MapPinIcon,
    ClockIcon,
    UsersIcon,
    SkullIcon,
    CubeIcon,
    DiamondIcon,
    CoinsIcon,
    TrophyIcon,
    SwordIcon,
    HeartIcon,
} from "@phosphor-icons/react"

import {EventData} from "@/types/events";

export const events: EventData[] = [
    {
        slug: "trick-or-treat",
        title: "Trick or Treat",
        startTime: new Date("2025-10-31T18:00:00"),
        endTime: new Date("2025-11-02T23:59:59"),
        image: "/events/trick-or-treat.png",
        description: "Venture into a spooky pale oak forest filled with mysteries, lucky blocks, and supernatural surprises!",
        teaserText: "Something spooky is coming to the server this Halloween...",
        inWorld: false,
        teams: 0,
        rewardTeaser: "Lucky blocks, exclusive items, and transferable rewards!",

        about: [
            "Spawn automatically at base camp in the pale oak forest",
            "Collect starting gear from supply chests at base camp",
            "Stay within the 2000x2000 block world border",
            "Mine resources to trade for lucky blocks at base camp",
            "Only items in your shulker box transfer back to main world",
            "Event runs for 3 days of Halloween adventures"
        ],

        extraInfo: [
            {
                title: "Lucky Block Trading System",
                content: "Enter a mysterious pale oak forest where nothing is as it seems. Armed with only basic copper gear, you must survive, explore, and collect resources to trade for lucky blocks. Trade your mined resources at base camp for different tiers of lucky blocks - from basic iron-tier blocks to super rare diamond-tier blocks!"
            },
            {
                title: "World Exploration",
                content: "The pale oak forest is a custom-generated 2000x2000 block world filled with mysteries and surprises. Explore carefully as you gather resources and prepare for the unknown rewards (or consequences) from lucky blocks."
            },
            {
                title: "Transfer System",
                content: "At the end of the event, only items stored in your shulker box will transfer back to the main world. Mined ores cannot be transferred unless they have the special 'Can Be Transferred' tag from lucky block drops. Plan your inventory carefully!"
            }
        ],

        stats: [
            { icon: MapPinIcon, label: "World Size", value: "2000x2000", color: "text-blue-500" }
        ],

        customCards: {
            sectionTitle: "Lucky Block Tiers",
            cards: [
                {
                    icon: DiamondIcon,
                    title: "Super Lucky Block",
                    subtitle: "10 Diamonds",
                    description: "Highest Tier. Get REALLY lucky or REALLY unlucky!",
                    color: "text-cyan-400"
                },
                {
                    icon: CoinsIcon,
                    title: "Lucky Block",
                    subtitle: "10 Gold Ingots",
                    description: "Regular Tier. Moderate Luck, Moderate risk!",
                    color: "text-yellow-500"
                },
                {
                    icon: CubeIcon,
                    title: "Kinda Lucky Block",
                    subtitle: "10 Iron Ingots",
                    description: "Basic Tier. Basic Luck, but also relatively low risk!",
                    color: "text-slate-400"
                }
            ]
        },

        rewards: [
            {
                title: "Transferable Items",
                icon: TrophyIcon,
                color: "text-amber-600",
                items: [
                    "All items in your shulker box",
                    "Items with 'Can Be Transferred' tag from lucky blocks",
                    "Rare items with CM approval (limited quantities)"
                ]
            }
        ],

        rules: {
            allowed: [
                "Items stored in shulker boxes",
                "Ores with the 'Can Be Transferred' tag",
                "Rare items with CM approval (usually limited to 1-2 per player)"
            ],
            disallowed: [
                "Mined ores (including crafted blocks)",
                "Lucky blocks themselves",
                "Ores crafted with 'Can Be Transferred' tag (tag is removed when crafted)"
            ]
        },

        faq: [
            {
                question: "How do I start the event?",
                answer: "You'll automatically spawn at base camp. Collect your gear from the supply chests and start exploring the pale oak forest!"
            },
            {
                question: "What's the goal?",
                answer: "Survive, gather resources, trade for lucky blocks, and collect transferable rewards that you can bring back to the main world."
            },
            {
                question: "Can I work with others?",
                answer: "Yes! Team up with other players to gather resources and share the risks of opening lucky blocks."
            },
            {
                question: "Can I PvP?",
                answer: "Yes, but keep it to a normal level. If you're playing unfairly, the CMs will start playing unfairly too!"
            },
            {
                question: "What transfers back?",
                answer: "Only items in your shulker box transfer to the main world."
            },
            {
                question: "What does 'CM Approval' mean?",
                answer: "We don't want this event to be too overpowered, so items like Elytra, Heavy Cores, and other super-duper rare items will require approval from CMs. Usually we would limit you to 1-2 of that item, depending on the item!"
            },
            {
                question: "Can I bring back mined ores?",
                answer: "No. Only ores with the 'Can Be Transferred' tag are allowed. Those are usually found from Lucky Block drops! Be careful not to craft with them, as the tag will be removed."
            },
            {
                question: "Can I lose my stuff?",
                answer: "Yes. Be ready to lose anything and everything. If you want to be ultimately safe, store your stuff in the spawn hub. You could get really unlucky and die, or get REALLY unlucky and have your stuff cleared!"
            }
        ]
    },

    {
        slug: "anniversary-festival-6",
        title: "6th Anniversary Festival",
        startTime: new Date("2025-06-12T00:00:00"),
        endTime: new Date("2025-06-16T05:00:00"),
        image: "/events/anniversary-6.png",
        description: "Celebrate 6 years of Everthorn with games, prizes, and fun activities!",
        inWorld: true,
        teams: 0,
        rewardTeaser: "Win tokens at games and redeem for amazing prizes!",

        about: [
            "Visit the festival grounds at coordinates 340, -1150",
            "Play various arcade games and challenges to earn tokens",
            "Race against the clock in timed challenges for special prizes",
            "Trade tokens with NPCs for exclusive rewards",
            "Compete for best times on maze and parkour for unique items",
            "Event runs from June 9-16, 2025"
        ],

        extraInfo: [
            {
                title: "Token-Based Games",
                content: "Play Skeeball and Take Aim (archery) to earn tokens. The more you play, the more tokens you collect! Trade your tokens at the prize NPC for exclusive anniversary items and rewards."
            },
            {
                title: "Timed Challenges",
                content: "Race through the maze or complete the parkour course as fast as you can. Best times win special prizes - a shulker shell for the maze champion and a spawner block for the parkour master!"
            },
            {
                title: "Special Activities",
                content: "Try one-time experiences like Dig Straight Down (pick a moss square for a mystery prize), Guess the Beans (DM Bell your guess for gold ore blocks), or pile into the Photo Booth with friends!"
            }
        ],

        stats: [
            { icon: MapPinIcon, label: "Location", value: "340, -1150", color: "text-blue-500" }
        ],

        customCards: {
            sectionTitle: "Festival Games & Activities",
            cards: [
                {
                    icon: DiamondIcon,
                    title: "Da Maaaze",
                    subtitle: "Timed Challenge",
                    description: "Navigate through the maze as fast as possible. Your time is recorded and the best time wins a shulker shell!",
                    color: "text-cyan-400"
                },
                {
                    icon: CoinsIcon,
                    title: "Skeeball",
                    subtitle: "Earn Tokens",
                    description: "Classic arcade game! Roll balls up the ramp and score points to earn tokens for prizes.",
                    color: "text-yellow-500"
                },
                {
                    icon: SwordIcon,
                    title: "Take Aim",
                    subtitle: "Earn Tokens",
                    description: "Test your archery skills by shooting targets. Hit the marks to earn tokens!",
                    color: "text-red-500"
                },
                {
                    icon: ClockIcon,
                    title: "Parkour",
                    subtitle: "Timed Challenge",
                    description: "Complete the timed parkour course. Best time wins a spawner block!",
                    color: "text-green-500"
                },
                {
                    icon: CubeIcon,
                    title: "Dig Straight Down",
                    subtitle: "One Per Customer",
                    description: "Pick a moss square and dig down to discover your mystery prize. Only one attempt allowed!",
                    color: "text-emerald-500"
                },
                {
                    icon: UsersIcon,
                    title: "Spleef",
                    subtitle: "Competitive",
                    description: "Be the last player standing on the mini spleef board. Break blocks beneath other players to win!",
                    color: "text-purple-500"
                },
                {
                    icon: MapPinIcon,
                    title: "Carousel",
                    subtitle: "Relaxing",
                    description: "Take a break and ride the carousel while enjoying some music. Perfect photo opportunity!",
                    color: "text-pink-500"
                },
                {
                    icon: TrophyIcon,
                    title: "Guess the Beans",
                    subtitle: "Contest",
                    description: "Count the gold ore bean blocks and DM your guess to Bell for a chance to win!",
                    color: "text-amber-600"
                },
                {
                    icon: DiamondIcon,
                    title: "Photo Booth",
                    subtitle: "Social",
                    description: "Pile in with friends or strike a solo pose. Capture memories from the 6th anniversary celebration!",
                    color: "text-blue-400"
                }
            ]
        },

        rewards: [
            {
                title: "Token Prizes",
                icon: TrophyIcon,
                color: "text-amber-600",
                items: [
                    "Trade tokens at the prize NPC for exclusive items",
                    "Multiple prize tiers available",
                    "Special anniversary-themed rewards"
                ]
            },
            {
                title: "Special Challenge Prizes",
                icon: DiamondIcon,
                color: "text-cyan-400",
                items: [
                    "Best Maze Time → Shulker Shell",
                    "Best Parkour Time → Spawner Block",
                    "Guess the Beans Winner → Special Prize"
                ]
            }
        ],

        faq: [
            {
                question: "Where is the festival?",
                answer: "The festival grounds are located at coordinates 340, -1150 in the main world. Look for the NPC and festival decorations!"
            },
            {
                question: "How do I earn tokens?",
                answer: "Play Skeeball and Take Aim (archery) to earn tokens. The better you do, the more tokens you receive!"
            },
            {
                question: "What are the timed challenges?",
                answer: "The maze and parkour are timed challenges. Complete them as fast as possible - the player with the best time for each wins a special prize!"
            },
            {
                question: "Can I play games multiple times?",
                answer: "Yes! Most games can be played multiple times to earn more tokens. However, Dig Straight Down is limited to one attempt per player."
            },
            {
                question: "How do I participate in Guess the Beans?",
                answer: "Count the gold ore bean blocks at the festival and send your guess to Bell via DM. Closest guess wins!"
            },
            {
                question: "What can I buy with tokens?",
                answer: "Visit the prize NPC at the festival to see all available rewards. Trade your tokens for exclusive anniversary items and prizes!"
            },
            {
                question: "Is there PvP?",
                answer: "No PvP except in designated games like Spleef. The festival is meant to be a fun, friendly celebration!"
            },
            {
                question: "Can I bring friends?",
                answer: "Absolutely! The more the merrier. Bring your friends to play games together, compete for best times, or take photos in the Photo Booth!"
            }
        ]
    },

    {
        slug: "uhc-4",
        title: "Everthorn UHC 4: Hardcore Hearts",
        startTime: new Date("2025-02-22T19:00:00"),
        endTime: new Date("2025-02-22T21:30:00"),
        image: "/events/uhc.png",
        description: "Ultra Hardcore survival battle with teams of 3. Last team standing wins!",
        inWorld: false,
        teams: 3,
        rewardTeaser: "Valuable ores, enchanted gear, and exclusive rewards for challenge completion!",

        about: [
            "Teams of 3 spawn at random locations on a 3000-block diameter map",
            "30-minute grace period with no PvP to gather resources and prepare",
            "60-minute main game with PvP enabled and ongoing challenges",
            "Final deathmatch at map center with shrinking border",
            "No natural regeneration - healing requires golden apples or potions",
            "Custom crafting recipes and special challenge rewards"
        ],

        extraInfo: [
            {
                title: "Grace Period (30 Minutes - No PvP)",
                content: "Teams spawn at random locations and have 30 minutes to gather resources, prepare for combat, and start completing challenges. Use this time wisely to get geared up before PvP begins!"
            },
            {
                title: "Main Game (60 Minutes - PvP Enabled)",
                content: "After the grace period, PvP is enabled and the real battle begins. Continue completing challenges while trying to survive encounters with other teams. At halftime, all surviving players receive Regeneration I for 30 seconds to keep the action going."
            },
            {
                title: "Deathmatch",
                content: "After 90 minutes of gameplay, all remaining teams are teleported to the center of the map. The border shrinks to a 100-block radius for an intense final showdown. Only one team can emerge victorious!"
            },
            {
                title: "Minecraft Gameplay Adjustments",
                content: "This is UHC mode - no natural regeneration! Healing requires golden apples or potions. Phantoms are disabled and sleeping doesn't work. Custom recipes make golden apples easier to craft: 8 Gold Nuggets + 1 Apple for regular, 8 Gold Blocks + 1 Apple for Enchanted (Notch) Apples."
            }
        ],

        stats: [
            { icon: MapPinIcon, label: "Map Size", value: "1500x1500 blocks", color: "text-blue-500" },
            { icon: ClockIcon, label: "Duration", value: "2.5 Hours", color: "text-green-500" },
            { icon: HeartIcon, label: "Mode", value: "No Regen", color: "text-red-500" }
        ],

        customCards: {
            sectionTitle: "Challenge Tiers",
            cards: [
                {
                    icon: CubeIcon,
                    title: "Iron Challenges",
                    subtitle: "Individual",
                    description: "Available to all players individually. Complete simple tasks for small rewards like nuggets, blocks, and enchanted books.",
                    color: "text-slate-400"
                },
                {
                    icon: CoinsIcon,
                    title: "Gold Challenges",
                    subtitle: "Team-Based",
                    description: "Team-based challenges with rewards for all members. Includes survival milestones and mob hunting for better rewards.",
                    color: "text-yellow-500"
                },
                {
                    icon: DiamondIcon,
                    title: "Netherite Challenges",
                    subtitle: "First Team Only",
                    description: "Only the first team to complete each challenge earns the reward. Includes collection tasks and PvP objectives for top-tier loot.",
                    color: "text-cyan-400"
                }
            ]
        },

        rewards: [
            {
                title: "Iron Challenges",
                icon: CubeIcon,
                color: "text-slate-400",
                items: [
                    "Travel 500 blocks → 1 Nugget",
                    "Build up to Y320 → 384 Blocks (mixed, no ore/creative blocks)",
                    "Craft a lectern → Enchantment Book (one enchant of choice)",
                    "Visit [0,0] → Enchanted Diamond Sword (Mending, Unbreaking III, Sharpness IV, Fire Aspect II, Looting III)"
                ]
            },
            {
                title: "Gold Challenges",
                icon: CoinsIcon,
                color: "text-yellow-500",
                items: [
                    "Jump from Y320 to Y-50 → 640 Blocks (mixed)",
                    "Survive past Halftime → 10 Mineral Blocks (Copper, Iron, Gold, Diamond, Emerald, Lapis, Redstone)",
                    "Kill 15 Skeletons → +40 XP Levels",
                    "Obtain a Blaze Rod → 3 Nuggets"
                ]
            },
            {
                title: "Netherite Challenges",
                icon: DiamondIcon,
                color: "text-cyan-400",
                items: [
                    "Collect all 16 colored wool → Shulker Box",
                    "Eliminate a team → Steve Head",
                    "Mine 128 ores (Gold, Diamond, Iron, Emerald, Redstone, Ancient Debris) → 64 Ores",
                    "Obtain an Ominous Trial Key → Enchanted Mace (Mending, Unbreaking III, Density IV, Wind Burst I, Fire Aspect II)"
                ]
            }
        ],

        rules: {
            allowed: [
                "PvP during main game (after 30-minute grace period)",
                "Teaming with your assigned team of 3",
                "Trading resources with teammates",
                "Custom golden apple crafting recipes"
            ],
            disallowed: [
                "PvP during grace period (first 30 minutes)",
                "Teaming with other teams",
                "Sharing challenge rewards with eliminated players",
                "Breaking spectator mode rules after elimination"
            ]
        },

        faq: [
            {
                question: "What is UHC mode?",
                answer: "Ultra Hardcore mode disables natural regeneration. You can only heal using golden apples, potions, or special regeneration effects given at halftime."
            },
            {
                question: "How do teams work?",
                answer: "Teams of 3 players spawn together at random locations. You must stay with your team - no teaming with other groups is allowed."
            },
            {
                question: "What happens when I die?",
                answer: "Once eliminated, you enter Spectator Mode. You must leave your team's voice channel and join the public Everthorn VC to avoid giving away information."
            },
            {
                question: "How do the challenges work?",
                answer: "There are three tiers: Iron (individual), Gold (team-based), and Netherite (first team only). Complete challenges to earn valuable rewards for the main server."
            },
            {
                question: "What are the special effects?",
                answer: "At game start and deathmatch, players get Full Resistance for 60 seconds. At halftime, all survivors get Regeneration I for 30 seconds."
            },
            {
                question: "Where is the loot structure?",
                answer: "A special loot-filled structure is located at coordinates [0,0] at the center of the map. It's high risk, high reward!"
            },
            {
                question: "What's the deathmatch?",
                answer: "After 90 minutes (30 min grace + 60 min main game), all remaining teams teleport to map center. The border shrinks to 100 blocks for an epic final battle."
            },
            {
                question: "Do rewards apply during the game?",
                answer: "No, challenge rewards are for the main server only. During UHC, you're on your own to gather gear and survive!"
            }
        ]
    }
];
