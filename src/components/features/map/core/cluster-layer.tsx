import React from "react";
import { RFeature, RLayerVector, useOL } from "rlayers";
import type { MapBrowserEvent } from "ol";
import type Feature from "ol/Feature";
import type { FeatureLike } from "ol/Feature";
import type { Coordinate } from "ol/coordinate";
import { boundingExtent, getCenter, getHeight, getWidth } from "ol/extent";
import { LineString, Point, Polygon } from "ol/geom";
import type Geometry from "ol/geom/Geometry";
import type { Style } from "ol/style";
import type { StyleFunction } from "ol/style/Style";

import { MAP_ZOOM } from "@/lib/map-projections.ts";
import { CLUSTER_COVERAGE_STYLE, SPIDER_LEG_STYLE, ensureMapFonts } from "@/lib/map-styles.tsx";
import {
    INTERACTIVE_LAYER_PROPS,
    MARKER_ID,
    useMapInteraction,
} from "@/components/features/map/core/map-interaction-context.tsx";
import { CLUSTER_HIDDEN, RLayerZoomCluster, zoomForResolution } from "@/components/features/map/core/zoom-cluster.ts";
import { MAP_LAYER_Z } from "@/components/features/map/core/layer-order.ts";

/**
 * A cluster group, the equivalent of a Leaflet.markercluster `<MarkerClusterGroup>`.
 *
 * Put `<RFeature>`s with a `markerId` property and a style inside it. Markers that end up alone
 * render with their own style; groups render with `clusterStyle`. Marker labels and popups should
 * use {@link useClusterPosition} so they only show while the marker isn't hidden in a cluster.
 */

interface SpiderState {
    ids: Set<string>;
    center: Coordinate;
    members: { id: string; coordinate: Coordinate; style: Style }[];
}

interface ClusterContextValue {
    /** Markers drawn on their own, with the point they're drawn at (it moves while clusters animate). */
    unclustered: Map<string, Point>;
    spider: SpiderState | null;
}

const ClusterContext = React.createContext<ClusterContextValue | null>(null);

interface ClusterPosition {
    /** Where the marker rests. */
    coordinate: Coordinate;
    /** The point the marker is drawn at, which moves while clusters split or merge. */
    follow?: Point;
}

/**
 * Where a marker's label/popup should be drawn: its own position when it's on its own (following
 * it while it flies out of or into a cluster), its spiderfied position, or `null` while clustered.
 */
function useClusterPosition(markerId: string, coordinate: Coordinate): ClusterPosition | null {
    const context = React.useContext(ClusterContext);
    if (!context) return { coordinate };
    const spidered = context.spider?.members.find((m) => m.id === markerId);
    if (spidered) return { coordinate: spidered.coordinate };
    const point = context.unclustered.get(markerId);
    return point ? { coordinate, follow: point } : null;
}

interface ClusterLayerProps {
    /** Cluster radius in px per whole OL zoom (Leaflet `maxClusterRadius`). */
    distanceForZoom: (zoom: number) => number;
    /** Style for a cluster of `count` markers at whole OL zoom `zoom` (Leaflet `iconCreateFunction`). */
    clusterStyle: (count: number, zoom: number) => Style;
    /**
     * What to outline when hovering a cluster. A polygon (e.g. the region's) with its style, or
     * `"coverage"` for the convex hull of the cluster's markers (Leaflet `showCoverageOnHover`).
     */
    hoverOutline?: { polygon: Coordinate[]; style: Style } | "coverage" | null;
    /** Fan markers out when they still overlap at max zoom (Leaflet `spiderfyOnMaxZoom`). */
    spiderfyOnMaxZoom?: boolean;
    children: React.ReactNode;
}

function membersOf(feature: FeatureLike): Feature<Geometry>[] {
    return (feature.get("features") as Feature<Geometry>[] | undefined) ?? [];
}

function coordinateOf(feature: Feature<Geometry>): Coordinate {
    return (feature.getGeometry() as Point).getCoordinates();
}

function mapsEqual<K, V>(a: Map<K, V>, b: Map<K, V>): boolean {
    if (a.size !== b.size) return false;
    for (const [key, value] of a) if (b.get(key) !== value) return false;
    return true;
}

/** Monotone chain convex hull. */
function convexHull(points: Coordinate[]): Coordinate[] {
    const sorted = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const cross = (o: Coordinate, a: Coordinate, b: Coordinate) =>
        (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
    const lower: Coordinate[] = [];
    for (const p of sorted) {
        while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) lower.pop();
        lower.push(p);
    }
    const upper: Coordinate[] = [];
    for (const p of sorted.reverse()) {
        while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) upper.pop();
        upper.push(p);
    }
    return lower.slice(0, -1).concat(upper.slice(0, -1));
}

