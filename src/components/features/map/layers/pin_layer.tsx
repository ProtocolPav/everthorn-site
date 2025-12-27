import {Tooltip as LTooltip, Popup, Marker} from "react-leaflet";
import React from "react";
import L from "leaflet";
import shopPin from "/map/pins/shop.png";
import relicPin from "/map/pins/relic.png";
import farmPin from "/map/pins/farm.png";
import {Toggle} from "@/types/map-toggle";
import {Pin} from "@/types/pins";

const shop_icon = new L.Icon({
    iconUrl: shopPin,
    iconSize: [25.6, 25.6], // 64 * 0.4
    iconAnchor: [12.8, 25.6], // Anchor at middle [w/2, height]
});

const farm_icon = new L.Icon({
    iconUrl: farmPin,
    iconSize: [25.6, 25.6], // 64 * 0.4
    iconAnchor: [12.8, 25.6], // Anchor at middle [w/2, height]
});

const relic_icon = new L.Icon({
    iconUrl: relicPin,
    iconSize: [25.6, 25.6], // 64 * 0.4
    iconAnchor: [12.8, 25.6], // Anchor at middle [w/2, height]
});

function get_icon(pin: Pin) {
    switch (pin.pin_type) {
        case "shop":
            return shop_icon
        case "farm":
            return farm_icon

        default:
            return relic_icon

    }
}

export const PinLayer = React.memo(({pins, toggle, currentlayer}: {pins: Pin[], toggle: Toggle, currentlayer: string}) => {
    if (!toggle.visible) return null

    const filtered_pins = pins.filter(pin => pin.dimension === `minecraft:${currentlayer}`)

    return (
        <>
            {filtered_pins.map(pin => (
                <Marker
                    icon={get_icon(pin)}
                    position={[-pin.coordinates[2], pin.coordinates[0]]}
                    key={`${pin.id}-${toggle.label_visible}`}
                >
                    <LTooltip offset={[-5, -12]} direction={'left'} permanent={toggle.label_visible}>{pin.name}</LTooltip>
                    <Popup
                        offset={[4, -15]}
                        closeButton={false}
                        autoPan={true}
                        className={'items-center w-[21rem]'}
                    >
                        {pin.description}
                    </Popup>
                </Marker>
            ))}
        </>
    )
})

PinLayer.displayName = "PinLayer";