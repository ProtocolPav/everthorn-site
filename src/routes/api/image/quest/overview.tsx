import { createFileRoute } from '@tanstack/react-router'
import type { QuestOut } from '@/api/nexuscore/model'

export const Route = createFileRoute('/api/image/quest/overview')({
    server: {
        handlers: {
            GET: ({ request }) => generateQuestOverviewImage(request),
        },
    },
})

// ─── Types ───────────────────────────────────────────────────────────────────

interface QuestImageInput {
    title: string
    quest_type: string
    tags: string[]
    end_time: string
    item_reward_count: number
    nug_reward: number | null
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseQuestParams(url: URL): QuestImageInput {
    return {
        title:            url.searchParams.get('title')            ?? 'Unknown Quest',
        quest_type:       url.searchParams.get('quest_type')       ?? 'Quest',
        tags:             url.searchParams.getAll('tags'),
        end_time:         url.searchParams.get('end_time')         ?? '',
        item_reward_count: Number(url.searchParams.get('item_reward_count') ?? '0'),
        nug_reward:       url.searchParams.has('nug_reward')
                            ? Number(url.searchParams.get('nug_reward'))
                            : null,
    }
}

function formatExpiry(endTimeIso: string): string {
    if (!endTimeIso) return 'No expiry'
    const end  = new Date(endTimeIso)
    const now  = new Date()
    const diff = end.getTime() - now.getTime()
    if (diff <= 0) return 'Expired'

    const days   = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours  = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const months = Math.floor(days / 30)

    if (months >= 1) return `Expires in ${months} month${months !== 1 ? 's' : ''}`
    if (days >= 1)   return `Expires in ${days} day${days !== 1 ? 's' : ''}`
    return `Expires in ${hours} hour${hours !== 1 ? 's' : ''}`
}

// ─── SVG Card Renderer ────────────────────────────────────────────────────────

/**
 * Renders the quest overview card as an SVG string.
 * Dimensions: 900 × 220 px (roughly 4:1).
 */
function buildSvg(quest: QuestImageInput): string {
    const W = 900
    const H = 220
    const PAD = 24
    const RADIUS = 14

    const expiryText = formatExpiry(quest.end_time)

    // Truncate long titles to prevent overflow
    const title = quest.title.length > 48
        ? quest.title.slice(0, 46) + '…'
        : quest.title

    // Tag pill dimensions
    const TAG_H    = 22
    const TAG_PAD  = 10
    const TAG_GAP  = 6
    // Estimate character width at font-size 12 ≈ 7px each
    const charWidth = 7
    let tagX = PAD
    const tagPills: { x: number; w: number; label: string }[] = []
    const maxTagX = W * 0.72 // keep tags in left zone

    for (const tag of quest.tags) {
        const w = tag.length * charWidth + TAG_PAD * 2
        if (tagX + w > maxTagX) break
        tagPills.push({ x: tagX, w, label: tag })
        tagX += w + TAG_GAP
    }

    // Rewards pill
    const rewardParts: string[] = []
    if (quest.item_reward_count > 0)
        rewardParts.push(`+${quest.item_reward_count} Item Reward${quest.item_reward_count !== 1 ? 's' : ''}`)
    if (quest.nug_reward && quest.nug_reward > 0)
        rewardParts.push(`+${quest.nug_reward} Nugs`)
    const rewardText = rewardParts.length > 0 ? rewardParts.join('  ·  ') : 'No Rewards'

    const tagPillsSvg = tagPills
        .map(
            ({ x, w, label }) => `
        <rect x="${x}" y="140" width="${w}" height="${TAG_H}" rx="11" fill="#374151"/>
        <text x="${x + TAG_PAD}" y="${140 + TAG_H / 2 + 4}" font-family="Inter, sans-serif" font-size="12" fill="#9CA3AF">${escapeXml(label)}</text>
    `,
        )
        .join('')

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%"   stop-color="#111827"/>
      <stop offset="100%" stop-color="#1F2937"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%"   stop-color="#7C3AED"/>
      <stop offset="100%" stop-color="#4F46E5"/>
    </linearGradient>
  </defs>

  <!-- Card background -->
  <rect width="${W}" height="${H}" rx="${RADIUS}" fill="url(#bg)"/>

  <!-- Left accent bar -->
  <rect x="0" y="${RADIUS}" width="4" height="${H - RADIUS * 2}" rx="2" fill="url(#accent)"/>

  <!-- Quest type badge -->
  <rect x="${PAD}" y="${PAD}" width="${quest.quest_type.length * 8 + 24}" height="26" rx="13" fill="#1E1B4B"/>
  <text
    x="${PAD + 12}" y="${PAD + 17}"
    font-family="Inter, sans-serif" font-size="13" font-weight="600"
    fill="#A78BFA" letter-spacing="0.5"
  >${escapeXml(quest.quest_type.toUpperCase())}</text>

  <!-- Title -->
  <text
    x="${PAD}" y="98"
    font-family="Inter, sans-serif" font-size="26" font-weight="700"
    fill="#F9FAFB"
  >${escapeXml(title)}</text>

  <!-- Tag pills row -->
  ${tagPillsSvg}

  <!-- Divider -->
  <line x1="${PAD}" y1="180" x2="${W - PAD}" y2="180" stroke="#374151" stroke-width="1"/>

  <!-- Rewards (left of footer) -->
  <text
    x="${PAD}" y="200"
    font-family="Inter, sans-serif" font-size="13" fill="#D1FAE5"
  >💎 ${escapeXml(rewardText)}</text>

  <!-- Expiry (right of footer) -->
  <text
    x="${W - PAD}" y="200"
    font-family="Inter, sans-serif" font-size="13" fill="#6B7280"
    text-anchor="end"
  >⏳ ${escapeXml(expiryText)}</text>
</svg>`
}

function escapeXml(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;')
}

// ─── PNG Conversion ───────────────────────────────────────────────────────────

async function svgToPng(svg: string): Promise<Uint8Array> {
    // Dynamically import @resvg/resvg-js — must be installed as a dependency.
    // Run: bun add @resvg/resvg-js
    const { Resvg } = await import('@resvg/resvg-js')
    const resvg = new Resvg(svg, {
        fitTo: { mode: 'width', value: 900 },
    })
    return resvg.render().asPng()
}

// ─── Handler ──────────────────────────────────────────────────────────────────

async function generateQuestOverviewImage(request: Request): Promise<Response> {
    const url    = new URL(request.url)
    const quest  = parseQuestParams(url)
    const svg    = buildSvg(quest)

    try {
        const png = await svgToPng(svg)
        return new Response(png, {
            status: 200,
            headers: {
                'Content-Type':  'image/png',
                'Cache-Control': 'public, max-age=300',
            },
        })
    } catch {
        // Fallback: return the SVG if resvg-js is not yet installed
        return new Response(svg, {
            status: 200,
            headers: { 'Content-Type': 'image/svg+xml' },
        })
    }
}
