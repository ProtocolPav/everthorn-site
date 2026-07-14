/**
 * SankeyCard — hand-rolled SVG Sankey diagram.
 * Nodes: Accepted → { Started, Never Started }
 *        Started  → { Completed, Failed, In Progress }
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

const W      = 560
const H      = 280
const NODE_W = 12
const PAD_Y  = 24
const COL1_X = 80     // enough room for left labels
const COL2_X = 260
const COL3_X = W - 80 - NODE_W   // mirror of col1

const C_ACCEPT      = 'var(--chart-1)'
const C_STARTED     = 'var(--chart-2)'
const C_COMPLETED   = 'var(--chart-3)'
const C_FAILED      = 'hsl(var(--destructive))'
const C_NEVER       = 'hsl(var(--muted-foreground))'
const C_IN_PROGRESS = 'var(--chart-4)'

interface NodeDef {
    x: number
    y: number
    h: number
    color: string
    label: string
    value: number
}

/**
 * Draws a filled ribbon between two vertical bars.
 * (srcX, srcY, srcH) = right edge of source node
 * (dstX, dstY, dstH) = left edge of destination node
 */
function SankeyLink({
    srcX, srcY, srcH,
    dstX, dstY, dstH,
    color,
    opacity = 0.3,
}: {
    srcX: number; srcY: number; srcH: number
    dstX: number; dstY: number; dstH: number
    color: string
    opacity?: number
}) {
    if (srcH <= 0 || dstH <= 0) return null
    const mx = (srcX + dstX) / 2
    const d = [
        `M ${srcX} ${srcY}`,
        `C ${mx} ${srcY}, ${mx} ${dstY}, ${dstX} ${dstY}`,
        `L ${dstX} ${dstY + dstH}`,
        `C ${mx} ${dstY + dstH}, ${mx} ${srcY + srcH}, ${srcX} ${srcY + srcH}`,
        'Z',
    ].join(' ')
    return <path d={d} fill={color} fillOpacity={opacity} stroke="none" />
}

/** Hoverable node rectangle */
function SankeyNode({
    node,
    id,
    hovered,
    onEnter,
    onLeave,
    pct,
}: {
    node: NodeDef
    id: string
    hovered: string | null
    onEnter: (id: string) => void
    onLeave: () => void
    pct: (v: number) => string
}) {
    const isHovered = hovered === id
    const h = Math.max(node.h, 3)
    const midY = node.y + h / 2

    // Tooltip goes right for col1/col2, left for col3
    const tipRight = node.x < W * 0.6
    const tipX = tipRight ? node.x + NODE_W + 8 : node.x - 8 - 116
    const tipY = midY - 24

    return (
        <g
            onMouseEnter={() => onEnter(id)}
            onMouseLeave={onLeave}
            style={{ cursor: 'default' }}
        >
            <rect
                x={node.x} y={node.y}
                width={NODE_W} height={h}
                rx={3}
                fill={node.color}
                opacity={isHovered ? 1 : 0.8}
            />
            {isHovered && (
                <g>
                    <rect
                        x={tipX} y={tipY}
                        width={116} height={48}
                        rx={6}
                        fill="hsl(var(--card))"
                        stroke="hsl(var(--border))"
                        strokeWidth={0.8}
                    />
                    <text x={tipX + 58} y={tipY + 15} textAnchor="middle" fontSize={10} fontWeight={600} fill="hsl(var(--foreground))">
                        {node.label}
                    </text>
                    <text x={tipX + 58} y={tipY + 30} textAnchor="middle" fontSize={11} fontWeight={700} fill="hsl(var(--foreground))">
                        {node.value.toLocaleString()}
                    </text>
                    <text x={tipX + 58} y={tipY + 43} textAnchor="middle" fontSize={9} fill="hsl(var(--muted-foreground))">
                        {pct(node.value)} of accepted
                    </text>
                </g>
            )}
        </g>
    )
}

