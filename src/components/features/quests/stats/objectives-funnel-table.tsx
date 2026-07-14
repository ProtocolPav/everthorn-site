import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { ObjectiveStatistics } from '@/api/nexuscore/model'
import { formatDuration } from '@/lib/format'
import { cn } from '@/lib/utils'
import { CrosshairIcon, ArrowDownIcon } from '@phosphor-icons/react'

interface ObjectivesFunnelTableProps {
    objectives: ObjectiveStatistics[]
}

function PctBadge({ value, invert = false }: { value: number; invert?: boolean }) {
    const pct = (value * 100).toFixed(1)
    const isGood = invert ? value <= 0.2 : value >= 0.6
    const isMid  = invert ? value <= 0.4 : value >= 0.3
    return (
        <span
            className={cn(
                'inline-flex items-center rounded-full px-1.5 py-0.5 text-[11px] font-semibold tabular-nums',
                isGood ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                       : isMid ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                                : 'bg-red-500/10 text-red-500',
            )}
        >
            {pct}%
        </span>
    )
}

/**
 * Inline proportion bar: three segments — completed (emerald), failed (red), remaining (muted).
 * Uses the pre-computed completion_rate and drop_rate fields directly.
 */
function ObjectiveMiniBar({ obj }: { obj: ObjectiveStatistics }) {
    const completedPct = obj.completion_rate * 100
    const failedPct    = obj.drop_rate * 100
    const remainPct    = Math.max(0, 100 - completedPct - failedPct)

    return (
        <div className="flex w-full min-w-[80px] h-2 rounded-full overflow-hidden bg-muted/40">
            <div
                title={`Completed ${completedPct.toFixed(1)}%`}
                style={{ width: `${completedPct}%` }}
                className="bg-emerald-500 transition-all"
            />
            <div
                title={`Failed ${failedPct.toFixed(1)}%`}
                style={{ width: `${failedPct}%` }}
                className="bg-red-500 transition-all"
            />
            <div
                title={`In progress / other ${remainPct.toFixed(1)}%`}
                style={{ width: `${remainPct}%` }}
                className="bg-muted/60 transition-all"
            />
        </div>
    )
}

export function ObjectivesFunnelTable({ objectives }: ObjectivesFunnelTableProps) {
    const sorted = [...objectives].sort((a, b) => a.order_index - b.order_index)

    return (
        <Card className="shadow-sm">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                    <CrosshairIcon className="h-4 w-4 text-muted-foreground" />
                    Objective Breakdown
                </CardTitle>
                <CardDescription>
                    {sorted.length} objective{sorted.length !== 1 ? 's' : ''} — sorted by progression order
                </CardDescription>
            </CardHeader>
            <CardContent className="pt-0 px-0">
                {sorted.length === 0 ? (
                    <div className="flex h-20 items-center justify-center text-sm text-muted-foreground px-4">
                        No objectives found
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="w-6 pl-4 text-center">#</TableHead>
                                <TableHead>Objective</TableHead>
                                <TableHead className="text-right w-16">Reached</TableHead>
                                <TableHead className="w-28">Outcome</TableHead>
                                <TableHead className="text-right">Comp %</TableHead>
                                <TableHead className="text-right">Drop %</TableHead>
                                <TableHead className="text-right">Avg</TableHead>
                                <TableHead className="text-right pr-4">Median</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sorted.map((obj, idx) => {
                                const isLast = idx === sorted.length - 1
                                const nextReached = !isLast ? sorted[idx + 1].players_reached : null
                                const dropOff = nextReached != null && obj.players_reached > 0
                                    ? 1 - (nextReached / obj.players_reached)
                                    : null

                                return (
                                    <>
                                        <TableRow key={obj.objective_id} className="hover:bg-muted/30">
                                            <TableCell className="pl-4 text-center text-xs text-muted-foreground font-mono">
                                                {obj.order_index + 1}
                                            </TableCell>
                                            <TableCell className="text-sm max-w-[180px] truncate" title={obj.description}>
                                                {obj.description}
                                            </TableCell>
                                            <TableCell className="text-right text-sm tabular-nums">
                                                {obj.players_reached.toLocaleString()}
                                            </TableCell>
                                            <TableCell>
                                                <ObjectiveMiniBar obj={obj} />
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <PctBadge value={obj.completion_rate} />
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <PctBadge value={obj.drop_rate} invert />
                                            </TableCell>
                                            <TableCell className="text-right text-xs text-muted-foreground tabular-nums">
                                                {obj.avg_time_seconds != null ? formatDuration(obj.avg_time_seconds) : '—'}
                                            </TableCell>
                                            <TableCell className="text-right pr-4 text-xs text-muted-foreground tabular-nums">
                                                {obj.median_time_seconds != null ? formatDuration(obj.median_time_seconds) : '—'}
                                            </TableCell>
                                        </TableRow>
                                        {/* Drop-off indicator between objectives */}
                                        {!isLast && dropOff !== null && dropOff > 0.05 && (
                                            <TableRow key={`dropoff-${obj.objective_id}`} className="hover:bg-transparent border-0">
                                                <TableCell colSpan={8} className="py-0 px-4">
                                                    <div className="flex items-center gap-2 py-1">
                                                        <div className="h-px flex-1 bg-border/40" />
                                                        <div className={cn(
                                                            'flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium',
                                                            dropOff > 0.4
                                                                ? 'bg-red-500/10 text-red-500'
                                                                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
                                                        )}>
                                                            <ArrowDownIcon className="h-2.5 w-2.5" />
                                                            {(dropOff * 100).toFixed(0)}% drop-off to next
                                                        </div>
                                                        <div className="h-px flex-1 bg-border/40" />
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </>
                                )
                            })}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    )
}
