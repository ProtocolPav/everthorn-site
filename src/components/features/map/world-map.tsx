"use client";

import React from "react";
import { MapContainer } from "react-leaflet";
import L from "leaflet";

import { ControlBar } from "@/components/features/map/control-bar";
import { CustomTileLayerComponent } from "@/components/features/map/tile-layer";
import type { Toggle } from "@/types/map-toggle";

import project from "/map/ui/project.png";
import player from "/map/ui/steve.png";
import farm from "/map/ui/farm.png";
import relic from "/map/ui/relic.png";
import shop from "/map/ui/shop.png";
import grass_block from "/map/ui/grass_block.png";
import netherrack from "/map/ui/netherrack.png";
import deepslate from "/map/ui/deepslate.png";
import endstone from "/map/ui/endstone.png";

import { usePlayers } from "@/hooks/use-players";

export default function WorldMap() {
    const position: [number, number] = [0, 0]; // Default map center

    const [pintoggles, setpintoggles] = React.useState<Toggle[]>([
        {
            id: "projects",
            name: "Projects",
            image: project,
            visible: true,
            label_visible: true,
        },
        {
            id: "players",
            name: "Players",
            image: player,
            visible: true,
            label_visible: true,
        },
        {
            id: "relics",
            name: "Landmarks",
            image: relic,
            visible: true,
            label_visible: false,
        },
        {
            id: "farms",
            name: "Farms",
            image: farm,
            visible: false,
            label_visible: false,
        },
        {
            id: "shops",
            name: "Shops",
            image: shop,
            visible: false,
            label_visible: false,
        },
    ]);

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

    const [layertoggles, setlayertoggles] = React.useState<Toggle[]>([
        { id: "overworld", name: "Overworld", image: grass_block, visible: true, description: '80' },
        { id: "subway", name: "Subway", image: deepslate, visible: false, description: '-48' },
        { id: "nether", name: "Nether", image: netherrack, visible: false, description: '40' },
        { id: "the_end", name: "The End", image: endstone, visible: false, description: '80' },
    ]);

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
