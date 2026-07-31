import { useMemo, useCallback, useState, useEffect, useRef } from "react";
import { useRLayersComponent } from "rlayers";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Feature } from "ol";
import { Polygon } from "ol/geom";
import { Style, Fill, Stroke } from "ol/style";
import { Cluster } from "ol/source";
import Overlay from "ol/Overlay";
import { createRoot } from "react-dom/client";

import {
    REGIONS,
    groupItemsByRegion,
    REGION_COLLAPSE_ZOOM,
    type Region,
} from "@/lib/map-regions";
import { createMinecraftBlockHtml, createRegionBadgeHtml } from "@/lib/map-styles";
import type { Toggle } from "@/types/map-toggle";
import type { PinOut, ProjectOut } from "@/api/nexuscore/model";
import { PinCard } from "@/components/features/pins/pin-card";
import { ProjectCard } from "@/components/features/projects/project-card";

import { Point } from "ol/geom";
import { Icon, Style as OLStyle } from "ol/style";
import projectPin from "/map/pins/project.png";
import abandonedPin from "/map/pins/abandoned.png";
import completedPin from "/map/pins/completed.png";
import shopPin from "/map/pins/shop.png";
import relicPin from "/map/pins/relic.png";
import farmPin from "/map/pins/farm.png";

// ----- icon helpers -----

function projectIconUrl(project: ProjectOut): string {
    switch (project.status) {
        case "abandoned": return abandonedPin;
        case "completed": return completedPin;
        default: return projectPin;
    }
}

function pinIconUrl(pin: PinOut): string {
    switch (pin.pin_type) {
        case "shop": return shopPin;
        case "farm": return farmPin;
        default: return relicPin;
    }
}

function hexToRgba(hex: string, alpha: number): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
}

// ----- types -----

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

// ----- component -----

