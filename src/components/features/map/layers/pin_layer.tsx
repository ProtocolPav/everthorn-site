import React, { useEffect, useRef } from "react";
import { useRLayersComponent } from "rlayers";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Feature } from "ol";
import { Point } from "ol/geom";
import { Style, Icon } from "ol/style";
import Overlay from "ol/Overlay";
import { createRoot } from "react-dom/client";
import shopPin from "/map/pins/shop.png";
import relicPin from "/map/pins/relic.png";
import farmPin from "/map/pins/farm.png";
import type { Toggle } from "@/types/map-toggle";
import type { PinOut } from "@/api/nexuscore/model";
import { PinCard } from "@/components/features/pins/pin-card.tsx";

const PIN_ICON_SIZE = 25.6;
const RELIC_ICON_SIZE = 22.4;

function getIconUrl(pin: PinOut): string {
    switch (pin.pin_type) {
        case "shop": return shopPin;
        case "farm": return farmPin;
        default: return relicPin;
    }
}

function getIconSize(pin: PinOut): number {
    return pin.pin_type === "relic" ? RELIC_ICON_SIZE : PIN_ICON_SIZE;
}

function buildPinStyle(pin: PinOut, labelVisible: boolean): Style[] {
    const size = getIconSize(pin);
    const styles: Style[] = [
        new Style({
            image: new Icon({
                src: getIconUrl(pin),
                width: size,
                height: size,
                anchor: [0.5, 1],
                anchorXUnits: "fraction",
                anchorYUnits: "fraction",
            }),
        }),
    ];
    return styles;
}

export const PinLayer = React.memo(({ pins, toggle, currentlayer }: { pins: PinOut[]; toggle: Toggle; currentlayer: string }) => {
    const { map } = useRLayersComponent();
    const layerRef = useRef<VectorLayer<VectorSource> | null>(null);
    const popupOverlayRef = useRef<Overlay | null>(null);
    const popupContainerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!map) return;

        // Popup overlay element
        const container = document.createElement("div");
        container.className = "ol-popup";
        const popupOverlay = new Overlay({
            element: container,
            autoPan: { animation: { duration: 250 } },
            offset: [4, -15],
        });
        map.addOverlay(popupOverlay);
        popupOverlayRef.current = popupOverlay;
        popupContainerRef.current = container;

        return () => {
            map.removeOverlay(popupOverlay);
        };
    }, [map]);

    useEffect(() => {
        if (!map) return;

        // Remove old layer
        if (layerRef.current) map.removeLayer(layerRef.current);

        if (!toggle.visible) {
            layerRef.current = null;
            return;
        }

        const filtered = pins.filter(pin => pin.dimension === `minecraft:${currentlayer}`);

        const source = new VectorSource();
        filtered.forEach(pin => {
            const feature = new Feature({
                geometry: new Point([pin.coordinates[0], -pin.coordinates[2]]),
                pin,
            });
            feature.setStyle(buildPinStyle(pin, toggle.label_visible));
            source.addFeature(feature);
        });

        const layer = new VectorLayer({ source, zIndex: 10 });
        map.addLayer(layer);
        layerRef.current = layer;

        // Click handler for popup
        const handleClick = (e: any) => {
            const feature = map.forEachFeatureAtPixel(e.pixel, f => f, {
                layerFilter: l => l === layer,
            });
            if (feature) {
                const pinData: PinOut = feature.get("pin");
                const coord = (feature.getGeometry() as Point).getCoordinates();
                const container = popupContainerRef.current!;
                container.innerHTML = "";
                const root = createRoot(container);
                root.render(<PinCard className="w-[21rem]" pin={pinData} />);
                popupOverlayRef.current?.setPosition(coord);
            } else {
                popupOverlayRef.current?.setPosition(undefined);
            }
        };
        map.on("singleclick", handleClick);

        return () => {
            map.removeLayer(layer);
            map.un("singleclick", handleClick);
        };
    }, [map, pins, toggle.visible, toggle.label_visible, currentlayer]);

    return null;
});

PinLayer.displayName = "PinLayer";
