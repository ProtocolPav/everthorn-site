// src/routes/api/image/quest/overview.tsx
import { createFileRoute } from '@tanstack/react-router'
import { getQuestV1GuildsMeQuestsQuestIdGet } from '@/api/nexuscore/quests/quests'
import satori from 'satori'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import {formatDistanceToNowStrict, isPast } from "date-fns"

export const Route = createFileRoute('/api/image/quest/overview')({
    server: {
        handlers: {
            GET: ({ request }) => generateQuestOverviewImage(request),
        },
    },
})

async function generateQuestOverviewImage(request: Request) {
    const url = new URL(request.url)
    const questId = Number(url.searchParams.get('questId'))

    if (!Number.isFinite(questId)) {
        return new Response('Invalid questId', { status: 400 })
    }

    const quest = await getQuestV1GuildsMeQuestsQuestIdGet(questId, {
        headers: request.headers,
    })

    const texture = await readFile(join(process.cwd(), '.output/public/textures/book-quest-long.png'))
    const fontTen = await readFile(join(process.cwd(), '.output/public/fonts/minecraft-ten.woff'))
    const fontSeven = await readFile(join(process.cwd(), '.output/public/fonts/minecraft-seven.woff'))

    const textureSrc = `data:image/png;base64,${texture.toString('base64')}`

    const rewards = flattenRewards(quest)
    const expiry = formatExpiry(quest.end_time)

    // Capitalize the first letter of each word
    const formattedType = quest.quest_type
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ')

    // Prevent "Side Quest Quest" if the database already includes "Quest"
    const displayQuestType = formattedType.endsWith('Quest')
        ? formattedType
        : `${formattedType} Quest`

    const svg = await satori(
        <div
            style={{
                width: 765,
                height: 153,
                display: 'flex',
                position: 'relative',
                backgroundImage: `url(${textureSrc})`,
                backgroundSize: '100% 100%',
                padding: "31px 10px"
            }}
        >
            <div
                style={{
                    display: 'flex',
                    width: '100%',
                    height: '100%',
                    paddingLeft: 20,
                    paddingRight: 20,
                    flexDirection: 'row',
                    alignItems: 'stretch',
                    justifyContent: 'space-between',
                }}
            >
                {/* LEFT SIDE: Title, Description, Quest Type & Tags */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: 490,
                    justifyContent: 'space-between'
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <div
                            style={{
                                fontFamily: 'MinecraftTen',
                                fontSize: 36, // Bumped up for maximum legibility
                                color: '#111111', // Almost solid black
                                lineHeight: 1,
                            }}
                        >
                            {quest.title.length > 28 ? quest.title.substring(0, 26) + '...' : quest.title}
                        </div>

                        {/* New: Quest Description */}
                        {quest.description && (
                            <div
                                style={{
                                    display: 'flex',
                                    fontFamily: 'MinecraftSeven',
                                    fontSize: 18,
                                    color: '#444444', // Dark grey ink
                                }}
                            >
                                {quest.description.length > 55 ? quest.description.substring(0, 52) + '...' : quest.description}
                            </div>
                        )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        {/* Quest Type Pill - Bold, regal style to contrast with plain tags */}
                        <div style={{
                            display: 'flex',
                            backgroundColor: '#5e0b0b', // Deep crimson/red
                            border: '2px solid #2d0404', // Darker red border
                            color: '#f4d08f', // Gold text
                            padding: '4px 10px',
                            fontFamily: 'MinecraftSeven',
                            fontSize: 16,
                            borderRadius: 4,
                            boxShadow: '2px 2px 0px rgba(0,0,0,0.2)', // Slight drop shadow for pop
                            marginRight: 8,
                        }}>
                            {displayQuestType}
                        </div>

                        {/* Tags */}
                        {quest.tags.map((tag) => (
                            <div key={tag} style={{
                                display: 'flex',
                                border: '2px solid #555555',
                                color: '#333333',
                                padding: '2px 8px',
                                fontFamily: 'MinecraftSeven',
                                fontSize: 16,
                                borderRadius: 4,
                            }}>
                                {tag}
                            </div>
                        ))}
                    </div>
                </div>

                {/* RIGHT SIDE: Objectives, Rewards and Expiry */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: 210,
                        paddingRight: 10,
                        alignItems: 'flex-end',
                        justifyContent: 'space-between',
                        fontFamily: 'MinecraftSeven',
                        fontSize: 20, // Much larger metadata
                    }}
                >
                    {/* New: Objective Count */}
                    <div style={{ display: 'flex', alignItems: 'center', color: '#222222' }}>
                        <div style={{ display: 'flex' }}>
                            {quest.objectives?.length || 0} Objective{(quest.objectives?.length !== 1) ? 's' : ''}
                        </div>
                    </div>

                    {/* Item Rewards */}
                    {rewards.itemRewards > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', color: '#006600' }}> {/* Dark Green */}
                            <div style={{ display: 'flex' }}>+ {rewards.itemRewards} Item Reward{rewards.itemRewards !== 1 ? 's' : ''}</div>
                        </div>
                    )}

                    {/* Nug Rewards */}
                    {rewards.nugs > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', color: '#995500' }}> {/* Dark Gold/Brown */}
                            <div style={{ display: 'flex' }}>+ {rewards.nugs} Nugs</div>
                        </div>
                    )}

                    {/* Expiry */}
                    <div style={{ display: 'flex', alignItems: 'center', color: '#555555', fontSize: 18 }}>
                        <div style={{ display: 'flex' }}>{expiry}</div>
                    </div>
                </div>
            </div>
        </div>,
        {
            width: 765,
            height: 153,
            fonts: [
                { name: 'MinecraftTen', data: fontTen, weight: 400, style: 'normal' },
                { name: 'MinecraftSeven', data: fontSeven, weight: 400, style: 'normal' },
            ],
        },
    )

    const { Resvg } = await import('@resvg/resvg-js')
    const png = new Resvg(svg).render().asPng()

    // @ts-ignore
    return new Response(png, {
        headers: {
            'Content-Type': 'image/png',
            'Cache-Control': 'public, max-age=300',
        },
    })
}

function flattenRewards(quest: any) {
    const rewards = quest.objectives.flatMap((objective: any) => objective.rewards ?? [])
    const itemRewards = rewards.reduce((sum: number, reward: any) => {
        return sum + (reward.item ? 1 : 0)
    }, 0)
    const nugs = rewards.reduce((sum: number, reward: any) => sum + (reward.balance ?? 0), 0)
    return { itemRewards, nugs }
}

function formatExpiry(endTime: string) {
    if (!endTime) return 'No expiry'

    const end = new Date(endTime)

    if (isPast(end)) {
        return 'Expired'
    }

    // Returns strings like "Expires in 2 months", "Expires in 5 days", "Expires in 3 hours"
    return `Expires in ${formatDistanceToNowStrict(end)}`
}