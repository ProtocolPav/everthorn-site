import { useMemo, useState, useEffect, Fragment, useCallback } from "react";
import { Point, Polygon } from "ol/geom";
import { useOL, RLayerCluster, RLayerVector, RFeature, RStyle, ROverlay } from "rlayers";
import { REGIONS, groupItemsByRegion, REGION_COLLAPSE_ZOOM } from "@/lib/map-regions";
import { getMinecraftBlockDataUrl, getRegionBadgeDataUrl } from "@/lib/map-styles";
import type { Toggle } from "@/types/map-toggle";
import { PinOut, ProjectOut } from "@/api/nexuscore/model";
import { PinCard } from "@/components/features/pins/pin-card.tsx";
import { ProjectCard } from "@/components/features/projects/project-card.tsx";

import shopPin from "/map/pins/shop.png";
import relicPin from "/map/pins/relic.png";
import farmPin from "/map/pins/farm.png";
import projectPin from "/map/pins/project.png";
import abandonedPin from "/map/pins/abandoned.png";
import completedPin from "/map/pins/completed.png";

import { RFeature as RFeat } from "rlayers";
// @ts-ignore
RFeat.hitTolerance = 10;

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

function pinSrc(pinType: string): string {
    switch (pinType) {
        case "shop":
            return shopPin;
        case "farm":
            return farmPin;
        default:
            return relicPin;
    }
}
function pinScale(pinType: string): number {
    return pinType === "relic" || pinType !== "shop" && pinType !== "farm" ? 0.35 : 0.4;
}
function projectSrc(status: string): string {
    switch (status) {
        case "abandoned":
            return abandonedPin;
        case "completed":
            return completedPin;
        default:
            return projectPin;
    }
}

type Selected = { kind: "pin"; data: PinOut; coord: [number, number] } | { kind: "project"; data: ProjectOut; coord: [number, number] } | null;

