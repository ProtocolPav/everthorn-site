import React, { useEffect, useRef } from "react";
import { MapContainer, useMap } from "react-leaflet";
import L from "leaflet";
import { useSearch } from "@tanstack/react-router";

import { ControlBar } from "@/components/features/map/control-bar";
import { CustomTileLayerComponent } from "@/components/features/map/tile-layer";
import type { Toggle } from "@/types/map-toggle";

import { usePlayers } from "@/hooks/use-players";
import { DEFAULT_LAYERS, DEFAULT_PINS } from "@/config/map-defaults.ts";
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

export const createClusterCustomIcon = (cluster: any) => {
    const count = cluster.getChildCount();

    // Grass
    let c = {
        bg: '#74a753',
        border: '#092B00',
        light: 'rgba(255,255,255,0.3)',
        dark: 'rgba(0,0,0,0.25)'
    };

    // Diamond
    if (count >= 30) {
        c = {
            bg: '#64efff',
            border: '#005954',
            light: 'rgba(255,255,255,0.5)',
            dark: 'rgba(0,0,0,0.2)'
        };
    }

    // Gold
    else if (count >= 10) {
        c = {
            bg: '#f0c534',
            border: '#594A00',
            light: 'rgba(255,255,255,0.4)',
            dark: 'rgba(0,0,0,0.2)'
        };
    }

    const style = `
        width: 100%; 
        height: 100%;
        background-color: ${c.bg};
        border: 2px solid ${c.border};
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-size: 17px;
        line-height: 1;
        text-shadow: 1px 1px 0px #696969;
        box-shadow: inset 2px 2px 0px ${c.light}, inset -2px -2px 0px ${c.dark};
        user-select: none;
        cursor: pointer;
    `.replace(/\n/g, '');

    return L.divIcon({
        html: `<div style="${style}" class="font-minecraft-ten">${count}</div>`,
        className: '',
        iconSize: L.point(32, 32),
        iconAnchor: [16, 16],
    });
};

export default function WorldMap() {
    // Get URL search parameters
    const searchParams = useSearch({ strict: false });

    // Parse coordinates from URL
    const urlX = searchParams?.x ? Number(searchParams.x) : undefined;
    const urlZ = searchParams?.z ? Number(searchParams.z) : undefined;
    const urlZoom = searchParams?.zoom ? Number(searchParams.zoom) : undefined;

    // Set initial position based on URL params or default
    const position: [number, number] =
        urlX !== undefined && urlZ !== undefined
            ? [-urlZ, urlX]  // lat = -z, lng = x
            : [0, 0];

    // Load initial state from localStorage or use defaults
    const [pintoggles, setpintoggles] = React.useState<Toggle[]>(() => {
        if (typeof window === 'undefined') return DEFAULT_PINS;

        try {
            const saved = localStorage.getItem('everthorn-map-pins');
            if (saved) {
                const parsed = JSON.parse(saved);
                // Merge with defaults to handle new pins added in updates
                return DEFAULT_PINS.map(defaultPin => {
                    const savedPin = parsed.find((p: Toggle) => p.id === defaultPin.id);
                    return savedPin ? { ...defaultPin, ...savedPin } : defaultPin;
                });
            }
        } catch (error) {
            console.error('Failed to load pin preferences:', error);
        }

        return DEFAULT_PINS;
    });

    const [layertoggles, setlayertoggles] = React.useState<Toggle[]>(() => {
        if (typeof window === 'undefined') return DEFAULT_LAYERS;

        try {
            const saved = localStorage.getItem('everthorn-map-layers');
            if (saved) {
                const parsed = JSON.parse(saved);
                // Merge with defaults to handle new layers added in updates
                return DEFAULT_LAYERS.map(defaultLayer => {
                    const savedLayer = parsed.find((l: Toggle) => l.id === defaultLayer.id);
                    return savedLayer ? { ...defaultLayer, ...savedLayer } : defaultLayer;
                });
            }
        } catch (error) {
            console.error('Failed to load layer preferences:', error);
        }

        return DEFAULT_LAYERS;
    });

    // Save pins to localStorage whenever they change
    useEffect(() => {
        try {
            localStorage.setItem('everthorn-map-pins', JSON.stringify(pintoggles));
        } catch (error) {
            console.error('Failed to save pin preferences:', error);
        }
    }, [pintoggles]);

    // Save layers to localStorage whenever they change
    useEffect(() => {
        try {
            localStorage.setItem('everthorn-map-layers', JSON.stringify(layertoggles));
        } catch (error) {
            console.error('Failed to save layer preferences:', error);
        }
    }, [layertoggles]);

    function update_pins(id: string, toggle_label?: boolean) {
        const new_pins = pintoggles.map((pin) => {
            if (pin.id === id) {
                return {
                    ...pin,
                    visible: toggle_label ? pin.visible : !pin.visible,
                    label_visible: toggle_label ? !pin.label_visible : pin.label_visible,
                };
            } else {
                return pin;
            }
        });

        setpintoggles(new_pins);
    }

    function update_layers(id: string) {
        const new_layers = layertoggles.map((layer) => {
            if (layer.id === id) {
                return {
                    ...layer,
                    visible: true,
                };
            } else {
                return {
                    ...layer,
                    visible: false,
                };
            }
        });

        setlayertoggles(new_layers);
    }

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
