import React, { useEffect, useLayoutEffect, useRef } from "react";
import { useSearch } from "@tanstack/react-router";
import { RMap, useOL } from "rlayers";
import View from "ol/View";
import type { Coordinate } from "ol/coordinate";

import { ControlBar } from "@/components/features/map/control-bar";
import { WorldTileLayer } from "@/components/features/map/tile-layer.tsx";
import type { Toggle } from "@/types/map-toggle";

import { DEFAULT_LAYERS, DEFAULT_PINS } from "@/config/map-defaults.ts";
import { PlayerLayer } from "@/components/features/map/layers/player_layer.tsx";
import ContextMenu from "@/components/features/map/context-menu.tsx";
import { RegionalLayerManager } from "@/components/features/map/regional-layer-manager.tsx";
import { RegionLayer } from "@/components/features/map/layers/region_layer.tsx";
import { MapInteractionProvider } from "@/components/features/map/core/map-interaction-context.tsx";
import {
    MAP_ZOOM,
    VIEW_EXTENT,
    VIEW_RESOLUTIONS,
    fromLegacyZoom,
    minecraftViewProjection,
} from "@/lib/map-projections.ts";

import type { OnlineMember, PinOut, ProjectOut } from "@/api/nexuscore/model";
import { useGetOnlineMembersV1GuildsMeOnlineGet } from "@/api/nexuscore/guilds/guilds.ts";
import { useListProjectsV1GuildsMeProjectsGet } from "@/api/nexuscore/projects/projects.ts";
import { useListPinsV1PinsGet } from "@/api/nexuscore/pins/pins.ts";

/**
 * Installs the map's view. rlayers' `<RMap>` can't pass `resolutions` or `constrainOnlyCenter`,
 * so the view it creates is swapped out before any other effect reads it.
 */
function MapViewSetup({ center, zoom }: { center: Coordinate; zoom: number }) {
    const { map } = useOL();

    useLayoutEffect(() => {
        map.setView(
            new View({
                projection: minecraftViewProjection,
                center,
                zoom,
                resolutions: VIEW_RESOLUTIONS,
                minZoom: MAP_ZOOM.min,
                maxZoom: MAP_ZOOM.max,
                // Soft pan bounds (Leaflet maxBounds ±5000 with viscosity)
                extent: VIEW_EXTENT,
                constrainOnlyCenter: true,
                smoothExtentConstraint: true,
                // Leaflet maps don't rotate
                enableRotation: false,
            }),
        );
        // Only on mount, like Leaflet's MapContainer `center`/`zoom`
    }, [map]);

    return null;
}

// Component to handle map navigation from URL params
function MapNavigator({ x, z, zoom }: { x?: number; z?: number; zoom?: number }) {
    const { map } = useOL();
    const hasNavigated = useRef(false);

    useEffect(() => {
        if (!hasNavigated.current && x !== undefined && z !== undefined) {
            // Leaflet flyTo([lat, lng], zoom ?? 1, { duration: 1.5 })
            map.getView().animate({
                center: [x, z],
                zoom: fromLegacyZoom(zoom ?? 1),
                duration: 1500,
            });

            hasNavigated.current = true;
        }
    }, [map, x, z, zoom]);

    return null;
}

