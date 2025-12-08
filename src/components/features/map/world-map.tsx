"use client";

import React, { useEffect } from "react";
import { MapContainer } from "react-leaflet";
import L from "leaflet";

import { ControlBar } from "@/components/features/map/control-bar";
import { CustomTileLayerComponent } from "@/components/features/map/tile-layer";
import type { Toggle } from "@/types/map-toggle";

import { usePlayers } from "@/hooks/use-players";
import {DEFAULT_LAYERS, DEFAULT_PINS} from "@/config/map-defaults.ts";

export default function WorldMap() {
    const position: [number, number] = [0, 0]; // Default map center

    // Load initial state from localStorage or use defaults
    const [pintoggles, setpintoggles] = React.useState<Toggle[]>(() => {
        if (typeof window === 'undefined') return DEFAULT_PINS;

        try {
            const saved = localStorage.getItem('everthorn-map-pins');
            if (saved) {
                const parsed = JSON.parse(saved);
                // Merge with defaults to handle new pins added in updates
                return DEFAULT_PINS.map(defaultPin => {
                    const savedPin = parsed.find((p: Toggle) => p.id === defaultPin.id);
                    return savedPin ? { ...defaultPin, ...savedPin } : defaultPin;
                });
            }
        } catch (error) {
            console.error('Failed to load pin preferences:', error);
        }

        return DEFAULT_PINS;
    });

    const [layertoggles, setlayertoggles] = React.useState<Toggle[]>(() => {
        if (typeof window === 'undefined') return DEFAULT_LAYERS;

        try {
            const saved = localStorage.getItem('everthorn-map-layers');
            if (saved) {
                const parsed = JSON.parse(saved);
                // Merge with defaults to handle new layers added in updates
                return DEFAULT_LAYERS.map(defaultLayer => {
                    const savedLayer = parsed.find((l: Toggle) => l.id === defaultLayer.id);
                    return savedLayer ? { ...defaultLayer, ...savedLayer } : defaultLayer;
                });
            }
        } catch (error) {
            console.error('Failed to load layer preferences:', error);
        }

        return DEFAULT_LAYERS;
    });

    // Save pins to localStorage whenever they change
    useEffect(() => {
        try {
            localStorage.setItem('everthorn-map-pins', JSON.stringify(pintoggles));
        } catch (error) {
            console.error('Failed to save pin preferences:', error);
        }
    }, [pintoggles]);

    // Save layers to localStorage whenever they change
    useEffect(() => {
        try {
            localStorage.setItem('everthorn-map-layers', JSON.stringify(layertoggles));
        } catch (error) {
            console.error('Failed to save layer preferences:', error);
        }
    }, [layertoggles]);

    function update_pins(id: string, toggle_label?: boolean) {
        const new_pins = pintoggles.map((pin) => {
            if (pin.id === id) {
                return {
                    ...pin,
                    visible: toggle_label ? pin.visible : !pin.visible,
                    label_visible: toggle_label ? !pin.label_visible : pin.label_visible,
                };
            } else {
                return pin;
            }
        });

        setpintoggles(new_pins);
    }

    function update_layers(id: string) {
        const new_layers = layertoggles.map((layer) => {
            if (layer.id === id) {
                return {
                    ...layer,
                    visible: true,
                };
            } else {
                return {
                    ...layer,
                    visible: false,
                };
            }
        });

        setlayertoggles(new_layers);
    }

    const { data: players } = usePlayers("611008530077712395");
    const online_players = players?.length ?? 0;

    const activeLayerId =
        layertoggles.filter((toggle) => toggle.visible)[0]?.id || "overworld";

    return (
        <MapContainer
            scrollWheelZoom={true}
            center={position}
            zoom={0}
            style={{ width: "100%", height: "100%" }}
            className={"z-0 flex"}
            zoomControl={false}
            crs={L.CRS.Simple}
            maxBounds={[[2200, 2200], [-2200, -2200]]}
            maxBoundsViscosity={0.03}
            attributionControl={false}
            minZoom={-5}
            maxZoom={6}
        >
            <CustomTileLayerComponent layer={activeLayerId} />

            <ControlBar
                pins={pintoggles}
                update_pins={update_pins}
                layers={layertoggles}
                update_layers={update_layers}
                online_players={online_players}
            />

            {/* No project/player/pin layers here; only what ControlBar needs */}
        </MapContainer>
    );
}
