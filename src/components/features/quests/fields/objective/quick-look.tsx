import {CustomizationId, CUSTOMIZATIONS} from "@/config/objective-customization-options.ts";
import {MINECRAFT_ITEM_OPTIONS} from "@/config/minecraft-options.ts";
import {useState} from "react";
import type {Icon as PhosphorIcon} from "@phosphor-icons/react/dist/lib/types";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip.tsx";
import {GiftIcon} from "@phosphor-icons/react";
import {AnimatePresence, motion} from "motion/react";

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

export function QuickLookSection({
                              customizations,
                              rewardsCount,
                          }: {
    customizations: Record<string, Record<string, unknown> | null>;
    rewardsCount: number;
}) {
    const [expanded, setExpanded] = useState(false);

    const activeCustomizations = Object.entries(customizations || {})
        .filter(([, value]) => value !== null) as [CustomizationId, Record<string, unknown>][];

    const visibleCustomizations = activeCustomizations.slice(0, MAX_VISIBLE);
    const hiddenCustomizations = activeCustomizations.slice(MAX_VISIBLE);
    const hasMore = hiddenCustomizations.length > 0;

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

    return (
        <div
            className="flex items-center gap-2"
            onMouseEnter={() => hasMore && setExpanded(true)}
            onMouseLeave={() => hasMore && setExpanded(false)}
        >
            {rewardsCount > 0 && (
                <QuickLookItem
                    icon={GiftIcon}
                    hint={`${rewardsCount} reward${rewardsCount !== 1 ? 's' : ''}`}
                    badge={rewardsCount}
                />
            )}

            {visibleCustomizations.map(([id]) => {
                const config = CUSTOMIZATIONS[id];
                return (
                    <QuickLookItem
                        key={id}
                        icon={config.icon}
                        hint={getCustomizationHint(id, customizations[id]!)}
                    />
                );
            })}

            <AnimatePresence>
                {expanded && hiddenCustomizations.map(([id], i) => {
                    const config = CUSTOMIZATIONS[id];
                    return (
                        <motion.div
                            key={id}
                            initial={{ opacity: 0, width: 0, marginLeft: 0 }}
                            animate={{ opacity: 1, width: 'auto', marginLeft: 0 }}
                            exit={{ opacity: 0, width: 0, marginLeft: 0 }}
                            transition={{ duration: 0.2, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                            className="overflow-hidden shrink-0"
                        >
                            <QuickLookItem
                                icon={config.icon}
                                hint={getCustomizationHint(id, customizations[id]!)}
                            />
                        </motion.div>
                    );
                })}
            </AnimatePresence>

            {hasMore && !expanded && (
                <span className="text-[11px] text-muted-foreground/40 tabular-nums shrink-0">
                    +{hiddenCustomizations.length}
                </span>
            )}
        </div>
    );
}