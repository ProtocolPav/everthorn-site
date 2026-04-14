import { cn } from "@/lib/utils.ts";
import { ChartConfig, ChartContainer } from "@/components/ui/chart.tsx";
import { Area, AreaChart } from "recharts";

export interface InfoChipGraph {
    data: Record<string, number>[];
    dataKey: string;
    color: string;
    config: ChartConfig;
}

export interface InfoChipProps {
    label: string;
    value: React.ReactNode;
    subtext?: React.ReactNode;
    icon?: React.ReactNode;
    colorClass: string;       // e.g. "bg-orange-500/10"
    textClass: string;        // e.g. "text-orange-500"
    iconColorClass?: string;  // e.g. "text-orange-400/60"
    graph?: InfoChipGraph;
    className?: string;
    children?: React.ReactNode;
}

export function InfoChip({
                             label,
                             value,
                             subtext,
                             icon,
                             colorClass,
                             textClass,
                             iconColorClass,
                             graph,
                             className,
                             children,
                         }: InfoChipProps) {
    return (
        <div className={cn("w-full rounded-lg relative overflow-hidden min-w-0", colorClass, className)}>
            {/* Optional sparkline background */}
            {graph && (
                <div className="absolute inset-0 opacity-40 pointer-events-none">
                    <ChartContainer config={graph.config} className="h-full w-full">
                        <AreaChart data={graph.data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                            <Area
                                dataKey={graph.dataKey}
                                type="natural"
                                fill={graph.color}
                                fillOpacity={0.35}
                                stroke={graph.color}
                                strokeWidth={1.5}
                            />
                        </AreaChart>
                    </ChartContainer>
                </div>
            )}

            {/* Content */}
            <div className="relative z-10 p-3 h-full flex flex-col justify-between">
                <div className="flex items-center justify-between mb-1">
                    <span className={cn(
                        "text-[10px] font-semibold uppercase tracking-widest opacity-70",
                        textClass,
                    )}>
                        {label}
                    </span>
                    {icon && (
                        <span className={cn("shrink-0", iconColorClass ?? textClass)}>
                            {icon}
                        </span>
                    )}
                </div>

                <div className={cn("text-2xl font-bold leading-none", textClass)}>
                    {value}
                </div>

                {(subtext || children) && (
                    <div className="text-[10px] text-muted-foreground mt-1">
                        {subtext ?? children}
                    </div>
                )}
            </div>
        </div>
    );
}