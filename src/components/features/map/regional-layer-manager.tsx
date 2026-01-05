import { useMemo, useCallback, useState, Fragment } from "react";
import { useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { Polygon } from "react-leaflet";
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
    current_layer: string;
    isAdminView: boolean;
    isEditing: boolean;
}

export function RegionalLayerManager({ projects, pins, toggles, current_layer, isAdminView, isEditing }: RegionalLayerManagerProps) {
    const map = useMap();
    const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

    const { groups, unassigned } = useMemo(() => {
        return groupItemsByRegion(projects, pins);
    }, [projects, pins]);

    const renderContent = (pList: Project[], pinList: Pin[]) => (
        <>
            <ProjectLayer all_projects={pList} toggle={toggles.projects} current_layer={current_layer} isAdminView={isAdminView} isEditing={isEditing} />
            <PinLayer pins={pinList.filter(p => p.pin_type === 'relic')} toggle={toggles.landmarks} currentlayer={current_layer} />
            <PinLayer pins={pinList.filter(p => p.pin_type === 'farm')} toggle={toggles.farms} currentlayer={current_layer} />
            <PinLayer pins={pinList.filter(p => p.pin_type === 'shop')} toggle={toggles.shops} currentlayer={current_layer} />
        </>
    );

    const regionMaxClusterRadius = useCallback((zoom: number) => {
        return zoom <= REGION_COLLAPSE_ZOOM ? 100000 : 50;
    }, []);

    return (
        <>
            {REGIONS.map(region => {
                const group = groups[region.id];
                if (group.projects.length === 0 && group.pins.length === 0) return null;

                const polygonPositions = region.polygon.map(([x, z]) => [-z, x] as [number, number]);
                const isHovered = hoveredRegion === region.id;

                return (
                    <Fragment key={region.id}>
                        {isHovered && (
                            <Polygon
                                positions={polygonPositions}
                                pathOptions={{
                                    color: region.color,
                                    weight: 2,
                                    opacity: 0.8,
                                    fillColor: region.color,
                                    fillOpacity: 0.2
                                }}
                                interactive={false}
                            />
                        )}

                        <MarkerClusterGroup
                            chunkedLoading={true}
                            maxClusterRadius={regionMaxClusterRadius}
                            eventHandlers={{
                                clustermouseover: () => setHoveredRegion(region.id),
                                clustermouseout: () => setHoveredRegion(null),
                            }}
                            iconCreateFunction={(cluster: any) => {
                                const zoom = map.getZoom();
                                if (zoom <= REGION_COLLAPSE_ZOOM) {
                                    return createRegionBadgeIcon(cluster, region);
                                } else {
                                    return createMinecraftBlockIcon(cluster);
                                }
                            }}
                            spiderfyOnMaxZoom={true}
                            showCoverageOnHover={false}
                        >
                            {renderContent(group.projects, group.pins)}
                        </MarkerClusterGroup>
                    </Fragment>
                );
            })}

            {(unassigned.projects.length > 0 || unassigned.pins.length > 0) && (
                <MarkerClusterGroup
                    chunkedLoading={true}
                    maxClusterRadius={50}
                    iconCreateFunction={createMinecraftBlockIcon}
                >
                    {renderContent(unassigned.projects, unassigned.pins)}
                </MarkerClusterGroup>
            )}
        </>
    );
}