// Leaflet.markercluster spiderfy geometry, in screen px
const CIRCLE_FOOT_SEPARATION = 25;
const CIRCLE_START_ANGLE = Math.PI / 6;
const SPIRAL_FOOT_SEPARATION = 28;
const SPIRAL_LENGTH_START = 11;
const SPIRAL_LENGTH_FACTOR = 5;
const CIRCLE_SPIRAL_SWITCHOVER = 9;

function spiderOffsets(count: number): [number, number][] {
    if (count >= CIRCLE_SPIRAL_SWITCHOVER) {
        const offsets: [number, number][] = [];
        let legLength = SPIRAL_LENGTH_START;
        let angle = 0;
        for (let i = 0; i < count; i++) {
            angle += SPIRAL_FOOT_SEPARATION / legLength + i * 0.0005;
            offsets.push([legLength * Math.cos(angle), legLength * Math.sin(angle)]);
            legLength += (2 * Math.PI * SPIRAL_LENGTH_FACTOR) / angle;
        }
        return offsets;
    }
    const circumference = CIRCLE_FOOT_SEPARATION * (2 + count);
    const legLength = circumference / (2 * Math.PI);
    const step = (2 * Math.PI) / count;
    return Array.from({ length: count }, (_, i) => {
        const angle = CIRCLE_START_ANGLE + i * step;
        return [legLength * Math.cos(angle), legLength * Math.sin(angle)];
    });
}

