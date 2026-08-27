import { RLayerVector, RFeature } from "rlayers";
import { RStyle, RIcon } from "rlayers/style";
import { Point } from "ol/geom";

import playerPin from "/map/pins/steve.png";
import netherPlayerPin from "/map/pins/steve_nether.png";
import endPlayerPin from "/map/pins/steve_end.png";
import type { Toggle } from "@/types/map-toggle";
import { useEverthornMember } from "@/hooks/use-everthorn-member";
import { CircleDashedIcon } from "@phosphor-icons/react";
import type { OnlineMember } from "@/api/nexuscore/model";
import { MapTooltip } from "@/components/features/map/core/tooltip";

// Native steve is 80×80, Leaflet used 24×24 (0.3× scale).
// 0.3 for nromal icons. normal icons should change to be 32x32 size
const PLAYER_ICON_SCALE = 0.75;

const PLAYER_ICON_SRC = "https://persona-secondary.franchise.minecraft-services.net/api/v1.0/profile/xuid/2535407687256024/image/head";

function getIconSrc(player: OnlineMember): string {
    switch (player.dimension) {
        case "minecraft:overworld":
            if (player.location[1] < 40) return playerPin;
            return PLAYER_ICON_SRC;
        case "minecraft:nether":
            return netherPlayerPin;
        case "minecraft:the_end":
            return endPlayerPin;
        default:
            return playerPin;
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

    const filtered_players = isCM ? players : players.filter((p) => !p.hidden);

    if (filtered_players.length === 0) return null;

    return (
        <RLayerVector>
            {filtered_players.map((player) => {
                const [x, z] = getCoords(player, currentlayer);
                const opacity = player.hidden ? (isCM ? 0.6 : 0) : 1;
                // Skip fully transparent (non-CM hidden)
                if (opacity === 0) return null;

                return (
                    <RFeature
                        key={`${player.thorny_id}-${toggle.label_visible}-${player.hidden}`}
                        geometry={new Point([x, z])}
                    >
                        <RStyle>
                            <RIcon
                                src={getIconSrc(player)}
                                anchor={[0.5, 0.5]}
                                anchorXUnits="fraction"
                                anchorYUnits="fraction"
                                scale={PLAYER_ICON_SCALE}
                                opacity={opacity}
                            />
                        </RStyle>

                        <MapTooltip
                            label_visible={toggle.label_visible ?? false}
                            positioning="bottom-center"
                            offset={[0, 35]}
                            className="flex gap-1 items-center"
                        >
                            {player.hidden && isCM ? (
                                <CircleDashedIcon weight="bold" className="size-3" />
                            ) : null}
                            {player.whitelist}
                        </MapTooltip>
                    </RFeature>
                );
            })}
        </RLayerVector>
    );
}
