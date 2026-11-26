import { MapPinIcon, StorefrontIcon, SubwayIcon, TreeIcon } from "@phosphor-icons/react";

import type { SeamlessSelectOption } from "@/components/common/seamless-select.tsx";
import { DIMENSION_OPTIONS } from "@/config/project-form-options.ts";

/** Pin types, coloured like `PinTypeBadge`. */
export const PIN_TYPE_OPTIONS: SeamlessSelectOption[] = [
    {
        value: "relic",
        label: "Landmark",
        icon: MapPinIcon,
        triggerClassName: "bg-amber-500/10 text-amber-700 border-amber-500/20 hover:bg-amber-500/20 dark:text-amber-400",
        iconClassName: "text-amber-600 dark:text-amber-400",
    },
    {
        value: "farm",
        label: "Farm",
        icon: TreeIcon,
        triggerClassName: "bg-pink-500/10 text-pink-700 border-pink-500/20 hover:bg-pink-500/20 dark:text-pink-400",
        iconClassName: "text-pink-600 dark:text-pink-400",
    },
    {
        value: "shop",
        label: "Shop",
        icon: StorefrontIcon,
        triggerClassName: "bg-cyan-500/10 text-cyan-700 border-cyan-500/20 hover:bg-cyan-500/20 dark:text-cyan-400",
        iconClassName: "text-cyan-600 dark:text-cyan-400",
    },
];

/** Every dimension the world map has a layer for (the project form's list, plus the subway). */
export const MAP_DIMENSION_OPTIONS: SeamlessSelectOption[] = [
    DIMENSION_OPTIONS[0],
    {
        value: "minecraft:subway",
        label: "Subway",
        icon: SubwayIcon,
        triggerClassName:
            "bg-slate-500/10 text-slate-700 border-slate-500/20 hover:bg-slate-500/15 dark:text-slate-300 dark:border-slate-500/30",
        iconClassName: "text-slate-600/80 dark:text-slate-300/80",
    },
    ...DIMENSION_OPTIONS.slice(1),
];

/** The map layer id (`overworld`) for a dimension (`minecraft:overworld`), and back. */
export function dimensionToLayer(dimension: string): string {
    return dimension.replace(/^minecraft:/, "");
}

export function layerToDimension(layer: string): string {
    return `minecraft:${layer}`;
}

/** Y a new pin gets: the layer's usual height (see the live map's layer list). */
export const DEFAULT_PIN_Y: Record<string, number> = {
    overworld: 70,
    subway: -48,
    nether: 64,
    the_end: 64,
};
