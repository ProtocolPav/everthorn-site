import React, { useEffect, useRef } from "react";
import { useRLayersComponent } from "rlayers";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Feature } from "ol";
import { Point } from "ol/geom";
import { Style, Icon, Text, Fill, Stroke } from "ol/style";
import playerPin from "/map/pins/steve.png";
import netherPlayerPin from "/map/pins/steve_nether.png";
import endPlayerPin from "/map/pins/steve_end.png";
import type { Toggle } from "@/types/map-toggle";
import type { OnlineMember } from "@/api/nexuscore/model";
import { useEverthornMember } from "@/hooks/use-everthorn-member.ts";

const PLAYER_SIZE = 24;

// Player head URL for overworld (above ground)
function getPlayerIconUrl(player: OnlineMember): string {
    switch (player.dimension) {
        case "minecraft:nether": return netherPlayerPin;
        case "minecraft:the_end": return endPlayerPin;
        default:
            if (player.location[1] < 40) return playerPin; // underground → greyscale done via canvas filter below
            // Use Minecraft persona head
            return `https://persona-secondary.franchise.minecraft-services.net/api/v1.0/profile/xuid/2535407687256024/image/head`;
    }
}

function isUnderground(player: OnlineMember): boolean {
    return player.dimension === "minecraft:overworld" && player.location[1] < 40;
}

function buildPlayerStyle(player: OnlineMember, labelVisible: boolean): Style[] {
    const iconSrc = getPlayerIconUrl(player);
    const underground = isUnderground(player);

    const imageStyle = new Icon({
        src: iconSrc,
        width: PLAYER_SIZE,
        height: PLAYER_SIZE,
        opacity: underground ? 0.5 : 1,
        // OL doesn't support CSS filters natively; opacity is best we can do declaratively
    });

    const styles: Style[] = [new Style({ image: imageStyle })];

    if (labelVisible) {
        styles.push(
            new Style({
                text: new Text({
                    text: player.whitelist,
                    offsetY: PLAYER_SIZE,
                    font: "12px sans-serif",
                    fill: new Fill({ color: "#ffffff" }),
                    stroke: new Stroke({ color: "#000000", width: 2 }),
                }),
            })
        );
    }

    return styles;
}

function getPlayerCoord(player: OnlineMember, layer: string): [number, number] {
    if (layer !== "nether" && player.dimension === "minecraft:nether") {
        return [player.location[0] * 8, -player.location[2] * 8];
    } else if (layer === "nether" && player.dimension !== "minecraft:nether") {
        return [player.location[0] / 8, -player.location[2] / 8];
    }
    return [player.location[0], -player.location[2]];
}

export function PlayerLayer({ players, toggle, currentlayer }: { players: OnlineMember[]; toggle: Toggle; currentlayer: string }) {
    const { map } = useRLayersComponent();
    const { isCM } = useEverthornMember();
    const layerRef = useRef<VectorLayer<VectorSource> | null>(null);

    useEffect(() => {
        if (!map) return;

        if (layerRef.current) map.removeLayer(layerRef.current);

        if (!toggle.visible) {
            layerRef.current = null;
            return;
        }

        const filtered = isCM ? players : players.filter(p => !p.hidden);

        const source = new VectorSource();
        filtered.forEach(player => {
            const coord = getPlayerCoord(player, currentlayer);
            const feature = new Feature({
                geometry: new Point(coord),
                player,
            });
            feature.setStyle(buildPlayerStyle(player, toggle.label_visible));
            if (player.hidden && isCM) {
                // Visually dim hidden players for CMs
                feature.setOpacity?.(0.6);
            }
            source.addFeature(feature);
        });

        const layer = new VectorLayer({ source, zIndex: 20 });
        map.addLayer(layer);
        layerRef.current = layer;

        return () => {
            map.removeLayer(layer);
        };
    }, [map, players, toggle.visible, toggle.label_visible, currentlayer, isCM]);

    return null;
}
