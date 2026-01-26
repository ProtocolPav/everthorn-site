"use client";

import React from "react";
import {MapContainer, Tooltip as LTooltip, Popup, useMap, ZoomControl, Marker} from "react-leaflet";
import L, {TileLayerOptions} from "leaflet";
import {useProjects} from '@/hooks/use-projects'
import {Project} from "@/types/projects";
import {ProjectLayer} from "./project_layer";
import {PinLayer} from "./pin_layer";

import project from "public/map/ui/project.png";
import player from "public/map/ui/steve.png";
import farm from "public/map/ui/farm.png"
import relic from "public/map/ui/relic.png"
import shop from "public/map/ui/shop.png"

import {LeafletRightClickProvider} from "react-leaflet-rightclick";
import LeafletContextMenu from "@/components/features/map/contextmenu";
import {usePins} from "@/hooks/use-pins";

import 'leaflet/dist/leaflet.css'
import {Toggle} from "@/types/map-toggle";
import {Pin} from "@/types/pins";

// Extend L.TileLayer for Custom Tile URL Generation
class CustomTileLayer extends L.TileLayer {
    layer: string

    constructor(layer: string, options: TileLayerOptions) {
        super("", options);
        this.layer = layer;
    }

    getTileUrl(coords: L.Coords): string {
        const { x, y: z, z: zoom } = coords;

        let tile_url = `/amethyst/maps/${this.layer}/${zoom}/${Math.floor(x / 10)}/${Math.floor(z / 10)}/${x}/${z}`

        if (process.env.NEXT_PUBLIC_DEV === 'true') {
            tile_url = `/map/tiles/zoom.${zoom}/${Math.floor(x / 10)}/${Math.floor(z / 10)}/tile.${x}.${z}.png`
        }

        return tile_url
    }
}

// React Component to Add Custom Tile Layer
function CustomTileLayerComponent ({layer}: {layer: string}) {
    const map = useMap();

    React.useEffect(() => {
        // Add the custom Tile Layer to the map
        const customTileLayer = new CustomTileLayer(layer, {
            maxNativeZoom: 2,
            maxZoom: 6,
            minZoom:-5,
            updateInterval:10,
            keepBuffer:50,
        });
        customTileLayer.addTo(map);

        return () => {
            map.removeLayer(customTileLayer);
        };
    }, [map, layer]);

    return null;
}

export default function WorldMap({editMode}: { editMode: boolean})  {
    const position: [number, number] = [0, 0]; // Default map center

    const { projects, isLoading, isError } = useProjects();
    if (isError) {throw Error()}
    const all_projects: Project[] = isLoading ? [] : projects

    const { pins, isLoading: isLoading3, isError: isError3 } = usePins();
    const all_pins: Pin[] = isLoading ? [] : pins

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
            >
                <CustomTileLayerComponent layer={'overworld'}/>
                <LeafletContextMenu/>

                <ProjectLayer all_projects={all_projects} editMode={editMode}/>
                <PinLayer pins={all_pins} editMode={editMode}/>

            </MapContainer>
        </LeafletRightClickProvider>

    );
};
