import React from "react";
import { RFeature, RLayerVector } from "rlayers";
import { Point } from "ol/geom";
import type { Style } from "ol/style";
import { CircleDashedIcon } from "@phosphor-icons/react";

import playerPin from "/map/pins/steve.png";
import netherPlayerPin from "/map/pins/steve_nether.png";
import endPlayerPin from "/map/pins/steve_end.png";
import type { Toggle } from "@/types/map-toggle";
import type { OnlineMember } from "@/api/nexuscore/model";
import { useEverthornMember } from "@/hooks/use-everthorn-member.ts";
import { createPlayerIconStyle, loadPlayerIcon } from "@/lib/map-styles.tsx";
import { MapTooltip } from "@/components/features/map/core/tooltip.tsx";
import {
    INTERACTIVE_LAYER_PROPS,
    MARKER_ID,
    useMapInteraction,
} from "@/components/features/map/core/map-interaction-context.tsx";
import { MAP_LAYER_Z } from "@/components/features/map/core/layer-order.ts";

const SKIN_BASE = "https://persona-secondary.franchise.minecraft-services.net/api/v1.0/profile/xuid";

/** Same as `react-leaflet-tracking-marker`'s `duration`. */
const MOVE_DURATION_MS = 100;

// Cache to avoid redundant 404 checks across re-renders
const skinAvailabilityCache = new Map<string, Promise<boolean>>();

function hasSkin(xuid: string): Promise<boolean> {
    let cached = skinAvailabilityCache.get(xuid);
    if (!cached) {
        cached = new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = `${SKIN_BASE}/${xuid}/image/avatar`;
        });
        skinAvailabilityCache.set(xuid, cached);
    }
    return cached;
}

interface PlayerIconSources {
    overworld: string;
    nether: string;
    end: string;
}

const fallbackIcons: PlayerIconSources = {
    overworld: playerPin,
    nether: netherPlayerPin,
    end: endPlayerPin,
};

export async function resolvePlayerIcons(xuid: string): Promise<PlayerIconSources> {
    if (!(await hasSkin(xuid))) return fallbackIcons;
    const head = `${SKIN_BASE}/${xuid}/image/head`;
    return { overworld: head, nether: head, end: head };
}

/** Which icon to show, and whether it gets the underground (grayscale) treatment. */
export function getPlayerIcon(player: OnlineMember, icons: PlayerIconSources): { src: string; underground: boolean } {
    switch (player.dimension) {
        case "minecraft:overworld":
            return { src: icons.overworld, underground: player.location[1] < 40 };
        case "minecraft:nether":
            return { src: icons.nether, underground: false };
        case "minecraft:the_end":
            return { src: icons.end, underground: false };
        default:
            return { src: icons.overworld, underground: false };
    }
}

function get_coordinates(player: OnlineMember, layer: string): [number, number] {
    const [x, , z] = player.location;
    if (layer !== "nether" && player.dimension === "minecraft:nether") return [x * 8, z * 8];
    if (layer === "nether" && player.dimension !== "minecraft:nether") return [x / 8, z / 8];
    return [x, z];
}

/** A point that glides to new coordinates instead of jumping (replaces `react-leaflet-tracking-marker`). */
function useTrackedPoint(x: number, z: number): Point {
    const [point] = React.useState(() => new Point([x, z]));

    React.useEffect(() => {
        const [fromX, fromZ] = point.getCoordinates();
        if (fromX === x && fromZ === z) return;

        const start = performance.now();
        let frame = 0;
        const step = (now: number) => {
            const t = Math.min(1, (now - start) / MOVE_DURATION_MS);
            point.setCoordinates([fromX + (x - fromX) * t, fromZ + (z - fromZ) * t]);
            if (t < 1) frame = requestAnimationFrame(step);
        };
        frame = requestAnimationFrame(step);
        return () => cancelAnimationFrame(frame);
    }, [point, x, z]);

    return point;
}

function usePlayerStyle(src: string, underground: boolean, opacity: number, fallback: string): Style {
    const [img, setImg] = React.useState<HTMLCanvasElement | null>(null);

    React.useEffect(() => {
        // Keep showing the previous icon until the new one is ready
        let cancelled = false;
        loadPlayerIcon(src, underground)
            .then((canvas) => {
                if (!cancelled) setImg(canvas);
            })
            .catch(() => undefined);
        return () => {
            cancelled = true;
        };
    }, [src, underground]);

    return React.useMemo(() => createPlayerIconStyle(img ?? fallback, opacity), [img, fallback, opacity]);
}

const dimensionLabel: Record<string, string> = {
    "minecraft:overworld": "O",
    "minecraft:nether": "N",
    "minecraft:the_end": "E",
};

interface PlayerMarkerProps {
    player: OnlineMember;
    isCM: boolean;
    toggle: Toggle;
    currentlayer: string;
}

function PlayerMarker({ player, isCM, toggle, currentlayer }: PlayerMarkerProps) {
    const [icons, setIcons] = React.useState(fallbackIcons);
    const { hoveredId } = useMapInteraction();

    React.useEffect(() => {
        if (!player.xuid) return;
        let cancelled = false;
        void resolvePlayerIcons(player.xuid).then((resolved) => {
            if (!cancelled) setIcons(resolved);
        });
        return () => {
            cancelled = true;
        };
    }, [player.xuid]);

    const id = `player:${player.thorny_id}`;
    const [x, z] = get_coordinates(player, currentlayer);
    const point = useTrackedPoint(x, z);
    const properties = React.useMemo(() => ({ [MARKER_ID]: id }), [id]);

    const { src, underground } = getPlayerIcon(player, icons);
    const style = usePlayerStyle(
        src,
        underground,
        player.hidden ? 0.6 : 1,
        getPlayerIcon(player, fallbackIcons).src,
    );

    return (
        <>
            <RFeature geometry={point} style={style} properties={properties} />

            <MapTooltip
                visible={(toggle.label_visible ?? false) || hoveredId === id}
                follow={point}
                positioning="top-center"
                // Leaflet: direction "bottom", offset [0, 10], plus the 6px tooltip margin
                offset={[0, 16]}
                className="flex flex-row gap-1 items-center"
            >
                {player.hidden && isCM ? <CircleDashedIcon weight="bold" className="size-3" /> : null}
                {player.dimension.split(":")[1] !== currentlayer && (
                    <span>({dimensionLabel[player.dimension ?? ""] ?? "?"})</span>
                )}
                {player.whitelist}
            </MapTooltip>
        </>
    );
}

export function PlayerLayer({
    players,
    toggle,
    currentlayer,
}: {
    players: OnlineMember[];
    toggle: Toggle;
    currentlayer: string;
}) {
    const { isCM } = useEverthornMember();

    if (!toggle.visible) return null;

    // Hidden players are only shown (faded) to CMs
    const filtered_players = isCM ? players : players.filter((p) => !p.hidden);

    return (
        <RLayerVector zIndex={MAP_LAYER_Z.players} properties={INTERACTIVE_LAYER_PROPS}>
            {filtered_players.map((player) => (
                <PlayerMarker
                    key={player.thorny_id}
                    player={player}
                    isCM={isCM}
                    toggle={toggle}
                    currentlayer={currentlayer}
                />
            ))}
        </RLayerVector>
    );
}
