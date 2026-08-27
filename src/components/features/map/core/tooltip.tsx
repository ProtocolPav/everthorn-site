import React from "react";
import { ROverlay, RPopup } from "rlayers";
import {cn} from "@/lib/utils.ts";

export interface MapTooltipProps {
    /** If true, the tooltip is permanently visible (ROverlay). If false, it only shows on hover (RPopup). */
    label_visible: boolean;
    /** The content or label to display inside the tooltip */
    children: React.ReactNode;
    /** OpenLayers positioning relative to the feature coordinate. Defaults to "center-right". */
    positioning?: React.ComponentProps<typeof ROverlay>["positioning"];
    /** Pixel offset [x, y]. Defaults to [-3, -9]. */
    offset?: [number, number];
    /** Additional CSS classes to append to the tooltip */
    className?: string;
}

const DEFAULT_TOOLTIP_CLASSES = "bg-background/70 border-none rounded-sm text-foreground text-xs font-minecraft-seven py-1 px-1.5 whitespace-nowrap shadow-[0_1px_3px_rgba(0,0,0,0.4)] pointer-events-none leading-none select-none";

export const MapTooltip: React.FC<MapTooltipProps> = ({
                                                          label_visible,
                                                          children,
                                                          positioning = "center-right",
                                                          offset = [-3, -9],
                                                          className = "",
                                                      }) => {
    const combinedClasses = cn(DEFAULT_TOOLTIP_CLASSES, className)

    if (label_visible) {
        return (
            <ROverlay
                positioning={positioning}
                offset={offset}
                className={'map-tooltip'}
            >
                <div className={combinedClasses}>
                    {children}
                </div>
            </ROverlay>
        );
    }

    return (
        <RPopup
            trigger="hover"
            positioning={positioning}
            offset={offset}
            autoPan={false}
            className={'map-tooltip'}
            delay={{ show: 0, hide: 0 }}
        >
            <div className={combinedClasses}>
                {children}
            </div>
        </RPopup>
    );
};

MapTooltip.displayName = "MapTooltip";