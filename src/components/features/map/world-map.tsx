"use client";

import React from "react";
import {MapContainer, useMap} from "react-leaflet";
import L from "leaflet";
import {useProjects} from '@/hooks/use-projects'
import {Project} from "@/types/projects";

import {usePlayers, Player} from "@/hooks/use-players";
import {PlayerLayer} from "@/components/features/map/layers/player_layer";
import {ProjectLayer} from "@/components/features/map/layers/project_layer";
import ControlBar from "@/components/features/map/controls";
import {Toggle} from "@/types/map-toggle";

import project from "../../../../public/map/ui/project.png";
import player from "../../../../public/map/ui/steve.png";
import farm from "../../../../public/map/ui/farm.png"
import relic from "../../../../public/map/ui/relic.png"
import shop from "../../../../public/map/ui/shop.png"
import grass_block from '../../../../public/map/ui/grass_block.png'
import netherrack from '../../../../public/map/ui/netherrack.png'
import deepslate from '../../../../public/map/ui/deepslate.png'
import endstone from '../../../../public/map/ui/endstone.png'

import {LeafletRightClickProvider} from "react-leaflet-rightclick";
import LeafletContextMenu from "@/components/features/map/contextmenu";
import {PinLayer} from "@/components/features/map/layers/pin_layer";
import {usePins} from "@/hooks/use-pins";

import 'leaflet/dist/leaflet.css'
import CustomTileLayerComponent from "@/components/features/map/tile-layer";
import "@luomus/leaflet-smooth-wheel-zoom";

// MAP COORDINATE SWITCHING
// MINECRAFT COORDINATES: [X, Y, Z]
// LEAFLET SHOULD BE A BIT DIFFERENT: [-Z, X]

export default function WorldMap()  {
    const position: [number, number] = [0, 0]; // Default map center

    const [pintoggles, setpintoggles]: [Toggle[], Function] = React.useState([
        {id: 'projects', name: 'Projects', image: project, visible: true, label_visible: true},
        {id: 'players', name: 'Players', image: player, visible: true, label_visible: true},
        {id: 'relics', name: 'Landmarks', image: relic, visible: true, label_visible: false},
        {id: 'farms', name: 'Farms', image: farm, visible: false, label_visible: false},
        {id: 'shops', name: 'Shops', image: shop, visible: false, label_visible: false},
    ])

    function update_pins(id: string, toggle_label?: boolean) {
        const new_pins = pintoggles.map((pin) => {
            if (pin.id === id) {
                return {
                    id: pin.id,
                    visible: toggle_label ? pin.visible : !pin.visible,
                    label_visible: toggle_label ? !pin.label_visible : pin.label_visible,
                    name: pin.name,
                    icon: pin.icon,
                    image: pin.image};
            } else {
                return pin
            }
        })

        setpintoggles(new_pins);
    }

    const [layertoggles, setlayertoggles]: [Toggle[], Function] = React.useState([
        {id: 'overworld', name: 'Overworld', image: grass_block, visible: true},
        {id: 'subway', name: 'Subway (y-48)', image: deepslate, visible: false},
        {id: 'nether', name: 'Nether (y40)', image: netherrack, visible: false},
        {id: 'the_end', name: 'The End', image: endstone, visible: false},
    ])

    function update_layers(id: string) {
        const new_layers = layertoggles.map((layer) => {
            if (layer.id === id) {
                return {id: layer.id, visible: true, name: layer.name, icon: layer.icon, image: layer.image};
            } else {
                return {id: layer.id, visible: false, name: layer.name, icon: layer.icon, image: layer.image};
            }
        })

        setlayertoggles(new_layers);
    }

    const { projects, isLoading, isError } = useProjects();
    if (isError) {throw Error()}
    const all_projects: Project[] = isLoading ? [] : projects

    const { players, isLoading: isLoading2, isError: isError2 } = usePlayers('611008530077712395');
    const all_players: Player[] = (isLoading2 || isError2) ? [] : players

    const { pins, isLoading: isLoading3, isError: isError3 } = usePins();
    const farm_pins = (isLoading3 || isError3) ? [] : pins?.filter(pin => pin.pin_type === 'farm');
    const relic_pins = (isLoading3 || isError3) ? [] : pins?.filter(pin => pin.pin_type === 'relic');
    const shop_pins = (isLoading3 || isError3) ? [] : pins?.filter(pin => pin.pin_type === 'shop');

    return (
        <LeafletRightClickProvider>
            <MapContainer
                center={position}
                zoom={0}
                style={{width: "100%", height: "100%"}}
                className={'z-0 flex'}
                zoomControl={false}
                crs={L.CRS.Simple}
                maxBounds={[[2200, 2200], [-2200, -2200]]}
                maxBoundsViscosity={0.03}
                trackResize={true}
                attributionControl={false}

                scrollWheelZoom={false}
                // @ts-ignore
                smoothWheelZoom={true}
                smoothSensitivity={5}
            >
                <CustomTileLayerComponent layer={layertoggles.filter((toggle) => toggle.visible)[0]['id']}/>
                <ControlBar pins={pintoggles} update_pins={update_pins} layers={layertoggles} update_layers={update_layers} online_players={players?.length} />
                <LeafletContextMenu/>

                {/* Projects */}
                <ProjectLayer
                    all_projects={all_projects}
                    toggle={pintoggles[0]}
                    currentlayer={layertoggles.filter((toggle) => toggle.visible)[0]['id']}
                    layer={'overworld'}
                />

                <ProjectLayer
                    all_projects={all_projects}
                    toggle={pintoggles[0]}
                    currentlayer={layertoggles.filter((toggle) => toggle.visible)[0]['id']}
                    layer={'nether'}
                />

                <ProjectLayer
                    all_projects={all_projects}
                    toggle={pintoggles[0]}
                    currentlayer={layertoggles.filter((toggle) => toggle.visible)[0]['id']}
                    layer={'the_end'}
                />

                {/* Pins */}
                <PinLayer
                    pins={relic_pins}
                    toggle={pintoggles[2]}
                    currentlayer={layertoggles.filter((toggle) => toggle.visible)[0]['id']}
                />
                <PinLayer
                    pins={farm_pins}
                    toggle={pintoggles[3]}
                    currentlayer={layertoggles.filter((toggle) => toggle.visible)[0]['id']}
                />
                <PinLayer
                    pins={shop_pins}
                    toggle={pintoggles[4]}
                    currentlayer={layertoggles.filter((toggle) => toggle.visible)[0]['id']}
                />

                {/* Players */}
                <PlayerLayer
                    players={all_players}
                    toggle={pintoggles[1]}
                    currentlayer={layertoggles.filter((toggle) => toggle.visible)[0]['id']}
                />

            </MapContainer>
        </LeafletRightClickProvider>

    );
};
