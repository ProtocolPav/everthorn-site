import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card'
import { QuestStatisticsOut } from '@/api/nexuscore/model'
import { FunnelIcon } from '@phosphor-icons/react'
import { useState } from 'react'

interface FunnelCardProps {
    stats: QuestStatisticsOut
}

// ── Layout constants ────────────────────────────────────────────────────────
const W           = 400   // viewBox width
const STAGE_H     = 52    // height of each trapezoid
const GAP_H       = 18    // gap between stages (drop-off label lives here)
const PAD_X       = 12    // minimum half-width at narrowest point
const MAX_HALF_W  = W / 2 - 4  // half-width of the widest stage

const STAGES = [
    { key: 'accepts',   label: 'Accepted',  color: 'var(--chart-1)', textColor: 'hsl(217 91% 80%)' },
    { key: 'started',   label: 'Started',   color: 'var(--chart-2)', textColor: 'hsl(160 84% 80%)' },
    { key: 'completed', label: 'Completed', color: 'var(--chart-3)', textColor: 'hsl(142 71% 80%)' },
] as const

type StageKey = typeof STAGES[number]['key']

function rateColor(pct: number) {
    if (pct >= 60) return '#22c55e'
    if (pct >= 30) return '#f59e0b'
    return '#ef4444'
}

interface StageData {
    key: StageKey
    label: string
    color: string
    textColor: string
    value: number
    pctOfTop: number   // 0-100, relative to accepts
    halfW: number      // half-width of this stage's top edge
    nextHalfW: number  // half-width of this stage's bottom edge (= next stage top)
    y: number          // top Y of this trapezoid
    dropPct: number    // % that dropped off before next stage (0 for last)
}

