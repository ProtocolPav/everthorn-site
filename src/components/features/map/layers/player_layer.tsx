import L, { LatLngExpression } from "leaflet";
import { Toggle } from "@/types/map-toggle";
import { LeafletTrackingMarker } from "react-leaflet-tracking-marker";
import playerPin from "/map/pins/steve.png";
import netherPlayerPin from "/map/pins/steve_nether.png";
import endPlayerPin from "/map/pins/steve_end.png";
import { Tooltip as LTooltip } from "react-leaflet";
import { useEverthornMember } from "@/hooks/use-everthorn-member.ts";
import { CircleDashedIcon } from "@phosphor-icons/react";
import { OnlineMember } from "@/api/nexuscore/model";
import {useEffect, useState} from "react";

const SKIN_BASE = "https://persona-secondary.franchise.minecraft-services.net/api/v1.0/profile/xuid";

// Cache to avoid redundant 404 checks across re-renders
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

function makeSkinIcon(xuid: string, className = "rounded"): L.Icon {
    return new L.Icon({
        iconUrl: `${SKIN_BASE}/${xuid}/image/head`,
        iconSize: [24, 24],
        className,
    });
}

// Static fallback icons (no xuid dependency)
const fallbackIcons = {
    overworld: new L.Icon({ iconUrl: playerPin,       iconSize: [24, 24], className: "rounded" }),
    underground: new L.Icon({ iconUrl: playerPin,     iconSize: [24, 24], className: "rounded grayscale contrast-125" }),
    nether: new L.Icon({ iconUrl: netherPlayerPin,    iconSize: [24, 24], className: "rounded" }),
    end: new L.Icon({ iconUrl: endPlayerPin,          iconSize: [24, 24], className: "rounded" }),
};

// Per-player icon cache: xuid → { hasSkin, icons }
const playerIconCache = new Map<string, {
    overworld: L.Icon;
    underground: L.Icon;
    nether: L.Icon;
    end: L.Icon;
}>();

export async function resolvePlayerIcons(xuid: string) {
    if (playerIconCache.has(xuid)) return playerIconCache.get(xuid)!;

    const skinExists = await hasSkin(xuid);

    const icons = skinExists
        ? {
            overworld:   makeSkinIcon(xuid),
            underground: makeSkinIcon(xuid, "rounded grayscale contrast-125"),
            nether:      makeSkinIcon(xuid, "rounded"),
            end:         makeSkinIcon(xuid, "rounded"),
        }
        : fallbackIcons;

    playerIconCache.set(xuid, icons);
    return icons;
}

export function getPlayerIcon(player: OnlineMember, icons: ReturnType<typeof playerIconCache.get>) {
    const set = icons ?? fallbackIcons;
    switch (player.dimension) {
        case "minecraft:overworld":
            return player.location[1] < 40 ? set.underground : set.overworld;
        case "minecraft:nether":
            return set.nether;
        case "minecraft:the_end":
            return set.end;
        default:
            return set.overworld;
    }
}

function get_coordinates(player: OnlineMember, layer: string): LatLngExpression {
    if (layer !== 'nether' && player.dimension === 'minecraft:nether') {
        return [-player.location[2]*8, player.location[0]*8, ]
    }
    else if (layer === 'nether' && player.dimension !== 'minecraft:nether') {
        return [-player.location[2]/8, player.location[0]/8]
    }

    return [-player.location[2], player.location[0]]
}

interface PlayerMarkerProps {
    player: OnlineMember;
    isCM: boolean;
    toggle: Toggle;
    currentlayer: string;
}

function PlayerMarker({ player, isCM, toggle, currentlayer }: PlayerMarkerProps) {
    const [icons, setIcons] = useState(fallbackIcons);

    useEffect(() => {
        let cancelled = false;
        resolvePlayerIcons(player.xuid!).then((resolved) => {
            if (!cancelled) setIcons(resolved as any);
        });
        return () => { cancelled = true; };
    }, [player.xuid]);

    return (
        <LeafletTrackingMarker
            duration={100}
            rotationAngle={0}
            opacity={player.hidden ? (isCM ? 0.6 : 0) : 1}
            icon={getPlayerIcon(player, icons)}
            position={get_coordinates(player, currentlayer)}
            bubblingMouseEvents={true}
            key={`${player.thorny_id}-${toggle.label_visible}-${player.hidden}`}
        >
            <LTooltip
                className="flex gap-1 items-center"
                offset={[0, 10]}
                direction="bottom"
                permanent={toggle.label_visible}
            >
                {player.hidden && isCM ? <CircleDashedIcon weight="bold" /> : null}
                {player.whitelist}
            </LTooltip>
        </LeafletTrackingMarker>
    );
}

export function PlayerLayer ({players, toggle, currentlayer}: {players: OnlineMember[], toggle: Toggle, currentlayer: string}) {
    if (!toggle.visible) return null

    const { isCM } = useEverthornMember();

    const filtered_players = isCM ? players : players.filter(p => !p.hidden)

    return (
        <>
            {filtered_players.map(player => (
                <PlayerMarker player={player} isCM={isCM} toggle={toggle} currentlayer={currentlayer}/>
            ))}
        </>
    )
}