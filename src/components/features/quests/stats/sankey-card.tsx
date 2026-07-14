/**
 * SankeyCard — hand-rolled SVG Sankey diagram.
 * Nodes: Accepted → { Started, Never Started }
 *        Started  → { Completed, Failed, In Progress }
 * No external Sankey library needed — positions are computed manually
 * given the fixed node layout.
 */
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card'
import { QuestStatisticsOut } from '@/api/nexuscore/model'
import { TreeStructureIcon } from '@phosphor-icons/react'
import { useState } from 'react'

interface SankeyCardProps {
    stats: QuestStatisticsOut
}

const W = 600
const H = 260
const NODE_W = 14
const COL1_X = 40
const COL2_X = 240
const COL3_X = W - COL1_X - NODE_W

// Colours
const C_ACCEPT      = 'var(--chart-1)'
const C_STARTED     = 'var(--chart-2)'
const C_COMPLETED   = 'var(--chart-3)'
const C_FAILED      = 'hsl(var(--destructive))'
const C_IDLE        = 'hsl(var(--muted-foreground))'
const C_IN_PROGRESS = 'hsl(var(--muted-foreground))'

function cubicLink(
    x1: number, y1: number, h1: number,
    x2: number, y2: number, h2: number,
    color: string,
    opacity = 0.35,
) {
    const mx = (x1 + x2) / 2
    const top    = `M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`
    const bottom = `L${x2},${y2 + h2} C${mx},${y2 + h2} ${mx},${y1 + h1} ${x1},${y1 + h1} Z`
    return (
        <path
            d={top + bottom}
            fill={color}
            fillOpacity={opacity}
            stroke="none"
        />
    )
}

