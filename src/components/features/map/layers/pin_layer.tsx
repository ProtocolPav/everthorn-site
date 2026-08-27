import React, { useState, useEffect } from "react";
import { Point } from "ol/geom";
import { RLayerVector, RFeature, ROverlay, RStyle, useOL } from "rlayers";
import shopPin from "/map/pins/shop.png";
import relicPin from "/map/pins/relic.png";
import farmPin from "/map/pins/farm.png";
import { Toggle } from "@/types/map-toggle";
import { PinCard } from "@/components/features/pins/pin-card.tsx";
import { PinOut } from "@/api/nexuscore/model";

// improve hit area for small icons
// @ts-ignore
RFeature.hitTolerance = 8;

function getIconSrc(pin: PinOut): string {
    switch (pin.pin_type) {
        case "shop":
            return shopPin;
        case "farm":
            return farmPin;
        default:
            return relicPin;
    }
}

function getIconSize(pin: PinOut): [number, number] {
    switch (pin.pin_type) {
        case "shop":
        case "farm":
            return [25.6, 25.6];
        default:
            return [22.4, 22.4];
    }
}

export const PinLayer = React.memo(({ pins, toggle, currentlayer }: { pins: PinOut[]; toggle: Toggle; currentlayer: string }) => {
    if (!toggle.visible) return null;

    const filtered_pins = pins.filter((pin) => pin.dimension === `minecraft:${currentlayer}`);

    const [selected, setSelected] = useState<PinOut | null>(null);
    const { map } = useOL();

    useEffect(() => {
        if (!selected) return;
        const handle = (e: any) => {
            const pixel = map.getEventPixel(e.originalEvent);
            const feature = map.forEachFeatureAtPixel(pixel, (f) => f, { hitTolerance: 8 });
            if (!feature) setSelected(null);
        };
        map.on("click", handle);
        return () => map.un("click", handle);
    }, [map, selected]);

    if (filtered_pins.length === 0 && !selected) return null;

    return (
        <>
            <RLayerVector zIndex={10}>
                {filtered_pins.map((pin) => {
                    const src = getIconSrc(pin);
                    const size = getIconSize(pin);
                    return (
                        <RFeature
                            key={`${pin.id}-${toggle.label_visible}`}
                            geometry={new Point([pin.coordinates[0], pin.coordinates[2]])}
                            onClick={() => setSelected(pin)}
                        >
                            <RStyle.RStyle>
                                <RStyle.RIcon src={src} anchor={[0.5, 1]} scale={size[0] / 64} />
                            </RStyle.RStyle>

                            {toggle.label_visible && (
                                <ROverlay positioning="center-left" offset={[-8, -8]} className="pointer-events-none">
                                    <div className="leaflet-tooltip leaflet-tooltip-left !bg-card !text-card-foreground !border-border shadow-sm px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap !font-minecraft-seven tracking-wide">
                                        {pin.name}
                                    </div>
                                </ROverlay>
                            )}
                        </RFeature>
                    );
                })}
            </RLayerVector>

            {selected && (
                <RLayerVector zIndex={30}>
                    <RFeature geometry={new Point([selected.coordinates[0], selected.coordinates[2]])}>
                        <ROverlay positioning="top-center" offset={[0, -28]} autoPan className="w-[21rem] pointer-events-auto">
                            <PinCard className="w-[21rem] pin-popup-card shadow-xl border" pin={selected} />
                        </ROverlay>
                    </RFeature>
                </RLayerVector>
            )}
        </>
    );
});

PinLayer.displayName = "PinLayer";
