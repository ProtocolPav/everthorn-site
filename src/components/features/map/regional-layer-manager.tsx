import { useMemo, useCallback } from "react";
import { useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { REGIONS, groupItemsByRegion, REGION_COLLAPSE_ZOOM } from "@/lib/map-regions";
import { createMinecraftBlockIcon, createRegionBadgeIcon } from "@/lib/map-styles";
import { ProjectLayer } from "@/components/features/map/layers/project_layer";
import { PinLayer } from "@/components/features/map/layers/pin_layer";
import type { Project } from "@/types/projects";
import type { Pin } from "@/types/pins";
import type { Toggle } from "@/types/map-toggle";

interface RegionalLayerManagerProps {
    projects: Project[];
    pins: Pin[];
    toggles: {
        projects: Toggle;
        landmarks: Toggle;
        farms: Toggle;
        shops: Toggle;
    };
    currentLayerId: string;
}

export function RegionalLayerManager({ projects, pins, toggles, currentLayerId }: RegionalLayerManagerProps) {
    const map = useMap();

    const { groups, unassigned } = useMemo(() => {
        return groupItemsByRegion(projects, pins);
    }, [projects, pins]);

    const renderContent = (pList: Project[], pinList: Pin[]) => (
        <>
            <ProjectLayer all_projects={pList} toggle={toggles.projects} currentlayer={currentLayerId} />
            <PinLayer pins={pinList.filter(p => p.pin_type === 'relic')} toggle={toggles.landmarks} currentlayer={currentLayerId} />
            <PinLayer pins={pinList.filter(p => p.pin_type === 'farm')} toggle={toggles.farms} currentlayer={currentLayerId} />
            <PinLayer pins={pinList.filter(p => p.pin_type === 'shop')} toggle={toggles.shops} currentlayer={currentLayerId} />
        </>
    );

    // This function tells Leaflet how large the clusters should be.
    // If we are zoomed out (zoom <= threshold), we return Infinity, forcing ALL items
    // in this specific MarkerClusterGroup to merge into one big cluster.
    // Since each Region has its own Group, they won't merge with each other.
    const regionMaxClusterRadius = useCallback((zoom: number) => {
        return zoom <= REGION_COLLAPSE_ZOOM ? 100000 : 50;
    }, []);

    return (
        <>
            {/* --- REGIONAL CLUSTERS --- */}
            {REGIONS.map(region => {
                const group = groups[region.id];
                if (group.projects.length === 0 && group.pins.length === 0) return null;

                // const polygonPositions = region.polygon.map(([x, z]) => [-z, x] as [number, number]);

                return (
                    <MarkerClusterGroup
                        key={region.id}
                        chunkedLoading={true}
                        // 1. DYNAMIC RADIUS: Forces single cluster at low zoom
                        maxClusterRadius={regionMaxClusterRadius}

                        // 2. DYNAMIC ICON: Checks zoom to decide style
                        iconCreateFunction={(cluster: typeof MarkerClusterGroup) => {
                            const zoom = map.getZoom();
                            if (zoom <= REGION_COLLAPSE_ZOOM) {
                                return createRegionBadgeIcon(cluster, region);
                            } else {
                                return createMinecraftBlockIcon(cluster);
                            }
                        }}

                        // 3. Spiderfy normally when zoomed in
                        spiderfyOnMaxZoom={true}
                        showCoverageOnHover={true}
                        polygonOptions={{ color: region.color, weight: 2, fillOpacity: 0.2 }}
                    >
                        {renderContent(group.projects, group.pins)}
                    </MarkerClusterGroup>
                );
            })}

            {/* --- WILDERNESS (Standard Clustering) --- */}
            {(unassigned.projects.length > 0 || unassigned.pins.length > 0) && (
                <MarkerClusterGroup
                    chunkedLoading={true}
                    maxClusterRadius={50} // Always standard radius
                    iconCreateFunction={createMinecraftBlockIcon}
                >
                    {renderContent(unassigned.projects, unassigned.pins)}
                </MarkerClusterGroup>
            )}
        </>
    );
}