/** Static text label for a node */
function SankeyLabel({ node, align }: { node: NodeDef; align: 'left' | 'right' }) {
    const h = Math.max(node.h, 3)
    if (h < 12) return null
    const midY = node.y + h / 2
    const x = align === 'left' ? node.x - 6 : node.x + NODE_W + 6
    const anchor = align === 'left' ? 'end' : 'start'
    return (
        <g>
            <text x={x} y={midY - 4} textAnchor={anchor} fontSize={10} fontWeight={600} fill="hsl(var(--foreground))">
                {node.label}
            </text>
            <text x={x} y={midY + 8} textAnchor={anchor} fontSize={9} fill="hsl(var(--muted-foreground))">
                {node.value.toLocaleString()}
            </text>
        </g>
    )
}

export function SankeyCard({ stats }: SankeyCardProps) {
    const accepts      = stats.total_accepts
    const started      = stats.total_started
    const completed    = stats.total_completed
    const failed       = stats.total_failed
    const neverStarted = Math.max(0, accepts - started)
    const inProgress   = Math.max(0, started - completed - failed)

    const [hovered, setHovered] = useState<string | null>(null)

    if (accepts === 0) {
        return (
            <Card className="shadow-sm">
                <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                        <TreeStructureIcon className="h-4 w-4 text-muted-foreground" />
                        Flow Breakdown
                        <span className="ml-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-600 dark:text-amber-400">Experimental</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">No data yet</div>
                </CardContent>
            </Card>
        )
    }

    const usableH = H - PAD_Y * 2
    const scale = (v: number) => Math.max(0, (v / accepts) * usableH)
    const pct = (v: number) => `${((v / accepts) * 100).toFixed(1)}%`

    // ── Column 1 ────────────────────────────────────────────────
    const nAccepted: NodeDef = {
        x: COL1_X, y: PAD_Y,
        h: scale(accepts),
        color: C_ACCEPT, label: 'Accepted', value: accepts,
    }

    // ── Column 2 ────────────────────────────────────────────────
    const hStarted    = scale(started)
    const hNever      = scale(neverStarted)
    const gap2        = neverStarted > 0 ? 6 : 0
    const col2Total   = hStarted + hNever + gap2
    const col2Top     = PAD_Y + (scale(accepts) - col2Total) / 2

    const nStarted: NodeDef = {
        x: COL2_X, y: col2Top,
        h: hStarted,
        color: C_STARTED, label: 'Started', value: started,
    }
    const nNever: NodeDef = {
        x: COL2_X, y: col2Top + hStarted + gap2,
        h: hNever,
        color: C_NEVER, label: 'Never Started', value: neverStarted,
    }

    // ── Column 3 ────────────────────────────────────────────────
    const hCompleted  = scale(completed)
    const hFailed     = scale(failed)
    const hInProgress = scale(inProgress)
    const gap3a       = completed > 0 && failed > 0                      ? 5 : 0
    const gap3b       = (completed > 0 || failed > 0) && inProgress > 0  ? 5 : 0
    const col3Total   = hCompleted + hFailed + hInProgress + gap3a + gap3b
    const col3Top     = nStarted.y + (hStarted - col3Total) / 2

    const nCompleted: NodeDef = {
        x: COL3_X, y: col3Top,
        h: hCompleted,
        color: C_COMPLETED, label: 'Completed', value: completed,
    }
    const nFailed: NodeDef = {
        x: COL3_X, y: col3Top + hCompleted + gap3a,
        h: hFailed,
        color: C_FAILED, label: 'Failed', value: failed,
    }
    const nInProgress: NodeDef = {
        x: COL3_X, y: col3Top + hCompleted + gap3a + hFailed + gap3b,
        h: hInProgress,
        color: C_IN_PROGRESS, label: 'In Progress', value: inProgress,
    }

    // Source offsets for links leaving col1 → col2
    // The source bar is split: top slice goes to Started, bottom to Never Started
    const srcY_toStarted = nAccepted.y
    const srcY_toNever   = nAccepted.y + hStarted

    // Source offsets for links leaving col2 → col3
    const srcY_toCompleted  = nStarted.y
    const srcY_toFailed     = nStarted.y + hCompleted
    const srcY_toInProgress = nStarted.y + hCompleted + hFailed

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
            <CardContent className="pt-0 pb-2">
                <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: H }}>

                    {/* ── Links col1 → col2 ── */}
                    <SankeyLink
                        srcX={nAccepted.x + NODE_W} srcY={srcY_toStarted} srcH={hStarted}
                        dstX={nStarted.x}           dstY={nStarted.y}     dstH={hStarted}
                        color={C_STARTED}
                    />
                    {neverStarted > 0 && (
                        <SankeyLink
                            srcX={nAccepted.x + NODE_W} srcY={srcY_toNever}   srcH={hNever}
                            dstX={nNever.x}             dstY={nNever.y}       dstH={hNever}
                            color={C_NEVER}
                        />
                    )}

                    {/* ── Links col2 → col3 ── */}
                    {completed > 0 && (
                        <SankeyLink
                            srcX={nStarted.x + NODE_W} srcY={srcY_toCompleted}  srcH={hCompleted}
                            dstX={nCompleted.x}        dstY={nCompleted.y}      dstH={hCompleted}
                            color={C_COMPLETED}
                        />
                    )}
                    {failed > 0 && (
                        <SankeyLink
                            srcX={nStarted.x + NODE_W} srcY={srcY_toFailed}     srcH={hFailed}
                            dstX={nFailed.x}           dstY={nFailed.y}         dstH={hFailed}
                            color={C_FAILED}
                        />
                    )}
                    {inProgress > 0 && (
                        <SankeyLink
                            srcX={nStarted.x + NODE_W} srcY={srcY_toInProgress} srcH={hInProgress}
                            dstX={nInProgress.x}       dstY={nInProgress.y}     dstH={hInProgress}
                            color={C_IN_PROGRESS}
                        />
                    )}

                    {/* ── Labels (drawn before nodes so nodes sit on top) ── */}
                    <SankeyLabel node={nAccepted} align="left" />
                    <SankeyLabel node={nStarted}  align="right" />
                    {neverStarted > 0 && <SankeyLabel node={nNever}      align="right" />}
                    {completed   > 0 && <SankeyLabel node={nCompleted}  align="right" />}
                    {failed      > 0 && <SankeyLabel node={nFailed}     align="right" />}
                    {inProgress  > 0 && <SankeyLabel node={nInProgress} align="right" />}

                    {/* ── Nodes (on top of links + labels) ── */}
                    <SankeyNode node={nAccepted} id="accepted"   hovered={hovered} onEnter={setHovered} onLeave={() => setHovered(null)} pct={pct} />
                    <SankeyNode node={nStarted}  id="started"    hovered={hovered} onEnter={setHovered} onLeave={() => setHovered(null)} pct={pct} />
                    {neverStarted > 0 && <SankeyNode node={nNever}      id="never"      hovered={hovered} onEnter={setHovered} onLeave={() => setHovered(null)} pct={pct} />}
                    {completed   > 0 && <SankeyNode node={nCompleted}  id="completed"  hovered={hovered} onEnter={setHovered} onLeave={() => setHovered(null)} pct={pct} />}
                    {failed      > 0 && <SankeyNode node={nFailed}     id="failed"     hovered={hovered} onEnter={setHovered} onLeave={() => setHovered(null)} pct={pct} />}
                    {inProgress  > 0 && <SankeyNode node={nInProgress} id="inprogress" hovered={hovered} onEnter={setHovered} onLeave={() => setHovered(null)} pct={pct} />}

                </svg>
            </CardContent>
        </Card>
    )
}
