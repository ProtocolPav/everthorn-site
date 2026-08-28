import { useEffect, useState } from "react";
import { RLayerVector, RFeature } from "rlayers";
import { RStyle, RIcon } from "rlayers/style";
import { Point } from "ol/geom";
import { CircleDashedIcon } from "@phosphor-icons/react";

import playerPin from "/map/pins/steve.png";
import netherPlayerPin from "/map/pins/steve_nether.png";
import endPlayerPin from "/map/pins/steve_end.png";

import type { Toggle } from "@/types/map-toggle";
import type { OnlineMember } from "@/api/nexuscore/model";
import { useEverthornMember } from "@/hooks/use-everthorn-member";
import { MapTooltip } from "@/components/features/map/core/tooltip";

const SKIN_BASE = "https://persona-secondary.franchise.minecraft-services.net/api/v1.0/profile/xuid";

// Cache skin availability checks to avoid redundant network requests
const skinAvailabilityCache = new Map<string, boolean>();

function hasSkin(xuid: string): Promise<boolean> {
    if (skinAvailabilityCache.has(xuid)) {
        return Promise.resolve(skinAvailabilityCache.get(xuid)!);
    }

    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            skinAvailabilityCache.set(xuid, true);
            resolve(true);
        };
        img.onerror = () => {
            skinAvailabilityCache.set(xuid, false);
            resolve(false);
        };
        img.src = `${SKIN_BASE}/${xuid}/image/avatar`;
    });
}

// Fallback icon paths
const fallbackIcons = {
    overworld: playerPin,
    nether: netherPlayerPin,
    end: endPlayerPin,
};

// Per-player resolved icon source cache
const playerIconCache = new Map<string, {
    overworld: string;
    nether: string;
    end: string;
    isCustom: boolean;
}>();

export async function resolvePlayerIcons(xuid: string) {
    if (playerIconCache.has(xuid)) return playerIconCache.get(xuid)!;

    const skinExists = await hasSkin(xuid);
    const headUrl = `${SKIN_BASE}/${xuid}/image/head`;

    const icons = skinExists
        ? {
            overworld: headUrl,
            nether: headUrl,
            end: headUrl,
            isCustom: true,
        }
        : {
            overworld: fallbackIcons.overworld,
            nether: fallbackIcons.nether,
            end: fallbackIcons.end,
            isCustom: false,
        };

    playerIconCache.set(xuid, icons);
    return icons;
}

function getIconSrc(
    player: OnlineMember,
    resolvedIcons?: ReturnType<typeof playerIconCache.get>
): { src: string; isCustom: boolean } {
    const isCustom = resolvedIcons?.isCustom ?? false;

    switch (player.dimension) {
        case "minecraft:overworld":
            return {
                src: resolvedIcons?.overworld ?? fallbackIcons.overworld,
                isCustom,
            };
        case "minecraft:nether":
            return {
                src: resolvedIcons?.nether ?? fallbackIcons.nether,
                isCustom,
            };
        case "minecraft:the_end":
            return {
                src: resolvedIcons?.end ?? fallbackIcons.end,
                isCustom,
            };
        default:
            return {
                src: resolvedIcons?.overworld ?? fallbackIcons.overworld,
                isCustom,
            };
    }
}

function getCoords(player: OnlineMember, layer: string): [number, number] {
    const [x, , z] = player.location;
    if (layer !== "nether" && player.dimension === "minecraft:nether") {
        return [x * 8, z * 8];
    }
    if (layer === "nether" && player.dimension !== "minecraft:nether") {
        return [x / 8, z / 8];
    }
    return [x, z];
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
    const [icons, setIcons] = useState(() =>
        player.xuid ? playerIconCache.get(player.xuid) : undefined
    );

    useEffect(() => {
        if (!player.xuid) return;

        let cancelled = false;
        resolvePlayerIcons(player.xuid).then((resolved) => {
            if (!cancelled) setIcons(resolved);
        });

        return () => {
            cancelled = true;
        };
    }, [player.xuid]);

    const [x, z] = getCoords(player, currentlayer);
    const opacity = player.hidden ? (isCM ? 0.6 : 0) : 1;
    if (opacity === 0) return null;

    const { src, isCustom } = getIconSrc(player, icons);
    // Custom head renders at ~128x128 (scale 0.25 -> 32px), fallback pins render at ~80x80 (scale 0.4 -> 32px)
    const iconScale = isCustom ? 0.75 : 0.3;

    const playerDimSimple = player.dimension?.split(":")[1];
    const showDimBadge = playerDimSimple && playerDimSimple !== currentlayer;

    return (
        <RFeature
            key={`${player.thorny_id}-${toggle.label_visible}-${player.hidden}`}
            geometry={new Point([x, z])}
        >
            <RStyle>
                <RIcon
                    src={src}
                    anchor={[0.5, 0.5]}
                    anchorXUnits="fraction"
                    anchorYUnits="fraction"
                    scale={iconScale}
                    opacity={opacity}
                />
            </RStyle>

            <MapTooltip
                label_visible={toggle.label_visible ?? false}
                positioning="bottom-center"
                offset={[0, 35]}
                className="flex gap-1 items-center whitespace-nowrap"
            >
                {player.hidden && isCM ? (
                    <CircleDashedIcon weight="bold" className="size-3" />
                ) : null}
                {showDimBadge && (
                    <span>({dimensionLabel[player.dimension ?? ""] ?? "?"})</span>
                )}
                <span>{player.whitelist}</span>
            </MapTooltip>
        </RFeature>
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

    const filteredPlayers = isCM ? players : players.filter((p) => !p.hidden);
    if (filteredPlayers.length === 0) return null;

    return (
        <RLayerVector>
            {filteredPlayers.map((player) => (
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