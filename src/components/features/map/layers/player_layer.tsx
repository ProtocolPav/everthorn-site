import {Player} from "@/types/online-players";
import L, {LatLngExpression} from "leaflet";
import {Toggle} from "@/types/map-toggle";
import {LeafletTrackingMarker} from "react-leaflet-tracking-marker";
import playerPin from "/map/pins/steve.png";
import netherPlayerPin from "/map/pins/steve_nether.png"
import endPlayerPin from "/map/pins/steve_end.png"
import {Tooltip as LTooltip} from "react-leaflet";
import {useEverthornMember} from "@/hooks/use-everthorn-member.ts";
import {CircleDashedIcon} from "@phosphor-icons/react";

const player_icon = new L.Icon({
    iconUrl: 'https://persona-secondary.franchise.minecraft-services.net/api/v1.0/profile/xuid/2535407687256024/image/head',
    iconSize: [24, 24],
    className: 'rounded'
});

const underground_player_icon = new L.Icon({
    iconUrl: playerPin,
    iconSize: [24, 24],
    className: "rounded grayscale contrast-125"
});

const nether_player_icon = new L.Icon({
    iconUrl: netherPlayerPin,
    iconSize: [24, 24],
    className: 'rounded'
});

const end_player_icon = new L.Icon({
    iconUrl: endPlayerPin,
    iconSize: [24, 24],
    className: 'rounded'
});

function get_icon(player: Player) {
    switch (player.dimension) {
        case 'minecraft:overworld':
            if (player.location[1] < 40) return underground_player_icon
            return player_icon
        case 'minecraft:nether':
            return nether_player_icon
        case 'minecraft:the_end':
            return end_player_icon
    }
}

function get_coordinates(player: Player, layer: string): LatLngExpression {
    if (layer !== 'nether' && player.dimension === 'minecraft:nether') {
        return [-player.location[2]*8, player.location[0]*8, ]
    }
    else if (layer === 'nether' && player.dimension !== 'minecraft:nether') {
        return [-player.location[2]/8, player.location[0]/8]
    }

    return [-player.location[2], player.location[0]]
}

export function PlayerLayer ({players, toggle, currentlayer}: {players: Player[], toggle: Toggle, currentlayer: string}) {
    if (!toggle.visible) return null

    const { isCM } = useEverthornMember();

    const filtered_players = isCM ? players : players.filter(p => !p.hidden)

    return (
        <>
            {filtered_players.map(player => (
                <LeafletTrackingMarker
                    duration={100}
                    rotationAngle={0}
                    opacity={player.hidden ? (isCM ? 0.6 : 0) : 1}
                    icon={get_icon(player)}
                    position={get_coordinates(player, currentlayer)}
                    bubblingMouseEvents={true}
                    key={`${player.thorny_id}-${toggle.label_visible}-${player.hidden}`}
                >
                    <LTooltip className={'flex gap-1 items-center'} offset={[0, 10]} direction={'bottom'} permanent={toggle.label_visible}>
                        {player.hidden && isCM ? <CircleDashedIcon weight={'bold'}/> : null } {player.whitelist}
                    </LTooltip>
                </LeafletTrackingMarker>
            ))}
        </>
    )
}