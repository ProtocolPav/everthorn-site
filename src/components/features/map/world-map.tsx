import React, { useEffect, useRef } from "react";
import { MapContainer, useMap } from "react-leaflet";
import L from "leaflet";
import { useSearch } from "@tanstack/react-router";

import { ControlBar } from "@/components/features/map/control-bar";
import { CustomTileLayerComponent } from "@/components/features/map/tile-layer";
import { useToggleManager } from "@/components/features/map/toggle-manager";

import { usePlayers } from "@/hooks/use-players";
import {useProjects} from "@/hooks/use-project.ts";
import {Project} from "@/types/projects";
import {usePins} from "@/hooks/use-pin.ts";
import {Pin} from "@/types/pins";
import {PlayerLayer} from "@/components/features/map/layers/player_layer.tsx";
import {Player} from "@/types/online-players";
import ContextMenu from "@/components/features/map/context-menu.tsx";
import {LeafletRightClickProvider} from "react-leaflet-rightclick";
import {RegionalLayerManager} from "@/components/features/map/regional-layer-manager.tsx";
import {RegionLayer} from "@/components/features/map/layers/region_layer.tsx";

interface MapProps {
    editable: boolean;
}

// Component to handle map navigation from URL params
function MapNavigator({ x, z, zoom }: { x?: number; z?: number; zoom?: number }) {
    const map = useMap();
    const hasNavigated = useRef(false);

    useEffect(() => {
        if (!hasNavigated.current && x !== undefined && z !== undefined) {
            // Convert Minecraft coordinates to Leaflet coordinates
            // In Leaflet: lat = -z, lng = x
            const lat = -z;
            const lng = x;

            // Fly to the coordinates with animation
            map.flyTo([lat, lng], zoom ?? 1, {
                duration: 1.5,
                easeLinearity: 0.5
            });

            hasNavigated.current = true;
        }
    }, [map, x, z, zoom]);

    return null;
}

export default function WorldMap({ editable = false }: MapProps) {
    // Get URL search parameters
    const searchParams = useSearch({ strict: false });

    // Parse coordinates from URL
    const urlX = searchParams?.x ? Number(searchParams.x) : undefined;
    const urlZ = searchParams?.z ? Number(searchParams.z) : undefined;
    const urlZoom = searchParams?.zoom ? Number(searchParams.zoom) : undefined;

    // Set initial position based on URL params or default
    const position: [number, number] = urlX !== undefined && urlZ !== undefined ? [-urlZ, urlX] : [0, 0];

    const { pintoggles, layertoggles, update_pins, update_layers } = useToggleManager();

    const { data: players, isLoading: playersLoading, isError: playersError } = usePlayers("611008530077712395");
    if (playersError) {throw Error()}
    const all_players: Player[] = playersLoading || !players ? [] : players

    const { data: projects, isLoading: projectsLoading, isError: projectsError } = useProjects();
    if (projectsError) {throw Error()}
    const all_projects: Project[] = projectsLoading || !projects ? [] : projects

    const { data: pins, isLoading: pinsLoading, isError: pinsError } = usePins();
    if (pinsError) {throw Error()}
    const all_pins: Pin[] = pinsLoading || !pins ? [] : pins

    const online_players = players?.length ?? 0;

    const activeLayerId =
        layertoggles.filter((toggle) => toggle.visible)[0]?.id || "overworld";

    return (
        <LeafletRightClickProvider>
            <MapContainer
                scrollWheelZoom={true}
                center={position}
                zoom={urlZoom ?? 0}
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

                <MapNavigator x={urlX} z={urlZ} zoom={urlZoom} />

                <ControlBar
                    pins={pintoggles}
                    update_pins={update_pins}
                    layers={layertoggles}
                    update_layers={update_layers}
                    online_players={online_players}
                />
                <ContextMenu/>

                <PlayerLayer
                    players={all_players}
                    toggle={pintoggles[1]}
                    currentlayer={layertoggles.filter((toggle) => toggle.visible)[0]['id']}
                />

                <RegionLayer
                    toggle={pintoggles[5]}
                />

                <RegionalLayerManager
                    projects={all_projects}
                    pins={all_pins}
                    currentLayerId={activeLayerId}
                    toggles={{
                        projects: pintoggles[0],
                        landmarks: pintoggles[2],
                        farms: pintoggles[3],
                        shops: pintoggles[4]
                    }}
                />
            </MapContainer>
        </LeafletRightClickProvider>
    );
}
