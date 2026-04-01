import {CustomizationId, CUSTOMIZATIONS} from "@/config/quests/customization-options.ts";
import {MINECRAFT_ITEM_OPTIONS} from "@/config/minecraft-options.ts";
import type {Icon as PhosphorIcon} from "@phosphor-icons/react/dist/lib/types";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip.tsx";
import {GearIcon, GiftIcon} from "@phosphor-icons/react";
import {formatDuration} from "@/lib/format.ts";

function getCustomizationHint(id: CustomizationId, value: Record<string, unknown>): string {
    switch (id) {
        case 'timer':
            return `Complete within ${formatDuration(value.seconds as number)}`;
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
        <Tooltip delayDuration={30}>
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

    const hasMore = activeCustomizations.length > MAX_VISIBLE;

    return (
        <>
            <div className="flex items-center gap-2 sm:hidden">
                {rewardsCount > 0 && (
                    <QuickLookItem
                        icon={GiftIcon}
                        hint={`${rewardsCount} reward${rewardsCount !== 1 ? 's' : ''}`}
                        badge={rewardsCount}
                    />
                )}
                {activeCustomizations.length > 0 && (
                    <QuickLookItem
                        icon={GearIcon}
                        hint={`${activeCustomizations.length} customization${activeCustomizations.length !== 1 ? 's' : ''}`}
                        badge={activeCustomizations.length}
                    />
                )}
            </div>

            <div className="group hidden sm:flex items-center gap-2">
                {rewardsCount > 0 && (
                    <QuickLookItem
                        icon={GiftIcon}
                        hint={`${rewardsCount} reward${rewardsCount !== 1 ? 's' : ''}`}
                        badge={rewardsCount}
                    />
                )}

                {activeCustomizations.slice(0, MAX_VISIBLE).map(([id]) => {
                    const config = CUSTOMIZATIONS[id];
                    return (
                        <QuickLookItem
                            key={id}
                            icon={config.icon}
                            hint={getCustomizationHint(id, customizations[id]!)}
                        />
                    );
                })}

                {hasMore && activeCustomizations.slice(MAX_VISIBLE).map(([id], i) => {
                    const config = CUSTOMIZATIONS[id];
                    return (
                        <div
                            key={id}
                            className="overflow-hidden w-0 opacity-0 -ml-2 scale-75 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-auto group-hover:opacity-100 group-hover:scale-100 group-hover:ml-0"
                            style={{ transitionDelay: `${i * 35}ms` }}
                        >
                            <QuickLookItem
                                icon={config.icon}
                                hint={getCustomizationHint(id, customizations[id]!)}
                            />
                        </div>
                    );
                })}

                {hasMore && (
                    <span className="inline-block text-[11px] text-muted-foreground/40 tabular-nums shrink-0 overflow-hidden transition-all duration-150 group-hover:hidden">
                        +{activeCustomizations.length - MAX_VISIBLE}
                    </span>
                )}
            </div>
        </>
    );
}
