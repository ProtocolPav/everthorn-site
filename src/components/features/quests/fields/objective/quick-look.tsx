import {CustomizationId, CUSTOMIZATIONS} from "@/config/objective-customization-options.ts";
import {MINECRAFT_ITEM_OPTIONS} from "@/config/minecraft-options.ts";
import type {Icon as PhosphorIcon} from "@phosphor-icons/react/dist/lib/types";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip.tsx";
import {GiftIcon} from "@phosphor-icons/react";

function formatSeconds(totalSeconds: number): string {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    const parts = [];
    if (h) parts.push(`${h}h`);
    if (m) parts.push(`${m}m`);
    if (s || parts.length === 0) parts.push(`${s}s`);
    return parts.join(' ');
}

function getCustomizationHint(id: CustomizationId, value: Record<string, unknown>): string {
    switch (id) {
        case 'timer':
            return `Complete within ${formatSeconds(value.seconds as number)}`;
        case 'natural_block':
            return 'All blocks naturally generated';
        case 'maximum_deaths':
            return `max. ${value.deaths ?? '?'} deaths`;
        case 'mainhand': {
            const label = MINECRAFT_ITEM_OPTIONS.find(o => o.value === value.item)?.label;
            return 'using ' + (label || 'None');
        }
        case 'location': {
            const coords = value.coordinates as [number, number, number] | undefined;
            const coordStr = coords ? `(${coords[0] ?? '?'}, ${coords[1] ?? '?'}, ${coords[2] ?? '?'})` : '(?, ?, ?)';
            return `Around ${coordStr}  ↔ ${value.horizontal_radius ?? '?'}${value.vertical_radius ? `  ↕ ${value.vertical_radius}` : ''}`;
        }
    }
}

const MAX_VISIBLE = 3;

function QuickLookItem({ icon, hint, badge }: {
    icon: PhosphorIcon;
    hint: string;
    badge?: number;
}) {
    const Icon = icon;
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <div className="flex items-center gap-1 text-muted-foreground/50 hover:text-muted-foreground transition-colors cursor-default">
                    <Icon size={15} weight="duotone" />
                    {badge !== undefined && badge > 0 && (
                        <span className="text-[11px] tabular-nums">{badge}</span>
                    )}
                </div>
            </TooltipTrigger>
            <TooltipContent side="top" sideOffset={8}>
                {hint}
            </TooltipContent>
        </Tooltip>
    );
}

export function QuickLookSection({
                              customizations,
                              rewardsCount,
                          }: {
    customizations: Record<string, Record<string, unknown> | null>;
    rewardsCount: number;
}) {
    const activeCustomizations = Object.entries(customizations || {})
        .filter(([, value]) => value !== null) as [CustomizationId, Record<string, unknown>][];

    const hasMore = activeCustomizations.length > 1;

    return (
        <div className="group flex items-center gap-2">
            {rewardsCount > 0 && (
                <QuickLookItem
                    icon={GiftIcon}
                    hint={`${rewardsCount} reward${rewardsCount !== 1 ? 's' : ''}`}
                    badge={rewardsCount}
                />
            )}

            {activeCustomizations.map(([id], index) => {
                const config = CUSTOMIZATIONS[id];
                const isExtra = index >= MAX_VISIBLE;
                const isMidRange = index > 0 && index < MAX_VISIBLE;
                const staggerIndex = isExtra ? index - MAX_VISIBLE : 0;

                let wrapperClass: string;
                if (isExtra) {
                    wrapperClass = 'overflow-hidden w-0 opacity-0 -ml-2 scale-75 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-auto group-hover:opacity-100 group-hover:scale-100 group-hover:ml-0';
                } else if (isMidRange) {
                    wrapperClass = 'overflow-hidden w-0 opacity-0 -ml-2 scale-75 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] sm:w-auto sm:opacity-100 sm:scale-100 sm:ml-0 group-hover:w-0 group-hover:opacity-0 group-hover:scale-75 group-hover:-ml-2';
                } else {
                    return (
                        <QuickLookItem
                            key={id}
                            icon={config.icon}
                            hint={getCustomizationHint(id, customizations[id]!)}
                        />
                    );
                }

                return (
                    <div
                        key={id}
                        className={wrapperClass}
                        style={isExtra ? { transitionDelay: `${staggerIndex * 35}ms` } : undefined}
                    >
                        <QuickLookItem
                            icon={config.icon}
                            hint={getCustomizationHint(id, customizations[id]!)}
                        />
                    </div>
                );
            })}

            {hasMore && (
                <>
                    <span className="sm:hidden inline-block text-[11px] text-muted-foreground/40 tabular-nums shrink-0 overflow-hidden transition-all duration-150 group-hover:hidden">
                        +{activeCustomizations.length - 1}
                    </span>
                    <span className="hidden sm:inline-block text-[11px] text-muted-foreground/40 tabular-nums shrink-0 overflow-hidden transition-all duration-150 group-hover:hidden">
                        +{activeCustomizations.length - MAX_VISIBLE}
                    </span>
                </>
            )}
        </div>
    );
}