export function RegionalLayerManager({ projects, pins, toggles, currentLayerId }: RegionalLayerManagerProps) {
    const { map } = useRLayersComponent();
    const [hoveredRegionId, setHoveredRegionId] = useState<string | null>(null);

    // Cluster + polygon layers, keyed by region id, plus an "unassigned" entry
    const clusterLayerRefs = useRef<Map<string, VectorLayer<Cluster>>>(new Map());
    const clusterSourceRefs = useRef<Map<string, VectorSource>>(new Map());
    const polygonLayerRef = useRef<VectorLayer<VectorSource> | null>(null);
    const polygonSourceRef = useRef<VectorSource | null>(null);
    const popupRef = useRef<Overlay | null>(null);
    const popupContainerRef = useRef<HTMLDivElement | null>(null);

    const { groups, unassigned } = useMemo(
        () => groupItemsByRegion(projects, pins),
        [projects, pins]
    );

    // --- Setup popup overlay once ---
    useEffect(() => {
        if (!map) return;
        const el = document.createElement("div");
        el.className = "ol-popup";
        const overlay = new Overlay({ element: el, autoPan: { animation: { duration: 250 } }, offset: [4, -15] });
        map.addOverlay(overlay);
        popupRef.current = overlay;
        popupContainerRef.current = el;
        return () => { map.removeOverlay(overlay); };
    }, [map]);

    // --- Build/rebuild cluster layers whenever data or toggles change ---
    useEffect(() => {
        if (!map) return;

        // Remove old layers
        clusterLayerRefs.current.forEach(l => map.removeLayer(l));
        clusterLayerRefs.current.clear();
        clusterSourceRefs.current.clear();

        const allEntries: Array<{ key: string; region: Region | null; pList: ProjectOut[]; pinList: PinOut[] }> = [
            ...REGIONS.map(region => ({
                key: region.id,
                region,
                pList: groups[region.id]?.projects ?? [],
                pinList: groups[region.id]?.pins ?? [],
            })),
            { key: "unassigned", region: null, pList: unassigned.projects, pinList: unassigned.pins },
        ];

        allEntries.forEach(({ key, region, pList, pinList }) => {
            const features: Feature[] = [];

            // Projects
            if (toggles.projects.visible) {
                pList
                    .filter(p => p.dimension === `minecraft:${currentLayerId}` && !p.pin_id)
                    .forEach(project => {
                        const f = new Feature({
                            geometry: new Point([project.coordinates[0], -project.coordinates[2]]),
                            itemType: "project",
                            data: project,
                        });
                        f.setStyle(new OLStyle({
                            image: new Icon({
                                src: projectIconUrl(project),
                                width: 20.46, height: 33.28,
                                anchor: [0, 1], anchorXUnits: "fraction", anchorYUnits: "fraction",
                            }),
                        }));
                        features.push(f);
                    });
            }

            // Pins
            const pinTypes: Array<{ type: string; toggle: Toggle }> = [
                { type: "relic", toggle: toggles.landmarks },
                { type: "farm", toggle: toggles.farms },
                { type: "shop", toggle: toggles.shops },
            ];

            pinTypes.forEach(({ type, toggle }) => {
                if (!toggle.visible) return;
                pinList
                    .filter(p => p.pin_type === type && p.dimension === `minecraft:${currentLayerId}`)
                    .forEach(pin => {
                        const size = type === "relic" ? 22.4 : 25.6;
                        const f = new Feature({
                            geometry: new Point([pin.coordinates[0], -pin.coordinates[2]]),
                            itemType: "pin",
                            data: pin,
                        });
                        f.setStyle(new OLStyle({
                            image: new Icon({
                                src: pinIconUrl(pin),
                                width: size, height: size,
                                anchor: [0.5, 1], anchorXUnits: "fraction", anchorYUnits: "fraction",
                            }),
                        }));
                        features.push(f);
                    });
            });

            if (features.length === 0) return;

            const innerSource = new VectorSource({ features });
            const clusterSource = new Cluster({
                distance: 40,
                source: innerSource,
            });

            const clusterLayer = new VectorLayer({
                source: clusterSource,
                zIndex: 10,
                style: (clusterFeature) => {
                    const members: Feature[] = clusterFeature.get("features");
                    const count = members.length;
                    const zoom = map.getView().getZoom() ?? 6;
                    const olZoom = zoom; // OL zoom 6 ≈ REGION_COLLAPSE_ZOOM threshold

                    if (count === 1) {
                        // Single feature — use individual icon
                        return members[0].getStyle() as Style;
                    }

                    // Clustered
                    const isRegionZoom = olZoom <= (REGION_COLLAPSE_ZOOM + 8); // offset to match OL zoom space
                    const html = (isRegionZoom && region)
                        ? createRegionBadgeHtml(count, region)
                        : createMinecraftBlockHtml(count);

                    const div = document.createElement("div");
                    div.innerHTML = html;
                    const el = div.firstElementChild as HTMLElement;

                    return new OLStyle({
                        image: new Icon({
                            img: el as unknown as HTMLImageElement,
                            imgSize: [el.offsetWidth || 64, el.offsetHeight || 32],
                        }),
                    });
                },
            });

            map.addLayer(clusterLayer);
            clusterLayerRefs.current.set(key, clusterLayer);
            clusterSourceRefs.current.set(key, innerSource);
        });

        return () => {
            clusterLayerRefs.current.forEach(l => map.removeLayer(l));
            clusterLayerRefs.current.clear();
            clusterSourceRefs.current.clear();
        };
    }, [map, projects, pins, toggles, currentLayerId, groups, unassigned]);

    // --- Hovered region polygon highlight ---
    useEffect(() => {
        if (!map) return;

        // Remove old polygon layer
        if (polygonLayerRef.current) {
            map.removeLayer(polygonLayerRef.current);
            polygonLayerRef.current = null;
        }

        if (!hoveredRegionId) return;

        const region = REGIONS.find(r => r.id === hoveredRegionId);
        if (!region) return;

        const coords = region.polygon.map(([x, z]) => [x, -z]);
        coords.push(coords[0]);

        const source = new VectorSource({
            features: [new Feature(new Polygon([coords]))],
        });

        const layer = new VectorLayer({
            source,
            zIndex: 2,
            style: new Style({
                stroke: new Stroke({ color: region.color, width: 2 }),
                fill: new Fill({ color: hexToRgba(region.color, 0.2) }),
            }),
        });

        map.addLayer(layer);
        polygonLayerRef.current = layer;

        return () => {
            map.removeLayer(layer);
            polygonLayerRef.current = null;
        };
    }, [map, hoveredRegionId]);

    // --- Click handler for popups ---
    useEffect(() => {
        if (!map) return;

        const handleClick = (e: any) => {
            let handled = false;

            clusterLayerRefs.current.forEach(layer => {
                if (handled) return;
                const feature = map.forEachFeatureAtPixel(e.pixel, f => f, {
                    layerFilter: l => l === layer,
                });
                if (!feature) return;

                const members: Feature[] = feature.get("features");
                if (!members || members.length !== 1) {
                    // Zoom into cluster on click
                    const view = map.getView();
                    const clusterCoord = (feature.getGeometry() as Point).getCoordinates();
                    view.animate({ center: clusterCoord, zoom: (view.getZoom() ?? 6) + 2, duration: 300 });
                    handled = true;
                    return;
                }

                const single = members[0];
                const itemType: string = single.get("itemType");
                const data = single.get("data");
                const coord = (single.getGeometry() as Point).getCoordinates();

                const container = popupContainerRef.current!;
                container.innerHTML = "";
                const root = createRoot(container);

                if (itemType === "pin") {
                    root.render(<PinCard className="w-[21rem]" pin={data as PinOut} />);
                } else if (itemType === "project") {
                    root.render(<ProjectCard className="w-[21rem]" project={data as ProjectOut} onClick={() => {}} />);
                }

                popupRef.current?.setPosition(coord);
                handled = true;
            });

            if (!handled) {
                popupRef.current?.setPosition(undefined);
            }
        };

        map.on("singleclick", handleClick);
        return () => map.un("singleclick", handleClick);
    }, [map]);

    return null;
}
