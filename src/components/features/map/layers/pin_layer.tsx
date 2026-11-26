import React from "react";

import shopPin from "/map/pins/shop.png";
import relicPin from "/map/pins/relic.png";
import farmPin from "/map/pins/farm.png";
import type { Toggle } from "@/types/map-toggle";
import { PinCard } from "@/components/features/pins/pin-card.tsx";
import type { PinOut } from "@/api/nexuscore/model";
import { createMarkerIconStyle } from "@/lib/map-styles.tsx";
import { MapMarker } from "@/components/features/map/core/map-marker.tsx";

// Pin images are 64×64, anchored at their bottom-center
const BOTTOM_CENTER: [number, number] = [0.5, 1];

const shop_style = createMarkerIconStyle(shopPin, { size: [25.6, 25.6], anchor: BOTTOM_CENTER }); // 0.4×
const farm_style = createMarkerIconStyle(farmPin, { size: [25.6, 25.6], anchor: BOTTOM_CENTER }); // 0.4×
const relic_style = createMarkerIconStyle(relicPin, { size: [22.4, 22.4], anchor: BOTTOM_CENTER }); // 0.35×

function get_style(pin: PinOut) {
    switch (pin.pin_type) {
        case "shop":
            return shop_style;
        case "farm":
            return farm_style;
        default:
            return relic_style;
    }
}

const PinMarker = React.memo(function PinMarker({ pin, labelVisible }: { pin: PinOut; labelVisible: boolean }) {
    return (
        <MapMarker
            id={`pin:${pin.id}`}
            x={pin.coordinates[0]}
            z={pin.coordinates[2]}
            style={get_style(pin)}
            label={pin.name}
            labelVisible={labelVisible}
            labelOffset={[-12, -11]}
            popup={<PinCard className="w-84" pin={pin} />}
        />
    );
});

/** Pin markers (landmarks, farms, shops). Render inside a vector or cluster layer. */
export const PinLayer = React.memo(
    ({ pins, toggle, currentlayer }: { pins: PinOut[]; toggle: Toggle; currentlayer: string }) => {
        if (!toggle.visible) return null;

        const filtered_pins = pins.filter((pin) => pin.dimension === `minecraft:${currentlayer}`);

        return (
            <>
                {filtered_pins.map((pin) => (
                    <PinMarker key={pin.id} pin={pin} labelVisible={toggle.label_visible ?? false} />
                ))}
            </>
        );
    },
);

PinLayer.displayName = "PinLayer";
