import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card'
import { QuestStatisticsOut } from '@/api/nexuscore/model'
import { FunnelIcon } from '@phosphor-icons/react'
import { useState, useRef, useCallback } from 'react'

interface FunnelCardProps {
    stats: QuestStatisticsOut
}

const SVG_W     = 480
const LABEL_W   = 76
const STAT_W    = 90
const FUNNEL_L  = LABEL_W
const FUNNEL_R  = SVG_W - STAT_W
const FUNNEL_W  = FUNNEL_R - FUNNEL_L
const CX        = FUNNEL_L + FUNNEL_W / 2
const STAGE_H   = 60
const PAD_X     = 8

const STAGES = [
    { key: 'accepts',   label: 'Accepted',  color: 'var(--chart-1)' },
    { key: 'started',   label: 'Started',   color: 'var(--chart-2)' },
    { key: 'completed', label: 'Completed', color: 'var(--chart-3)' },
] as const

type StageKey = typeof STAGES[number]['key']

function rateColor(pct: number) {
    if (pct >= 60) return '#22c55e'
    if (pct >= 30) return '#f59e0b'
    return '#ef4444'
}

interface StageInfo {
    key: StageKey
    label: string
    color: string
    value: number
    pctOfTop: number
    pctOfPrev: number
    droppedAbs: number
    droppedPct: number
    topHalfW: number
    botHalfW: number
    y: number
}

