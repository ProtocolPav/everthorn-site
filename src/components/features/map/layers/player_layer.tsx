import { Point } from "ol/geom";
import { RLayerVector, RFeature, ROverlay, RStyle } from "rlayers";
import playerPin from "/map/pins/steve.png";
import netherPlayerPin from "/map/pins/steve_nether.png";
import endPlayerPin from "/map/pins/steve_end.png";
import { Toggle } from "@/types/map-toggle";
import { useEverthornMember } from "@/hooks/use-everthorn-member.ts";
import { CircleDashedIcon } from "@phosphor-icons/react";
import { OnlineMember } from "@/api/nexuscore/model";

const HEAD_URL = "https://persona-secondary.franchise.minecraft-services.net/api/v1.0/profile/xuid/2535407687256024/image/head";

function getIconSrc(player: OnlineMember): string {
    switch (player.dimension) {
        case "minecraft:overworld":
            if (player.location[1] < 40) return playerPin;
            return HEAD_URL;
        case "minecraft:nether":
            return netherPlayerPin;
        case "minecraft:the_end":
            return endPlayerPin;
        default:
            return HEAD_URL;
    }
}

function getCoordinates(player: OnlineMember, layer: string): [number, number] {
    if (layer !== "nether" && player.dimension === "minecraft:nether") {
        return [player.location[0] * 8, player.location[2] * 8];
    } else if (layer === "nether" && player.dimension !== "minecraft:nether") {
        return [player.location[0] / 8, player.location[2] / 8];
    }
    return [player.location[0], player.location[2]];
}

export function PlayerLayer({ players, toggle, currentlayer }: { players: OnlineMember[]; toggle: Toggle; currentlayer: string }) {
    if (!toggle.visible) return null;

    const { isCM } = useEverthornMember();

    const filtered_players = isCM ? players : players.filter((p) => !p.hidden);

    if (filtered_players.length === 0) return null;

    return (
        <RLayerVector zIndex={20}>
            {filtered_players.map((player) => {
                const src = getIconSrc(player);
                const opacity = player.hidden ? (isCM ? 0.6 : 0) : 1;
                if (opacity === 0) return null;
                const coords = getCoordinates(player, currentlayer);

                return (
                    <RFeature key={`${player.thorny_id}-${toggle.label_visible}-${player.hidden}`} geometry={new Point(coords)}>
                        <RStyle.RStyle>
                            <RStyle.RIcon
                                src={src}
                                anchor={[0.5, 0.5]}
                                // @ts-ignore
                                opacity={opacity}
                            />
                        </RStyle.RStyle>

                        {toggle.label_visible && (
                            <ROverlay positioning="top-center" offset={[0, 14]} className="pointer-events-none">
                                <div
                                    className="flex gap-1 items-center bg-card/90 backdrop-blur-sm text-card-foreground border shadow-sm px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap"
                                    style={{ opacity }}
                                >
                                    {player.hidden && isCM ? <CircleDashedIcon weight="bold" className="size-3 text-muted-foreground" /> : null}
                                    <span className="font-minecraft-seven tracking-wide">{player.whitelist}</span>
                                </div>
                            </ROverlay>
                        )}
                    </RFeature>
                );
            })}
        </RLayerVector>
    );
}