export function FunnelCard({ stats }: FunnelCardProps) {
    const [hovered, setHovered] = useState<StageKey | null>(null)

    const values: Record<StageKey, number> = {
        accepts:   stats.total_accepts,
        started:   stats.total_started,
        completed: stats.total_completed,
    }
    const top = Math.max(values.accepts, 1)

    // Build per-stage geometry
    const stageData: StageData[] = STAGES.map((s, i) => {
        const value     = values[s.key]
        const pctOfTop  = (value / top) * 100
        const halfW     = PAD_X + (pctOfTop / 100) * (MAX_HALF_W - PAD_X)
        const nextVal   = i < STAGES.length - 1 ? values[STAGES[i + 1].key] : value
        const nextHalfW = PAD_X + ((nextVal / top) * 100 / 100) * (MAX_HALF_W - PAD_X)
        const dropPct   = i < STAGES.length - 1
            ? ((value - nextVal) / top) * 100
            : 0
        const y = i * (STAGE_H + GAP_H)
        return { ...s, value, pctOfTop, halfW, nextHalfW, y, dropPct }
    })

    const totalH = STAGES.length * STAGE_H + (STAGES.length - 1) * GAP_H
    const cx     = W / 2

    // Failed pill at bottom (only if > 0)
    const failedPct = stats.total_failed > 0
        ? (stats.total_failed / top) * 100
        : 0

    return (
        <Card className="shadow-sm">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                    <FunnelIcon className="h-4 w-4 text-muted-foreground" />
                    Player Funnel
                </CardTitle>
                <CardDescription>
                    {stats.total_accepts.toLocaleString()} accepted — how far players progress
                </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
                <svg
                    viewBox={`0 0 ${W} ${totalH + (stats.total_failed > 0 ? 30 : 0)}`}
                    className="w-full"
                    style={{ height: totalH + (stats.total_failed > 0 ? 30 : 0) }}
                    overflow="visible"
                >
                    {stageData.map((s) => {
                        const isHov = hovered === s.key
                        // Trapezoid: top edge centred, bottom edge narrower
                        const topL  = cx - s.halfW
                        const topR  = cx + s.halfW
                        const botL  = cx - s.nextHalfW
                        const botR  = cx + s.nextHalfW
                        const path  = `M${topL},${s.y} L${topR},${s.y} L${botR},${s.y + STAGE_H} L${botL},${s.y + STAGE_H} Z`
                        const midY  = s.y + STAGE_H / 2

                        return (
                            <g key={s.key}>
                                {/* Trapezoid */}
                                <path
                                    d={path}
                                    fill={s.color}
                                    opacity={isHov ? 1 : 0.82}
                                    style={{ transition: 'opacity 0.15s' }}
                                    onMouseEnter={() => setHovered(s.key)}
                                    onMouseLeave={() => setHovered(null)}
                                    style={{ cursor: 'default', transition: 'opacity 0.15s' }}
                                />

                                {/* Stage label (left of funnel) */}
                                <text
                                    x={topL - 8}
                                    y={midY + 4}
                                    textAnchor="end"
                                    fontSize={11}
                                    fontWeight={600}
                                    fill="hsl(var(--foreground))"
                                >
                                    {s.label}
                                </text>

                                {/* Count + % inside the trapezoid */}
                                <text
                                    x={cx}
                                    y={midY - 4}
                                    textAnchor="middle"
                                    fontSize={13}
                                    fontWeight={700}
                                    fill="#fff"
                                    style={{ pointerEvents: 'none' }}
                                >
                                    {s.value.toLocaleString()}
                                </text>
                                {s.key !== 'accepts' && (
                                    <text
                                        x={cx}
                                        y={midY + 11}
                                        textAnchor="middle"
                                        fontSize={10}
                                        fontWeight={500}
                                        fill="rgba(255,255,255,0.75)"
                                        style={{ pointerEvents: 'none' }}
                                    >
                                        {s.pctOfTop.toFixed(1)}% of accepted
                                    </text>
                                )}

                                {/* Drop-off annotation in the gap below this stage */}
                                {s.dropPct > 0.5 && (
                                    <text
                                        x={cx}
                                        y={s.y + STAGE_H + GAP_H / 2 + 4}
                                        textAnchor="middle"
                                        fontSize={9.5}
                                        fill="hsl(var(--muted-foreground))"
                                    >
                                        ▼ {s.dropPct.toFixed(1)}% dropped off
                                    </text>
                                )}

                                {/* Hover: rate pill on the right */}
                                {isHov && s.key !== 'accepts' && (
                                    <g>
                                        <rect
                                            x={topR + 8} y={midY - 11}
                                            width={58} height={22}
                                            rx={11}
                                            fill={rateColor(s.pctOfTop)}
                                            fillOpacity={0.15}
                                            stroke={rateColor(s.pctOfTop)}
                                            strokeWidth={0.8}
                                            strokeOpacity={0.6}
                                        />
                                        <text
                                            x={topR + 37} y={midY + 4}
                                            textAnchor="middle"
                                            fontSize={11}
                                            fontWeight={700}
                                            fill={rateColor(s.pctOfTop)}
                                        >
                                            {s.pctOfTop.toFixed(1)}%
                                        </text>
                                    </g>
                                )}
                            </g>
                        )
                    })}

                    {/* Failed pill — only if non-zero */}
                    {stats.total_failed > 0 && (
                        <g>
                            <rect
                                x={cx - 72} y={totalH + 6}
                                width={144} height={20}
                                rx={10}
                                fill="hsl(var(--destructive))"
                                fillOpacity={0.1}
                                stroke="hsl(var(--destructive))"
                                strokeWidth={0.8}
                                strokeOpacity={0.4}
                            />
                            <text
                                x={cx} y={totalH + 20}
                                textAnchor="middle"
                                fontSize={10}
                                fontWeight={600}
                                fill="hsl(var(--destructive))"
                            >
                                {stats.total_failed.toLocaleString()} failed · {failedPct.toFixed(1)}%
                            </text>
                        </g>
                    )}
                </svg>

                {/* Summary strip */}
                <div className="mt-3 grid grid-cols-2 gap-2 border-t border-border/40 pt-3">
                    <div className="flex items-center justify-between rounded-md bg-muted/30 px-2.5 py-1.5">
                        <span className="text-[11px] text-muted-foreground">Start rate</span>
                        <span
                            className="text-[12px] font-bold tabular-nums"
                            style={{ color: rateColor((stats.started_rate ?? 0) * 100) }}
                        >
                            {((stats.started_rate ?? 0) * 100).toFixed(1)}%
                        </span>
                    </div>
                    <div className="flex items-center justify-between rounded-md bg-muted/30 px-2.5 py-1.5">
                        <span className="text-[11px] text-muted-foreground">Completion rate</span>
                        <span
                            className="text-[12px] font-bold tabular-nums"
                            style={{ color: rateColor((stats.completion_rate ?? 0) * 100) }}
                        >
                            {((stats.completion_rate ?? 0) * 100).toFixed(1)}%
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
