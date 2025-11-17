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
    CrownIcon,
    MedalIcon
} from "@phosphor-icons/react"

export interface EventData {
    slug: string;
    title: string;
    startTime: Date;
    endTime: Date;
    image: string;
    teaserImage?: string;
    description?: string;
    teaserText?: string;
    inWorld?: boolean;
    teams?: number;
    rewardTeaser?: string;

    // Detail page fields
    about: string[];
    extraInfo: {
        title: string;
        content: string;
    }[];
    faq: {
        question: string;
        answer: string;
    }[];
    rewards: {
        title: string;
        items: string[];
        icon?: any;
        color?: string;
    }[];
    rules?: {
        allowed: string[];
        disallowed: string[];
    };
    customCards?: {
        sectionTitle: string;
        cards: {
            icon: any;
            title: string;
            subtitle?: string;
            description: string;
            color?: string;
        }[];
    };
    stats?: {
        icon: any;
        label: string;
        value: string;
        color?: string;
    }[];
    images?: {
        src: string;
        alt: string;
    }[];
}

export const events: EventData[] = [
    {
        slug: "trick-or-treat2",
        title: "Trick or Treat",
        startTime: new Date("2025-10-31T18:00:00"),
        endTime: new Date("2025-11-02T23:59:59"),
        image: "/bg.png",
        description: "Venture into a spooky pale oak forest filled with mysteries and surprises!",
        teaserText: "Something spooky is coming to the server this Halloween...",
        inWorld: false,
        teams: 0,
        rewardTeaser: "Lucky blocks, exclusive items, and Halloween-themed rewards!",

        about: [
            "Explore a mysterious 2000x2000 block pale oak forest world",
            "Start with basic copper gear and survive in the spooky environment",
            "Collect resources to trade for various tiers of lucky blocks",
            "Only items in your shulker box can be transferred back to the main world",
            "Event runs for 3 full days of Halloween fun"
        ],

        extraInfo: [
            {
                title: "How Lucky Blocks Work",
                content: "Trade your mined resources at the base camp for lucky blocks. Each tier has different risks and rewards - from basic iron-tier blocks to the super rare diamond-tier blocks that can give you incredible loot or challenging surprises!"
            },
            {
                title: "The Pale Oak Forest",
                content: "This custom-generated world features dense pale oak forests, mysterious structures, and hidden secrets. The atmosphere is spooky and perfect for Halloween, with special mobs and environmental challenges waiting around every corner."
            },
            {
                title: "Survival Strategy",
                content: "You'll need to balance resource gathering with survival. Store valuable items safely at spawn if you want to guarantee keeping them. The forest is dangerous, and you could lose everything if you're not careful!"
            }
        ],

        stats: [
            { icon: MapPinIcon, label: "World Size", value: "2000x2000", color: "text-blue-500" },
            { icon: ClockIcon, label: "Duration", value: "3 Days", color: "text-green-500" },
            { icon: UsersIcon, label: "Players", value: "Unlimited", color: "text-purple-500" },
            { icon: SkullIcon, label: "Difficulty", value: "Survival", color: "text-red-500" }
        ],

        customCards: {
            sectionTitle: "Lucky Block Tiers",
            cards: [
                {
                    icon: DiamondIcon,
                    title: "Super Lucky Block",
                    subtitle: "10 Diamonds",
                    description: "Highest tier with the best rewards and biggest risks. You could get incredibly rare items or face serious challenges!",
                    color: "text-cyan-400"
                },
                {
                    icon: CoinsIcon,
                    title: "Lucky Block",
                    subtitle: "10 Gold Ingots",
                    description: "Regular tier with balanced rewards and moderate risks. A safe middle ground for most players.",
                    color: "text-yellow-500"
                },
                {
                    icon: CubeIcon,
                    title: "Kinda Lucky Block",
                    subtitle: "10 Iron Ingots",
                    description: "Basic tier with simple rewards and low risks. Perfect for starting out and testing your luck!",
                    color: "text-slate-400"
                }
            ]
        },

        rewards: [
            {
                title: "For Everyone",
                icon: TrophyIcon,
                color: "text-amber-600",
                items: [
                    "All items in your shulker box transfer back",
                    "Access to Halloween-themed cosmetics",
                    "Participation badge for your profile"
                ]
            }
        ],

        rules: {
            allowed: [
                "Items stored in shulker boxes",
                "Ores with the 'Can Be Transferred' tag",
                "Event-specific rewards and cosmetics",
                "Resources gathered from lucky blocks"
            ],
            disallowed: [
                "Mined ores (including crafted blocks)",
                "Lucky blocks themselves",
                "Items without proper transfer tags",
                "Exploited or duplicated items"
            ]
        },

        faq: [
            {
                question: "How do I start the event?",
                answer: "You'll automatically spawn at the base camp in the pale oak forest. Collect your starting copper gear from the supply chests and begin exploring!"
            },
            {
                question: "What's the goal of the event?",
                answer: "Survive in the spooky forest, gather resources, trade for lucky blocks, and collect as many transferable rewards as possible within the 3-day timeframe."
            },
            {
                question: "Can I team up with other players?",
                answer: "Yes! While there are no official teams, you're free to work together with friends to gather resources and share the risks of opening lucky blocks."
            },
            {
                question: "What happens if I die?",
                answer: "You'll lose items on you unless they're stored safely at spawn. Be strategic about what you carry! Store valuable items frequently to minimize losses."
            },
            {
                question: "Can I bring items back to the main world?",
                answer: "Only items in your shulker box will transfer back, and mined ores are not allowed unless they have the special 'Can Be Transferred' tag from lucky blocks."
            },
            {
                question: "What does 'CM Approval' mean for rare items?",
                answer: "Items like Elytra or Heavy Cores require approval from Community Managers to prevent the event from being too overpowered. Usually limited to 1-2 per player."
            }
        ],

        images: [
            { src: "/bg.png", alt: "Spooky pale oak forest" },
            { src: "/bg.png", alt: "Base camp at night" },
            { src: "/bg.png", alt: "Lucky block trading area" }
        ]
    },

    {
        slug: "winter-festival",
        title: "Winter Festival",
        startTime: new Date("2025-12-20T10:00:00"),
        endTime: new Date("2025-12-25T23:59:59"),
        image: "/bg.png",
        description: "Celebrate the holidays with snow, ice, and festive challenges!",
        inWorld: true,
        teams: 4,
        rewardTeaser: "Exclusive winter cosmetics and holiday items!",

        about: [
            "Participate in winter-themed challenges across the main world",
            "Form teams of 4 to compete in various snow and ice activities",
            "Complete daily quests for bonus rewards",
            "Build the best snow sculpture for special prizes",
            "Event runs throughout the holiday season"
        ],

        extraInfo: [
            {
                title: "Team Competition",
                content: "Teams of 4 will compete in various winter challenges including ice racing, snowball fights, and collaborative building contests. Points are awarded for each activity, with the top teams receiving exclusive rewards."
            },
            {
                title: "Daily Challenges",
                content: "New challenges unlock each day of the festival. These range from simple collection tasks to complex puzzle-solving and parkour courses, all themed around winter and the holidays."
            }
        ],

        stats: [
            { icon: UsersIcon, label: "Team Size", value: "4 Players", color: "text-blue-500" },
            { icon: ClockIcon, label: "Duration", value: "6 Days", color: "text-green-500" },
            { icon: MapPinIcon, label: "Location", value: "Main World", color: "text-purple-500" }
        ],

        rewards: [
            {
                title: "1st Place Team",
                icon: CrownIcon,
                color: "text-yellow-500",
                items: [
                    "Exclusive Winter Crown cosmetic",
                    "1000 server coins per player",
                    "Limited edition snow particle effect",
                    "Champion title for one month"
                ]
            },
            {
                title: "2nd Place Team",
                icon: MedalIcon,
                color: "text-slate-400",
                items: [
                    "Silver snowflake cosmetic",
                    "750 server coins per player",
                    "Winter cape design"
                ]
            },
            {
                title: "3rd Place Team",
                icon: MedalIcon,
                color: "text-amber-700",
                items: [
                    "Bronze snowflake cosmetic",
                    "500 server coins per player",
                    "Holiday themed pet"
                ]
            },
            {
                title: "Participation Rewards",
                icon: TrophyIcon,
                items: [
                    "Winter Festival 2025 badge",
                    "100 server coins",
                    "Access to seasonal cosmetics shop"
                ]
            }
        ],

        faq: [
            {
                question: "How do I join a team?",
                answer: "Teams can be formed through the event NPC at spawn. You can create a team or join one that has open slots. Teams must have exactly 4 players to compete."
            },
            {
                question: "Are the challenges difficult?",
                answer: "Challenges vary in difficulty to accommodate all skill levels. Some are simple collection tasks while others require teamwork and strategy."
            },
            {
                question: "Can I change teams?",
                answer: "Teams are locked once the first challenge begins. Choose your teammates carefully!"
            },
            {
                question: "What if my teammate can't make it?",
                answer: "Teams can have 1-2 substitute players registered as backups. Contact staff if you need to make changes."
            }
        ],

        images: [
            { src: "/bg.png", alt: "Winter festival grounds" },
            { src: "/bg.png", alt: "Ice racing track" },
            { src: "/bg.png", alt: "Snow sculpture contest" }
        ]
    },

    {
        slug: "summer-survival",
        title: "Summer Survival Challenge",
        startTime: new Date("2024-08-15T12:00:00"),
        endTime: new Date("2024-08-20T23:59:59"),
        image: "/bg.png",
        description: "An epic 5-day survival challenge in a desert wasteland!",
        inWorld: false,
        teams: 0,

        about: [
            "Survive in a harsh desert environment with limited resources",
            "Deal with extreme heat and dangerous desert mobs",
            "Find hidden oases for water and resources",
            "Build your base to withstand sandstorms",
            "Lasted 5 days in the scorching wasteland"
        ],

        extraInfo: [
            {
                title: "The Desert Challenge",
                content: "This event tested players' survival skills in one of the harshest environments. With limited water sources and relentless heat, players had to be smart about resource management and base building."
            }
        ],

        stats: [
            { icon: MapPinIcon, label: "Biome", value: "Desert", color: "text-orange-500" },
            { icon: ClockIcon, label: "Duration", value: "5 Days", color: "text-green-500" },
            { icon: SkullIcon, label: "Difficulty", value: "Extreme", color: "text-red-500" }
        ],

        rewards: [
            {
                title: "Event Rewards",
                items: [
                    "Desert survivor badge",
                    "Sand castle building blocks",
                    "Cactus-themed cosmetics"
                ]
            }
        ],

        faq: [
            {
                question: "Is this event still active?",
                answer: "No, this event ended in August 2024. Check out our upcoming events for new challenges!"
            },
            {
                question: "Were there any winners?",
                answer: "Yes! 127 players successfully completed the full 5-day challenge and received exclusive rewards."
            }
        ]
    }
];