export default function WorldMap() {
    // Get URL search parameters
    const searchParams = useSearch({ strict: false });

    // Parse coordinates from URL (zoom uses the legacy Leaflet scale, -5 to 6)
    const urlX = searchParams?.x ? Number(searchParams.x) : undefined;
    const urlZ = searchParams?.z ? Number(searchParams.z) : undefined;
    const urlZoom = searchParams?.zoom ? Number(searchParams.zoom) : undefined;

    // Set initial position based on URL params or default (Minecraft [x, z])
    const position: [number, number] = urlX !== undefined && urlZ !== undefined ? [urlX, urlZ] : [0, 0];
    const initialZoom = urlZoom !== undefined ? fromLegacyZoom(urlZoom) : MAP_ZOOM.default;

    // Load initial state from localStorage or use defaults
    const [pintoggles, setpintoggles] = React.useState<Toggle[]>(() => {
        if (typeof window === "undefined") return DEFAULT_PINS;

        try {
            const saved = localStorage.getItem("everthorn-map-pins");
            if (saved) {
                const parsed = JSON.parse(saved);
                // Merge with defaults to handle new pins added in updates
                return DEFAULT_PINS.map((defaultPin) => {
                    const savedPin = parsed.find((p: Toggle) => p.id === defaultPin.id);
                    return savedPin ? { ...defaultPin, ...savedPin } : defaultPin;
                });
            }
        } catch (error) {
            console.error("Failed to load pin preferences:", error);
        }

        return DEFAULT_PINS;
    });

    const [layertoggles, setlayertoggles] = React.useState<Toggle[]>(() => {
        if (typeof window === "undefined") return DEFAULT_LAYERS;

        try {
            const saved = localStorage.getItem("everthorn-map-layers");
            if (saved) {
                const parsed = JSON.parse(saved);
                // Merge with defaults to handle new layers added in updates
                return DEFAULT_LAYERS.map((defaultLayer) => {
                    const savedLayer = parsed.find((l: Toggle) => l.id === defaultLayer.id);
                    return savedLayer ? { ...defaultLayer, ...savedLayer } : defaultLayer;
                });
            }
        } catch (error) {
            console.error("Failed to load layer preferences:", error);
        }

        return DEFAULT_LAYERS;
    });

    // Save pins to localStorage whenever they change
    useEffect(() => {
        try {
            localStorage.setItem("everthorn-map-pins", JSON.stringify(pintoggles));
        } catch (error) {
            console.error("Failed to save pin preferences:", error);
        }
    }, [pintoggles]);

    // Save layers to localStorage whenever they change
    useEffect(() => {
        try {
            localStorage.setItem("everthorn-map-layers", JSON.stringify(layertoggles));
        } catch (error) {
            console.error("Failed to save layer preferences:", error);
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
        const new_layers = layertoggles.map((layer) => ({ ...layer, visible: layer.id === id }));
        setlayertoggles(new_layers);
    }

    const { data: players, isLoading: playersLoading, isError: playersError } = useGetOnlineMembersV1GuildsMeOnlineGet({
        query: {
            refetchInterval: 1000,
        },
    });
    if (playersError) {
        throw Error();
    }
    const all_players: OnlineMember[] = playersLoading || !players ? [] : players;

    const { data: projects, isLoading: projectsLoading, isError: projectsError } = useListProjectsV1GuildsMeProjectsGet();
    if (projectsError) {
        throw Error();
    }
    const all_projects: ProjectOut[] = projectsLoading || !projects ? [] : projects;

    const { data: pins, isLoading: pinsLoading, isError: pinsError } = useListPinsV1PinsGet();
    if (pinsError) {
        throw Error();
    }
    const all_pins: PinOut[] = pinsLoading || !pins ? [] : pins;

    const online_players = players?.length ?? 0;

    const activeLayerId = layertoggles.filter((toggle) => toggle.visible)[0]?.id || "overworld";

    return (
        <RMap
            initial={{ center: position, zoom: initialZoom }}
            projection={minecraftViewProjection}
            noDefaultControls={true}
            className={"relative z-0 flex w-full h-full bg-gray-950 select-none [-webkit-touch-callout:none]"}
        >
            <MapViewSetup center={position} zoom={initialZoom} />

            <MapInteractionProvider>
                <WorldTileLayer layer={activeLayerId} />

                <MapNavigator x={urlX} z={urlZ} zoom={urlZoom} />

                <ControlBar
                    pins={pintoggles}
                    update_pins={update_pins}
                    layers={layertoggles}
                    update_layers={update_layers}
                    online_players={online_players}
                />
                <ContextMenu />

                <PlayerLayer players={all_players} toggle={pintoggles[1]} currentlayer={activeLayerId} />

                <RegionLayer toggle={pintoggles[5]} />

                <RegionalLayerManager
                    projects={all_projects}
                    pins={all_pins}
                    currentLayerId={activeLayerId}
                    toggles={{
                        projects: pintoggles[0],
                        landmarks: pintoggles[2],
                        farms: pintoggles[3],
                        shops: pintoggles[4],
                    }}
                />
            </MapInteractionProvider>
        </RMap>
    );
}
