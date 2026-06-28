import React, { useMemo, useCallback, useState, Fragment } from "react";
import { useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { Polygon } from "react-leaflet";
import { REGIONS, groupItemsByRegion, REGION_COLLAPSE_ZOOM } from "@/lib/map-regions";
import { createMinecraftBlockIcon, createRegionBadgeIcon } from "@/lib/map-styles";
import { ProjectLayer } from "@/components/features/map/layers/project_layer";
import { PinLayer } from "@/components/features/map/layers/pin_layer";
import type { Toggle } from "@/types/map-toggle";

import {PinOut, ProjectOut} from "@/api/nexuscore/model";

interface RegionalLayerManagerProps {
    projects: ProjectOut[];
    pins: PinOut[];
    toggles: {
        projects: Toggle;
        landmarks: Toggle;
        farms: Toggle;
        shops: Toggle;
    };
    currentLayerId: string;
}

const RegionContent = React.memo(({
                                      projects,
                                      pins,
                                      toggles,
                                      currentLayerId
                                  }: {
    projects: ProjectOut[],
    pins: PinOut[],
    toggles: RegionalLayerManagerProps['toggles'],
    currentLayerId: string
}) => {
    const relics = useMemo(() => pins.filter(p => p.pin_type === 'relic'), [pins])
    const farms = useMemo(() => pins.filter(p => p.pin_type === 'farm'), [pins])
    const shops = useMemo(() => pins.filter(p => p.pin_type === 'shop'), [pins])

    return (
        <>
            <ProjectLayer all_projects={projects} toggle={toggles.projects} currentlayer={currentLayerId} />
            <PinLayer pins={relics} toggle={toggles.landmarks} currentlayer={currentLayerId} />
            <PinLayer pins={farms} toggle={toggles.farms} currentlayer={currentLayerId} />
            <PinLayer pins={shops} toggle={toggles.shops} currentlayer={currentLayerId} />
        </>
    )
})

export function RegionalLayerManager({ projects, pins, toggles, currentLayerId }: RegionalLayerManagerProps) {
    const map = useMap();
    const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

    const { groups, unassigned } = useMemo(() => {
        return groupItemsByRegion(projects, pins);
    }, [projects, pins]);

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
                            <RegionContent projects={group.projects} pins={group.pins} toggles={toggles} currentLayerId={currentLayerId} />
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
                    <RegionContent projects={unassigned.projects} pins={unassigned.pins} toggles={toggles} currentLayerId={currentLayerId} />
                </MarkerClusterGroup>
            )}
        </>
    );
}
