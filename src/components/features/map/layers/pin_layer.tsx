import React from "react";
import { RLayerVector, RFeature, ROverlay, useOL } from "rlayers";
import { RStyle, RIcon } from "rlayers/style";
import { Point } from "ol/geom";
import { AnimatePresence, motion } from "motion/react";

import shopPin from "/map/pins/shop.png";
import relicPin from "/map/pins/relic.png";
import farmPin from "/map/pins/farm.png";
import type { Toggle } from "@/types/map-toggle";
import { PinCard } from "@/components/features/pins/pin-card";
import type { PinOut } from "@/api/nexuscore/model";
import { MapTooltip } from "@/components/features/map/core/tooltip";

// Native pin is 64×64, Leaflet used 25.6×25.6 (0.4×) for shop/farm and 22.4×22.4 (0.35×) for relic.
const PIN_ICON_SCALES: Record<string, number> = {
    shop: 0.4,
    farm: 0.4,
    relic: 0.35,
};

const PIN_ICONS: Record<string, string> = {
    shop: shopPin,
    farm: farmPin,
    relic: relicPin,
};

function getIconSrc(pinType: string): string {
    return PIN_ICONS[pinType] ?? relicPin;
}

function getIconScale(pinType: string): number {
    return PIN_ICON_SCALES[pinType] ?? 0.35;
}

export const PinLayer = React.memo(
    ({
        pins,
        toggle,
        currentlayer,
    }: {
        pins: PinOut[];
        toggle: Toggle;
        currentlayer: string;
    }) => {
        const { map } = useOL();
        const [selectedId, setSelectedId] = React.useState<number | null>(null);

        React.useEffect(() => {
            setSelectedId(null);
            if (!map) return;
            const close = () => setSelectedId(null);
            map.on("click", close);
            map.on("pointerdrag", close);
            return () => {
                map.un("click", close);
                map.un("pointerdrag", close);
            };
        }, [map, currentlayer, toggle.visible]);

        if (!toggle.visible) return null;

        const filtered_pins = pins.filter((pin) => pin.dimension === `minecraft:${currentlayer}`);

        if (filtered_pins.length === 0) return null;

        return (
            <RLayerVector>
                {filtered_pins.map((pin) => {
                    const [x, , z] = pin.coordinates;
                    const isSelected = selectedId === pin.id;
                    return (
                        <RFeature
                            key={String(pin.id)}
                            geometry={new Point([x, z])}
                            onClick={() => {
                                setSelectedId((prev) => (prev === pin.id ? null : pin.id));
                                return false;
                            }}
                        >
                            <RStyle>
                                <RIcon
                                    src={getIconSrc(pin.pin_type)}
                                    anchor={[0.5, 1]}
                                    anchorXUnits="fraction"
                                    anchorYUnits="fraction"
                                    scale={getIconScale(pin.pin_type)}
                                />
                            </RStyle>

                            <MapTooltip label_visible={toggle.label_visible ?? false} offset={[-12, -11]}>
                                {pin.name}
                            </MapTooltip>

                            <AnimatePresence>
                                {isSelected && (
                                    <ROverlay
                                        positioning="bottom-center"
                                        offset={[0, -30]}
                                        autoPan
                                        className="map-popup pointer-events-auto drop-shadow-2xl drop-shadow-black/50"
                                    >
                                        <motion.div
                                            style={{ transformOrigin: "bottom center" }}
                                            initial={{
                                                opacity: 0,
                                                scaleX: 0.2,
                                                scaleY: 0.05,
                                                y: 25,
                                                filter: "blur(8px)",
                                            }}
                                            animate={{
                                                opacity: 1,
                                                scaleX: 1,
                                                scaleY: 1,
                                                y: 0,
                                                filter: "blur(0px)",
                                                transition: {
                                                    duration: 0.3,
                                                    ease: [0.16, 1, 0.3, 1],
                                                },
                                            }}
                                            exit={{
                                                opacity: 0,
                                                scaleX: 0.05,
                                                scaleY: 0.1,
                                                y: 25,
                                                filter: "blur(12px)",
                                                transition: {
                                                    duration: 0.22,
                                                    ease: [0.7, 0, 0.84, 0],
                                                },
                                            }}
                                        >
                                            <PinCard className="w-84" pin={pin} />
                                        </motion.div>
                                    </ROverlay>
                                )}
                            </AnimatePresence>
                        </RFeature>
                    );
                })}
            </RLayerVector>
        );
    },
);

PinLayer.displayName = "PinLayer";