export function FunnelCard({ stats }: FunnelCardProps) {
    const [hovered, setHovered]   = useState<StageKey | null>(null)
    const [tipPos, setTipPos]     = useState({ x: 0, y: 0 })
    const containerRef            = useRef<HTMLDivElement>(null)

    const vals: Record<StageKey, number> = {
        accepts:   stats.total_accepts,
        started:   stats.total_started,
        completed: stats.total_completed,
    }
    const top      = Math.max(vals.accepts, 1)
    const maxHalfW = FUNNEL_W / 2 - PAD_X
    const halfW    = (v: number) => PAD_X + (v / top) * maxHalfW

    const stages: StageInfo[] = STAGES.map((s, i) => {
        const value   = vals[s.key]
        const prevVal = i === 0 ? top : vals[STAGES[i - 1].key]
        const nextVal = i < STAGES.length - 1 ? vals[STAGES[i + 1].key] : value
        return {
            ...s,
            value,
            pctOfTop:   (value / top) * 100,
            pctOfPrev:  i === 0 ? 100 : (value / Math.max(prevVal, 1)) * 100,
            droppedAbs: Math.max(0, prevVal - value),
            droppedPct: i === 0 ? 0 : Math.max(0, ((prevVal - value) / Math.max(prevVal, 1)) * 100),
            topHalfW:   halfW(value),
            botHalfW:   halfW(nextVal),
            y:          i * STAGE_H,
        }
    })

    const totalH   = STAGES.length * STAGE_H
    const failedPct = (stats.total_failed / top) * 100
    const svgH     = totalH + (stats.total_failed > 0 ? 36 : 8)

    const hovStage = stages.find(s => s.key === hovered) ?? null

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!containerRef.current) return
        const rect = containerRef.current.getBoundingClientRect()
        setTipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    }, [])

    // Tooltip dimensions for offset clamping
    const TIP_W = 192
    const TIP_H = hovStage?.key === 'accepts' ? 72 : 118
    const OFFSET = 14

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

            <CardContent className="pt-0 pb-3">
                <div
                    ref={containerRef}
                    className="relative"
                    onMouseMove={handleMouseMove}
                >
                    {/* ── Floating tooltip ── */}
                    {hovStage && (
                        <div
                            className="pointer-events-none absolute z-20 rounded-lg border bg-card shadow-lg text-xs px-3 py-2.5"
                            style={{
                                width: TIP_W,
                                left: Math.min(
                                    tipPos.x + OFFSET,
                                    (containerRef.current?.offsetWidth ?? TIP_W) - TIP_W - 4,
                                ),
                                top: Math.max(
                                    tipPos.y - TIP_H - OFFSET,
                                    4,
                                ),
                            }}
                        >
                            <div className="flex items-center gap-1.5 mb-2">
                                <div className="h-2.5 w-2.5 rounded-sm shrink-0" style={{ background: hovStage.color }} />
                                <span className="font-semibold text-[13px]">{hovStage.label}</span>
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between gap-6">
                                    <span className="text-muted-foreground">Players</span>
                                    <span className="font-bold tabular-nums">{hovStage.value.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between gap-6">
                                    <span className="text-muted-foreground">% of accepted</span>
                                    <span className="font-semibold tabular-nums" style={{ color: rateColor(hovStage.pctOfTop) }}>
                                        {hovStage.pctOfTop.toFixed(1)}%
                                    </span>
                                </div>
                                {hovStage.key !== 'accepts' && (
                                    <>
                                        <div className="flex justify-between gap-6">
                                            <span className="text-muted-foreground">% of prev step</span>
                                            <span className="font-semibold tabular-nums" style={{ color: rateColor(hovStage.pctOfPrev) }}>
                                                {hovStage.pctOfPrev.toFixed(1)}%
                                            </span>
                                        </div>
                                        <div className="border-t border-border/40 pt-1 mt-1 flex justify-between gap-6">
                                            <span className="text-muted-foreground">Dropped off</span>
                                            <span className="font-semibold tabular-nums text-muted-foreground">
                                                −{hovStage.droppedAbs.toLocaleString()} ({hovStage.droppedPct.toFixed(1)}%)
                                            </span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    <svg
                        viewBox={`0 0 ${SVG_W} ${svgH}`}
                        className="w-full"
                        style={{ height: svgH }}
                    >
                        {stages.map((s, i) => {
                            const isHov  = hovered === s.key
                            const topL   = CX - s.topHalfW
                            const topR   = CX + s.topHalfW
                            const botL   = CX - s.botHalfW
                            const botR   = CX + s.botHalfW
                            const path   = `M${topL},${s.y} L${topR},${s.y} L${botR},${s.y + STAGE_H} L${botL},${s.y + STAGE_H} Z`
                            const midY   = s.y + STAGE_H / 2
                            const isLast = i === STAGES.length - 1

                            return (
                                <g key={s.key}>
                                    <path
                                        d={path}
                                        fill={s.color}
                                        opacity={isHov ? 1 : hovered ? 0.5 : 0.82}
                                        style={{ cursor: 'default', transition: 'opacity 0.12s' }}
                                        onMouseEnter={() => setHovered(s.key)}
                                        onMouseLeave={() => setHovered(null)}
                                    />

                                    {/* Left label */}
                                    <text
                                        x={LABEL_W - 6} y={midY + 4}
                                        textAnchor="end" fontSize={11}
                                        fontWeight={isHov ? 700 : 500}
                                        fill={isHov ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))'}
                                        style={{ transition: 'fill 0.12s', pointerEvents: 'none' }}
                                    >
                                        {s.label}
                                    </text>

                                    {/* Count */}
                                    <text
                                        x={CX} y={midY + (s.key === 'accepts' ? 5 : -3)}
                                        textAnchor="middle" fontSize={14} fontWeight={700}
                                        fill="#fff" style={{ pointerEvents: 'none' }}
                                    >
                                        {s.value.toLocaleString()}
                                    </text>

                                    {/* % of accepted */}
                                    {s.key !== 'accepts' && (
                                        <text
                                            x={CX} y={midY + 13}
                                            textAnchor="middle" fontSize={10}
                                            fill="rgba(255,255,255,0.7)"
                                            style={{ pointerEvents: 'none' }}
                                        >
                                            {s.pctOfTop.toFixed(1)}% of accepted
                                        </text>
                                    )}

                                    {/* Right column: step rate */}
                                    {s.key !== 'accepts' && (
                                        <>
                                            <text
                                                x={FUNNEL_R + 6} y={midY - 3}
                                                fontSize={12} fontWeight={700}
                                                fill={rateColor(s.pctOfPrev)}
                                            >
                                                {s.pctOfPrev.toFixed(1)}%
                                            </text>
                                            <text
                                                x={FUNNEL_R + 6} y={midY + 11}
                                                fontSize={9}
                                                fill="hsl(var(--muted-foreground))"
                                            >
                                                of prev step
                                            </text>
                                        </>
                                    )}

                                    {!isLast && (
                                        <line
                                            x1={FUNNEL_R + STAT_W / 2 - 4} y1={s.y + STAGE_H}
                                            x2={FUNNEL_R + STAT_W / 2 - 4} y2={s.y + STAGE_H * 1.25}
                                            stroke="hsl(var(--border))" strokeWidth={1} strokeDasharray="2 2"
                                        />
                                    )}
                                </g>
                            )
                        })}

                        {stats.total_failed > 0 && (
                            <g>
                                <rect
                                    x={CX - 80} y={totalH + 8}
                                    width={160} height={22} rx={11}
                                    fill="hsl(var(--destructive))" fillOpacity={0.12}
                                    stroke="hsl(var(--destructive))" strokeWidth={0.8} strokeOpacity={0.5}
                                />
                                <text
                                    x={CX} y={totalH + 23}
                                    textAnchor="middle" fontSize={10} fontWeight={600}
                                    fill="hsl(var(--destructive))"
                                >
                                    {stats.total_failed.toLocaleString()} failed · {failedPct.toFixed(1)}% of accepted
                                </text>
                            </g>
                        )}
                    </svg>
                </div>

                {/* Summary strip */}
                <div className="mt-2 grid grid-cols-3 gap-2 border-t border-border/40 pt-3">
                    {([
                        { label: 'Start rate',       pct: (stats.started_rate ?? 0) * 100,    count: stats.total_started },
                        { label: 'Completion rate',  pct: (stats.completion_rate ?? 0) * 100, count: stats.total_completed },
                        { label: 'Drop-off',         pct: 100 - (stats.completion_rate ?? 0) * 100, count: stats.total_accepts - stats.total_completed, invert: true },
                    ] as const).map(({ label, pct, count }) => (
                        <div key={label} className="flex flex-col items-center gap-0.5 rounded-md bg-muted/30 px-2 py-1.5">
                            <span className="text-[10px] text-muted-foreground">{label}</span>
                            <span className="text-[13px] font-bold tabular-nums" style={{ color: rateColor(pct) }}>
                                {pct.toFixed(1)}%
                            </span>
                            <span className="text-[10px] text-muted-foreground tabular-nums">{count.toLocaleString()} players</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
