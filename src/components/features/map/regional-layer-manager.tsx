import React, { useMemo } from "react";

import { REGIONS, groupItemsByRegion, REGION_COLLAPSE_ZOOM } from "@/lib/map-regions";
import type { Region } from "@/lib/map-regions";
import { createMinecraftBlockStyle, createRegionBadgeStyle, createRegionPolygonStyle } from "@/lib/map-styles";
import { fromLegacyZoom } from "@/lib/map-projections.ts";
import { ProjectLayer } from "@/components/features/map/layers/project_layer";
import { PinLayer } from "@/components/features/map/layers/pin_layer";
import { ClusterLayer } from "@/components/features/map/core/cluster-layer.tsx";
import type { Toggle } from "@/types/map-toggle";

import type { PinOut, ProjectOut } from "@/api/nexuscore/model";

/** OL zoom at and below which a region collapses into a single badge. */
const COLLAPSE_ZOOM = fromLegacyZoom(REGION_COLLAPSE_ZOOM);
const CLUSTER_RADIUS = 50;
const COLLAPSED_RADIUS = 100000;

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

const RegionContent = React.memo(
    ({
        projects,
        pins,
        toggles,
        currentLayerId,
    }: {
        projects: ProjectOut[];
        pins: PinOut[];
        toggles: RegionalLayerManagerProps["toggles"];
        currentLayerId: string;
    }) => {
        const relics = useMemo(() => pins.filter((p) => p.pin_type === "relic"), [pins]);
        const farms = useMemo(() => pins.filter((p) => p.pin_type === "farm"), [pins]);
        const shops = useMemo(() => pins.filter((p) => p.pin_type === "shop"), [pins]);

        return (
            <>
                <ProjectLayer all_projects={projects} toggle={toggles.projects} currentlayer={currentLayerId} />
                <PinLayer pins={relics} toggle={toggles.landmarks} currentlayer={currentLayerId} />
                <PinLayer pins={farms} toggle={toggles.farms} currentlayer={currentLayerId} />
                <PinLayer pins={shops} toggle={toggles.shops} currentlayer={currentLayerId} />
            </>
        );
    },
);

RegionContent.displayName = "RegionContent";

function regionDistance(zoom: number) {
    return zoom <= COLLAPSE_ZOOM ? COLLAPSED_RADIUS : CLUSTER_RADIUS;
}

function unassignedDistance() {
    return CLUSTER_RADIUS;
}

function blockStyle(count: number) {
    return createMinecraftBlockStyle(count);
}

/** One cluster group per region: collapses into a named badge when zoomed out. */
function RegionCluster({ region, children }: { region: Region; children: React.ReactNode }) {
    const clusterStyle = React.useCallback(
        (count: number, zoom: number) =>
            zoom <= COLLAPSE_ZOOM ? createRegionBadgeStyle(region, count) : createMinecraftBlockStyle(count),
        [region],
    );

    const hoverOutline = React.useMemo(
        () => ({ polygon: region.polygon, style: createRegionPolygonStyle(region.color, 0.8) }),
        [region],
    );

    return (
        <ClusterLayer distanceForZoom={regionDistance} clusterStyle={clusterStyle} hoverOutline={hoverOutline}>
            {children}
        </ClusterLayer>
    );
}

export function RegionalLayerManager({ projects, pins, toggles, currentLayerId }: RegionalLayerManagerProps) {
    const { groups, unassigned } = useMemo(() => groupItemsByRegion(projects, pins), [projects, pins]);

    return (
        <>
            {REGIONS.map((region) => {
                const group = groups[region.id];
                if (group.projects.length === 0 && group.pins.length === 0) return null;

                return (
                    <RegionCluster key={region.id} region={region}>
                        <RegionContent
                            projects={group.projects}
                            pins={group.pins}
                            toggles={toggles}
                            currentLayerId={currentLayerId}
                        />
                    </RegionCluster>
                );
            })}

            {(unassigned.projects.length > 0 || unassigned.pins.length > 0) && (
                <ClusterLayer distanceForZoom={unassignedDistance} clusterStyle={blockStyle} hoverOutline="coverage">
                    <RegionContent
                        projects={unassigned.projects}
                        pins={unassigned.pins}
                        toggles={toggles}
                        currentLayerId={currentLayerId}
                    />
                </ClusterLayer>
            )}
        </>
    );
}