export function RegionalLayerManager({ projects, pins, toggles, currentLayerId }: RegionalLayerManagerProps) {
    const { map } = useOL();
    const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
    const [selected, setSelected] = useState<Selected>(null);
    const [zoom, setZoom] = useState<number>(() => {
        try {
            return map.getView().getZoom() ?? 6;
        } catch {
            return 6;
        }
    });

    useEffect(() => {
        const view = map.getView();
        const handler = () => setZoom(view.getZoom() ?? 6);
        view.on("change:resolution", handler);
        return () => view.un("change:resolution", handler);
    }, [map]);

    // hover handling for clusters via map pointermove
    useEffect(() => {
        const handlePointerMove = (e: any) => {
            const pixel = map.getEventPixel(e.originalEvent);
            let found: string | null = null;
            (map as any).forEachFeatureAtPixel(pixel, (feature: any) => {
                const clustered: any[] | undefined = feature.get("features") as any;
                if (clustered && clustered.length > 1) {
                    const first: any = clustered[0];
                    const rid = first.get?.("regionId");
                    if (rid) found = rid;
                }
                const rid = feature.get("regionId");
                if (rid) found = rid;
                return found ? (true as any) : undefined;
            });
            setHoveredRegion(found);
            // cursor
            const viewport = map.getViewport();
            viewport.style.cursor = found ? "pointer" : "";
        };
        map.on("pointermove", handlePointerMove);
        return () => map.un("pointermove", handlePointerMove);
    }, [map]);

    // click handling for clusters and singles
    useEffect(() => {
        const handleClick = (e: any) => {
            const pixel = map.getEventPixel(e.originalEvent);
            let handled = false;
            (map as any).forEachFeatureAtPixel(
                pixel,
                (feature: any) => {
                    const clustered: any[] | undefined = feature.get("features");
                    if (!clustered) return undefined;
                    if (clustered.length > 1) {
                        const view = map.getView();
                        const currentZoom = view.getZoom() ?? zoom;
                        view.animate({ center: feature.getGeometry()?.getCoordinates() as any, zoom: Math.min((currentZoom ?? 6) + 2, 9), duration: 250 });
                        handled = true;
                        return true as any;
                    }
                    const first: any = clustered[0];
                    const kind = first.get("_kind");
                    const coord = first.getGeometry()?.getCoordinates() as [number, number] | undefined;
                    if (!coord) return undefined;
                    if (kind === "pin") {
                        const pinData: PinOut | undefined = (first.get("_orig") as PinOut) ?? pins.find((p) => p.id === first.get("pinId"));
                        if (pinData) {
                            e.stopPropagation?.();
                            setSelected({ kind: "pin", data: pinData, coord });
                            handled = true;
                            return true as any;
                        }
                    } else if (kind === "project") {
                        const proj: ProjectOut | undefined = (first.get("_orig") as ProjectOut) ?? projects.find((p) => p.project_id === first.get("projectId"));
                        if (proj) {
                            e.stopPropagation?.();
                            setSelected({ kind: "project", data: proj, coord });
                            handled = true;
                            return true as any;
                        }
                    }
                    return undefined;
                },
                { hitTolerance: 10 }
            );
            if (!handled && selected) {
                const featureAtPixel = (map as any).forEachFeatureAtPixel(pixel, (f: any) => f, { hitTolerance: 8 });
                if (!featureAtPixel) setSelected(null);
            }
        };
        map.on("click", handleClick);
        return () => map.un("click", handleClick);
    }, [map, zoom, pins, projects, selected]);

    const { groups, unassigned } = useMemo(() => {
        return groupItemsByRegion(projects, pins);
    }, [projects, pins]);

    const regionDistance = useCallback((z: number) => (z <= REGION_COLLAPSE_ZOOM ? 100 : 50), []);
    const distance = regionDistance(zoom);

    const renderRegionPolygon = (regionId: string) => {
        const region = REGIONS.find((r) => r.id === regionId);
        if (!region) return null;
        const ring = region.polygon.map(([x, z]) => [x, z] as [number, number]);
        if (ring.length > 0 && (ring[0][0] !== ring[ring.length - 1][0] || ring[0][1] !== ring[ring.length - 1][1])) {
            ring.push([ring[0][0], ring[0][1]]);
        }
        return (
            <RLayerVector zIndex={4} key={`hover-${regionId}`}>
                <RFeature geometry={new Polygon([ring])}>
                    <RStyle.RStyle>
                        <RStyle.RStroke color={region.color} width={2} />
                        <RStyle.RFill color={`${region.color}33`} />
                    </RStyle.RStyle>
                </RFeature>
            </RLayerVector>
        );
    };

    return (
        <>
            {hoveredRegion && renderRegionPolygon(hoveredRegion)}

            {selected && (
                <RLayerVector zIndex={35}>
                    <RFeature geometry={new Point(selected.coord)}>
                        <ROverlay positioning="top-center" offset={selected.kind === "project" ? [10, -36] : [0, -32]} autoPan className="w-[21rem] pointer-events-auto">
                            {selected.kind === "pin" ? (
                                <PinCard className="w-[21rem] shadow-xl" pin={selected.data} />
                            ) : (
                                <ProjectCard className="w-[21rem] shadow-xl" project={selected.data} onClick={() => setSelected(null)} />
                            )}
                        </ROverlay>
                    </RFeature>
                </RLayerVector>
            )}

            {REGIONS.map((region) => {
                const group = groups[region.id];
                if (group.projects.length === 0 && group.pins.length === 0) return null;

                const hasProjects = toggles.projects.visible && group.projects.filter((p) => p.dimension === `minecraft:${currentLayerId}` && !p.pin_id).length > 0;
                const hasLandmarks = toggles.landmarks.visible && group.pins.filter((p) => p.pin_type === "relic" && p.dimension === `minecraft:${currentLayerId}`).length > 0;
                const hasFarms = toggles.farms.visible && group.pins.filter((p) => p.pin_type === "farm" && p.dimension === `minecraft:${currentLayerId}`).length > 0;
                const hasShops = toggles.shops.visible && group.pins.filter((p) => p.pin_type === "shop" && p.dimension === `minecraft:${currentLayerId}`).length > 0;
                if (!hasProjects && !hasLandmarks && !hasFarms && !hasShops) return null;

                return (
                    <Fragment key={region.id}>
                        <RLayerCluster distance={distance} zIndex={10}>
                            <RStyle.RStyle
                                render={(feature) => {
                                    const clustered = feature.get("features") as any[] | undefined;
                                    const count = clustered ? clustered.length : 1;
                                    if (count > 1) {
                                        if (zoom <= REGION_COLLAPSE_ZOOM) {
                                            return <RStyle.RIcon src={getRegionBadgeDataUrl(count, region)} anchor={[0.5, 0.5]} />;
                                        }
                                        return <RStyle.RIcon src={getMinecraftBlockDataUrl(count)} anchor={[0.5, 0.5]} />;
                                    }
                                    const first: any = clustered ? clustered[0] : feature;
                                    const kind = first.get("_kind");
                                    if (kind === "project") {
                                        const status: string = first.get("status") ?? "default";
                                        return (
                                            <>
                                                <RStyle.RIcon src={projectSrc(status)} anchor={[0, 1]} scale={0.32} />
                                                {toggles.projects.label_visible && first.get("name") ? (
                                                    <RStyle.RText text={String(first.get("name"))} offsetX={12} offsetY={-16} font="11px 'Minecraft Seven', monospace" overflow>
                                                        <RStyle.RFill color="#fff" />
                                                        <RStyle.RStroke color="rgba(0,0,0,0.85)" width={3} />
                                                        <RStyle.RBackground fill={{ color: "rgba(0,0,0,0.65)" }} stroke={{ color: "rgba(255,255,255,0.15)", width: 1 }} />
                                                    </RStyle.RText>
                                                ) : null}
                                            </>
                                        );
                                    }
                                    if (kind === "pin") {
                                        const pinType: string = first.get("pin_type") ?? "relic";
                                        const src = pinSrc(pinType);
                                        const label = toggles[pinType === "shop" ? "shops" : pinType === "farm" ? "farms" : "landmarks"]?.label_visible ? String(first.get("name") ?? "") : "";
                                        return (
                                            <>
                                                <RStyle.RIcon src={src} anchor={[0.5, 1]} scale={pinScale(pinType)} />
                                                {label ? (
                                                    <RStyle.RText text={label} offsetX={16} offsetY={-12} font="11px 'Minecraft Seven', monospace" overflow>
                                                        <RStyle.RFill color="#fff" />
                                                        <RStyle.RStroke color="rgba(0,0,0,0.85)" width={3} />
                                                        <RStyle.RBackground fill={{ color: "rgba(0,0,0,0.65)" }} />
                                                    </RStyle.RText>
                                                ) : null}
                                            </>
                                        );
                                    }
                                    return <RStyle.RIcon src={getMinecraftBlockDataUrl(1)} anchor={[0.5, 0.5]} />;
                                }}
                            />

                            {toggles.projects.visible &&
                                group.projects
                                    .filter((p) => p.dimension === `minecraft:${currentLayerId}` && !p.pin_id)
                                    .map((project) => (
                                        <RFeature
                                            key={`p-${project.project_id}`}
                                            geometry={new Point([project.coordinates[0], project.coordinates[2]])}
                                            properties={{
                                                _kind: "project",
                                                status: project.status,
                                                regionId: region.id,
                                                name: project.name,
                                                projectId: project.project_id,
                                                _orig: project,
                                            }}
                                        />
                                    ))}

                            {toggles.landmarks.visible &&
                                group.pins
                                    .filter((p) => p.pin_type === "relic" && p.dimension === `minecraft:${currentLayerId}`)
                                    .map((pin) => (
                                        <RFeature
                                            key={`pin-${pin.id}`}
                                            geometry={new Point([pin.coordinates[0], pin.coordinates[2]])}
                                            properties={{ _kind: "pin", pin_type: pin.pin_type, regionId: region.id, name: pin.name, pinId: pin.id, _orig: pin }}
                                        />
                                    ))}

                            {toggles.farms.visible &&
                                group.pins
                                    .filter((p) => p.pin_type === "farm" && p.dimension === `minecraft:${currentLayerId}`)
                                    .map((pin) => (
                                        <RFeature
                                            key={`pin-${pin.id}`}
                                            geometry={new Point([pin.coordinates[0], pin.coordinates[2]])}
                                            properties={{ _kind: "pin", pin_type: pin.pin_type, regionId: region.id, name: pin.name, pinId: pin.id, _orig: pin }}
                                        />
                                    ))}

                            {toggles.shops.visible &&
                                group.pins
                                    .filter((p) => p.pin_type === "shop" && p.dimension === `minecraft:${currentLayerId}`)
                                    .map((pin) => (
                                        <RFeature
                                            key={`pin-${pin.id}`}
                                            geometry={new Point([pin.coordinates[0], pin.coordinates[2]])}
                                            properties={{ _kind: "pin", pin_type: pin.pin_type, regionId: region.id, name: pin.name, pinId: pin.id, _orig: pin }}
                                        />
                                    ))}
                        </RLayerCluster>
                    </Fragment>
                );
            })}

            {(unassigned.projects.length > 0 || unassigned.pins.length > 0) && (
                <RLayerCluster distance={50} zIndex={10}>
                    <RStyle.RStyle
                        render={(feature) => {
                            const clustered = feature.get("features") as any[] | undefined;
                            const count = clustered ? clustered.length : 1;
                            if (count > 1) return <RStyle.RIcon src={getMinecraftBlockDataUrl(count)} anchor={[0.5, 0.5]} />;
                            const first: any = clustered ? clustered[0] : feature;
                            const kind = first.get("_kind");
                            if (kind === "project") {
                                return (
                                    <>
                                        <RStyle.RIcon src={projectSrc(first.get("status") ?? "default")} anchor={[0, 1]} scale={0.32} />
                                        {toggles.projects.label_visible && first.get("name") ? (
                                            <RStyle.RText text={String(first.get("name"))} offsetX={12} offsetY={-16} font="11px 'Minecraft Seven', monospace">
                                                <RStyle.RFill color="#fff" />
                                                <RStyle.RStroke color="rgba(0,0,0,0.85)" width={3} />
                                                <RStyle.RBackground fill={{ color: "rgba(0,0,0,0.65)" }} />
                                            </RStyle.RText>
                                        ) : null}
                                    </>
                                );
                            }
                            if (kind === "pin") {
                                const pinType: string = first.get("pin_type") ?? "relic";
                                const label = toggles[pinType === "shop" ? "shops" : pinType === "farm" ? "farms" : "landmarks"]?.label_visible ? String(first.get("name") ?? "") : "";
                                return (
                                    <>
                                        <RStyle.RIcon src={pinSrc(first.get("pin_type") ?? "relic")} anchor={[0.5, 1]} scale={pinScale(first.get("pin_type") ?? "relic")} />
                                        {label ? (
                                            <RStyle.RText text={label} offsetX={16} offsetY={-12} font="11px 'Minecraft Seven', monospace">
                                                <RStyle.RFill color="#fff" />
                                                <RStyle.RStroke color="rgba(0,0,0,0.85)" width={3} />
                                                <RStyle.RBackground fill={{ color: "rgba(0,0,0,0.65)" }} />
                                            </RStyle.RText>
                                        ) : null}
                                    </>
                                );
                            }
                            return <RStyle.RIcon src={getMinecraftBlockDataUrl(1)} anchor={[0.5, 0.5]} />;
                        }}
                    />
                    {toggles.projects.visible &&
                        unassigned.projects
                            .filter((p) => p.dimension === `minecraft:${currentLayerId}` && !p.pin_id)
                            .map((project) => (
                                <RFeature
                                    key={`u-p-${project.project_id}`}
                                    geometry={new Point([project.coordinates[0], project.coordinates[2]])}
                                    properties={{ _kind: "project", status: project.status, name: project.name, projectId: project.project_id, _orig: project }}
                                />
                            ))}
                    {toggles.landmarks.visible &&
                        unassigned.pins
                            .filter((p) => p.pin_type === "relic" && p.dimension === `minecraft:${currentLayerId}`)
                            .map((pin) => (
                                <RFeature
                                    key={`u-pin-${pin.id}`}
                                    geometry={new Point([pin.coordinates[0], pin.coordinates[2]])}
                                    properties={{ _kind: "pin", pin_type: pin.pin_type, name: pin.name, pinId: pin.id, _orig: pin }}
                                />
                            ))}
                    {toggles.farms.visible &&
                        unassigned.pins
                            .filter((p) => p.pin_type === "farm" && p.dimension === `minecraft:${currentLayerId}`)
                            .map((pin) => (
                                <RFeature
                                    key={`u-pin-${pin.id}`}
                                    geometry={new Point([pin.coordinates[0], pin.coordinates[2]])}
                                    properties={{ _kind: "pin", pin_type: pin.pin_type, name: pin.name, pinId: pin.id, _orig: pin }}
                                />
                            ))}
                    {toggles.shops.visible &&
                        unassigned.pins
                            .filter((p) => p.pin_type === "shop" && p.dimension === `minecraft:${currentLayerId}`)
                            .map((pin) => (
                                <RFeature
                                    key={`u-pin-${pin.id}`}
                                    geometry={new Point([pin.coordinates[0], pin.coordinates[2]])}
                                    properties={{ _kind: "pin", pin_type: pin.pin_type, name: pin.name, pinId: pin.id, _orig: pin }}
                                />
                            ))}
                </RLayerCluster>
            )}
        </>
    );
}