export function SankeyCard({ stats }: SankeyCardProps) {
    const accepts     = stats.total_accepts
    const started     = stats.total_started
    const completed   = stats.total_completed
    const failed      = stats.total_failed
    const neverStarted = Math.max(0, accepts - started)
    const inProgress  = Math.max(0, started - completed - failed)

    const [hovered, setHovered] = useState<string | null>(null)

    if (accepts === 0) {
        return (
            <Card className="shadow-sm">
                <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                        <TreeStructureIcon className="h-4 w-4 text-muted-foreground" />
                        Flow Breakdown
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
                        No data yet
                    </div>
                </CardContent>
            </Card>
        )
    }

    // Node heights are proportional to their value, mapped into usable SVG height
    const usableH = H - 40  // top/bottom padding
    const scale = (v: number) => (v / accepts) * usableH

    // Column 1: single node — Accepted
    const n_accepted = { x: COL1_X, y: 20, h: scale(accepts), color: C_ACCEPT, label: 'Accepted', value: accepts }

    // Column 2: Started + Never Started (gap between them)
    const h_started     = scale(started)
    const h_neverStart  = scale(neverStarted)
    const gap2 = neverStarted > 0 ? 8 : 0
    const totalCol2 = h_started + h_neverStart + gap2
    const col2Top = n_accepted.y + (scale(accepts) - totalCol2) / 2

    const n_started      = { x: COL2_X, y: col2Top,                         h: h_started,    color: C_STARTED,     label: 'Started',       value: started }
    const n_neverStarted = { x: COL2_X, y: col2Top + h_started + gap2,      h: h_neverStart, color: C_IDLE,         label: 'Never Started', value: neverStarted }

    // Column 3: Completed + Failed + In Progress
    const h_completed   = scale(completed)
    const h_failed      = scale(Math.max(0, failed))
    const h_inProgress  = scale(inProgress)
    const gap3a = completed > 0 && failed > 0     ? 6 : 0
    const gap3b = (completed > 0 || failed > 0) && inProgress > 0 ? 6 : 0
    const totalCol3 = h_completed + h_failed + h_inProgress + gap3a + gap3b
    const col3Top = n_started.y + (h_started - totalCol3) / 2

    const n_completed  = { x: COL3_X, y: col3Top,                                           h: h_completed,  color: C_COMPLETED,   label: 'Completed',   value: completed }
    const n_failed     = { x: COL3_X, y: col3Top + h_completed + gap3a,                     h: h_failed,     color: C_FAILED,      label: 'Failed',      value: failed }
    const n_inProgress = { x: COL3_X, y: col3Top + h_completed + gap3a + h_failed + gap3b,  h: h_inProgress, color: C_IN_PROGRESS, label: 'In Progress', value: inProgress }

    const pct = (v: number) => accepts > 0 ? `${((v / accepts) * 100).toFixed(1)}%` : '0%'

    function NodeRect({ n, id }: { n: typeof n_accepted; id: string }) {
        const isHovered = hovered === id
        return (
            <g
                onMouseEnter={() => setHovered(id)}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: 'default' }}
            >
                <rect
                    x={n.x} y={n.y} width={NODE_W} height={Math.max(n.h, 2)}
                    rx={4}
                    fill={n.color}
                    opacity={isHovered ? 1 : 0.85}
                />
                {isHovered && (
                    <g>
                        <rect
                            x={n.x > W / 2 ? n.x - 110 : n.x + NODE_W + 6}
                            y={n.y + Math.max(n.h, 2) / 2 - 22}
                            width={104} height={44}
                            rx={6}
                            fill="hsl(var(--card))"
                            stroke="hsl(var(--border))"
                            strokeWidth={1}
                        />
                        <text
                            x={n.x > W / 2 ? n.x - 58 : n.x + NODE_W + 58}
                            y={n.y + Math.max(n.h, 2) / 2 - 6}
                            textAnchor="middle"
                            fontSize={10}
                            fontWeight={600}
                            fill="hsl(var(--foreground))"
                        >
                            {n.label}
                        </text>
                        <text
                            x={n.x > W / 2 ? n.x - 58 : n.x + NODE_W + 58}
                            y={n.y + Math.max(n.h, 2) / 2 + 10}
                            textAnchor="middle"
                            fontSize={11}
                            fontWeight={700}
                            fill="hsl(var(--foreground))"
                        >
                            {n.value.toLocaleString()} ({pct(n.value)})
                        </text>
                    </g>
                )}
            </g>
        )
    }

    // Static labels outside the nodes
    function NodeLabel({ n, align }: { n: typeof n_accepted; align: 'left' | 'right' }) {
        if (n.h < 10) return null
        const x = align === 'left' ? n.x - 6 : n.x + NODE_W + 6
        const anchor = align === 'left' ? 'end' : 'start'
        const midY = n.y + Math.max(n.h, 2) / 2
        return (
            <>
                <text x={x} y={midY - 5}  textAnchor={anchor} fontSize={10} fill="hsl(var(--foreground))" fontWeight={600}>{n.label}</text>
                <text x={x} y={midY + 7}  textAnchor={anchor} fontSize={10} fill="hsl(var(--muted-foreground))">
                    {n.value.toLocaleString()} · {pct(n.value)}
                </text>
            </>
        )
    }

    return (
        <Card className="shadow-sm">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                    <TreeStructureIcon className="h-4 w-4 text-muted-foreground" />
                    Flow Breakdown
                    <span className="ml-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-600 dark:text-amber-400">Experimental</span>
                </CardTitle>
                <CardDescription>How players move through the quest — hover nodes for detail</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
                <svg
                    viewBox={`0 0 ${W} ${H}`}
                    className="w-full"
                    style={{ height: 260, overflow: 'visible' }}
                >
                    {/* Links col1 → col2 */}
                    {started > 0 && cubicLink(
                        n_accepted.x + NODE_W, n_accepted.y,
                        n_started.x,           n_started.y,
                        scale(started), scale(started), C_STARTED,
                    )}
                    {neverStarted > 0 && cubicLink(
                        n_accepted.x + NODE_W, n_accepted.y + scale(started),
                        n_neverStarted.x,      n_neverStarted.y,
                        scale(neverStarted), scale(neverStarted), C_IDLE,
                    )}

                    {/* Links col2 → col3 */}
                    {completed > 0 && cubicLink(
                        n_started.x + NODE_W, n_started.y,
                        n_completed.x,        n_completed.y,
                        scale(completed), scale(completed), C_COMPLETED,
                    )}
                    {failed > 0 && cubicLink(
                        n_started.x + NODE_W, n_started.y + scale(completed),
                        n_failed.x,           n_failed.y,
                        scale(failed), scale(failed), C_FAILED,
                    )}
                    {inProgress > 0 && cubicLink(
                        n_started.x + NODE_W, n_started.y + scale(completed) + scale(failed),
                        n_inProgress.x,       n_inProgress.y,
                        scale(inProgress), scale(inProgress), C_IN_PROGRESS,
                    )}

                    {/* Node rects */}
                    <NodeRect n={n_accepted}     id="accepted" />
                    <NodeRect n={n_started}      id="started" />
                    {neverStarted > 0 && <NodeRect n={n_neverStarted} id="never" />}
                    {completed   > 0 && <NodeRect n={n_completed}    id="completed" />}
                    {failed      > 0 && <NodeRect n={n_failed}       id="failed" />}
                    {inProgress  > 0 && <NodeRect n={n_inProgress}   id="inprogress" />}

                    {/* Labels */}
                    <NodeLabel n={n_accepted}     align="left" />
                    <NodeLabel n={n_started}      align="left" />
                    {neverStarted > 0 && <NodeLabel n={n_neverStarted} align="left" />}
                    {completed   > 0 && <NodeLabel n={n_completed}    align="right" />}
                    {failed      > 0 && <NodeLabel n={n_failed}       align="right" />}
                    {inProgress  > 0 && <NodeLabel n={n_inProgress}   align="right" />}
                </svg>
            </CardContent>
        </Card>
    )
}