function ClusterLayer({
    distanceForZoom,
    clusterStyle,
    hoverOutline = "coverage",
    spiderfyOnMaxZoom = true,
    children,
}: ClusterLayerProps) {
    const { map } = useOL();
    const { registerLayer } = useMapInteraction();
    const layerRef = React.useRef<RLayerZoomCluster>(null);
    const spiderLayerRef = React.useRef<RLayerVector>(null);

    const [unclustered, setUnclustered] = React.useState<Map<string, Point>>(() => new Map());
    const [spider, setSpider] = React.useState<SpiderState | null>(null);
    const [outline, setOutline] = React.useState<{ polygon: Coordinate[]; style: Style } | null>(null);

    // Keep the latest props for OL callbacks without re-registering them
    const propsRef = React.useRef({ distanceForZoom, hoverOutline, spiderfyOnMaxZoom });
    propsRef.current = { distanceForZoom, hoverOutline, spiderfyOnMaxZoom };

    // Track which markers are on their own, so their labels/popups can show
    React.useEffect(() => {
        const source = layerRef.current?.source;
        if (!source) return;
        // Runs on every animation frame too; React only re-renders when the set of points changes
        const update = () => {
            const points = new Map<string, Point>();
            for (const cluster of source.getFeatures()) {
                const members = membersOf(cluster);
                if (members.length === 1 && !cluster.get(CLUSTER_HIDDEN)) {
                    points.set(members[0].get(MARKER_ID), cluster.getGeometry() as Point);
                }
            }
            setUnclustered((prev) => (mapsEqual(prev, points) ? prev : points));
        };
        update();
        source.on("change", update);
        return () => source.un("change", update);
    }, []);

    // Redraw cluster icons once the Minecraft fonts are available
    React.useEffect(() => {
        let cancelled = false;
        void ensureMapFonts().then(() => {
            if (!cancelled) layerRef.current?.ol.changed();
        });
        return () => {
            cancelled = true;
        };
    }, []);

    // Leaflet un-spiderfies (and drops the hover outline) when zooming or clicking elsewhere
    React.useEffect(() => {
        const view = map.getView();
        const reset = () => {
            setSpider(null);
            setOutline(null);
        };
        const handleClick = (e: MapBrowserEvent) => {
            // Clicks on this group's clusters/markers are handled by the cluster click below
            const own = [layerRef.current?.ol, spiderLayerRef.current?.ol];
            const hitOwn = map.hasFeatureAtPixel(e.pixel, {
                hitTolerance: 3,
                layerFilter: (layer) => own.includes(layer as (typeof own)[number]),
            });
            if (!hitOwn) setSpider(null);
        };
        view.on("change:resolution", reset);
        map.on("click", handleClick);
        return () => {
            view.un("change:resolution", reset);
            map.un("click", handleClick);
        };
    }, [map]);

    // Cluster click + hover
    React.useEffect(() => {
        const layer = layerRef.current?.ol;
        if (!layer) return;

        return registerLayer(layer, {
            click: (feature) => {
                const members = membersOf(feature);
                if (members.length < 2) return false;

                const view = map.getView();
                const size = map.getSize();
                const coordinates = members.map(coordinateOf);
                const extent = boundingExtent(coordinates);
                const zoom = Math.floor(view.getZoom() ?? MAP_ZOOM.default);
                const maxZoomResolution = view.getResolutionForZoom(MAP_ZOOM.max);
                const spanAtMaxZoom = Math.max(getWidth(extent), getHeight(extent)) / maxZoomResolution;
                const { distanceForZoom: radius, spiderfyOnMaxZoom: canSpiderfy } = propsRef.current;

                // Still overlapping at max zoom: fan the markers out
                if (canSpiderfy && zoom >= MAP_ZOOM.max && spanAtMaxZoom <= radius(MAP_ZOOM.max)) {
                    const resolution = view.getResolution() ?? maxZoomResolution;
                    const center = getCenter(extent);
                    const offsets = spiderOffsets(members.length);
                    setSpider({
                        ids: new Set(members.map((m) => m.get(MARKER_ID) as string)),
                        center,
                        members: members.map((member, i) => ({
                            id: member.get(MARKER_ID),
                            // screen +y is south, which is +z
                            coordinate: [center[0] + offsets[i][0] * resolution, center[1] + offsets[i][1] * resolution],
                            style: member.getStyle() as Style,
                        })),
                    });
                    return true;
                }

                // Otherwise zoom to the cluster's bounds (at least one level in)
                const fitResolution = size ? view.getResolutionForExtent(extent, size) : maxZoomResolution;
                const fitZoom = view.getZoomForResolution(fitResolution) ?? zoom + 1;
                if (fitZoom <= zoom + 1) {
                    view.animate({
                        center: (feature.getGeometry() as Point).getCoordinates(),
                        zoom: Math.min(zoom + 1, MAP_ZOOM.max),
                        duration: 250,
                    });
                } else {
                    view.fit(extent, { padding: [60, 60, 60, 60], maxZoom: MAP_ZOOM.max, duration: 250 });
                }
                return true;
            },
            hover: (feature) => {
                const members = feature ? membersOf(feature) : [];
                const option = propsRef.current.hoverOutline;
                if (members.length < 2 || !option) {
                    setOutline(null);
                } else if (option === "coverage") {
                    // Leaflet only draws the coverage for more than 2 markers
                    setOutline(
                        members.length > 2
                            ? { polygon: convexHull(members.map(coordinateOf)), style: CLUSTER_COVERAGE_STYLE }
                            : null,
                    );
                } else {
                    setOutline(option);
                }
            },
        });
    }, [map, registerLayer]);

    const style = React.useMemo<StyleFunction>(
        () => (feature, resolution) => {
            // A merged cluster waits for its children to fly in
            if (feature.get(CLUSTER_HIDDEN)) return undefined;
            const members = membersOf(feature);
            if (members.length === 1) return members[0].getStyle() as Style;
            if (spider && members.some((m) => spider.ids.has(m.get(MARKER_ID)))) return undefined;
            return clusterStyle(members.length, zoomForResolution(resolution));
        },
        [clusterStyle, spider],
    );

    const context = React.useMemo(() => ({ unclustered, spider }), [unclustered, spider]);

    return (
        <ClusterContext.Provider value={context}>
            {outline && (
                <RLayerVector zIndex={MAP_LAYER_Z.outlines}>
                    <RFeature geometry={new Polygon([outline.polygon])} style={outline.style} />
                </RLayerVector>
            )}

            <RLayerZoomCluster
                ref={layerRef}
                distanceForZoom={distanceForZoom}
                style={style}
                zIndex={MAP_LAYER_Z.markers}
                properties={INTERACTIVE_LAYER_PROPS}
            >
                {children}
            </RLayerZoomCluster>

            {spider && (
                <RLayerVector ref={spiderLayerRef} zIndex={MAP_LAYER_Z.spider} properties={INTERACTIVE_LAYER_PROPS}>
                    {spider.members.map((member) => (
                        <RFeature
                            key={`leg-${member.id}`}
                            geometry={new LineString([spider.center, member.coordinate])}
                            style={SPIDER_LEG_STYLE}
                        />
                    ))}
                    {spider.members.map((member) => (
                        <RFeature
                            key={member.id}
                            geometry={new Point(member.coordinate)}
                            style={member.style}
                            properties={{ [MARKER_ID]: member.id }}
                        />
                    ))}
                </RLayerVector>
            )}
        </ClusterContext.Provider>
    );
}

export { ClusterLayer, useClusterPosition };
