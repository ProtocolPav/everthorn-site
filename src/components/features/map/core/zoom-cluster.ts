import { Vector as LayerVector } from "ol/layer";
import { Vector as SourceVector, Cluster } from "ol/source";
import type { Options as ClusterOptions } from "ol/source/Cluster";
import type BaseObject from "ol/Object";
import type Feature from "ol/Feature";
import type Geometry from "ol/geom/Geometry";
import type Point from "ol/geom/Point";
import type { Coordinate } from "ol/coordinate";
import { getUid } from "ol/util";
import type { Extent } from "ol/extent";
import type { Projection } from "ol/proj";
import type { StyleLike } from "ol/style/Style";
import { RLayerCluster } from "rlayers";
import type { RLayerClusterProps } from "rlayers";

import { LEGACY_ZOOM_OFFSET } from "@/lib/map-projections.ts";

/** Whole OL zoom level for a resolution (fractional zooms round down, like Leaflet's zoom levels). */
export function zoomForResolution(resolution: number): number {
    return Math.floor(LEGACY_ZOOM_OFFSET - Math.log2(resolution) + 1e-6);
}

function resolutionForZoom(zoom: number): number {
    return 2 ** (LEGACY_ZOOM_OFFSET - zoom);
}

/** Feature property: an old cluster still flying into its new parent while clusters merge. */
export const CLUSTER_GHOST = "clusterGhost";
/** Feature property: a merged cluster that waits until its children have flown in. */
export const CLUSTER_HIDDEN = "clusterHidden";

/** Leaflet.markercluster: `transition: transform 0.3s ease-out`. */
const ANIMATION_MS = 300;

const easeOut = (t: number) => 1 - (1 - t) ** 3;

function prefersReducedMotion(): boolean {
    return typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

function pointOf(feature: Feature<Geometry>): Point {
    return feature.getGeometry() as Point;
}

function membersOf(feature: Feature<Geometry>): Feature<Geometry>[] {
    return (feature.get("features") as Feature<Geometry>[] | undefined) ?? [];
}

interface Flight {
    feature: Feature<Geometry>;
    from: Coordinate;
    to: Coordinate;
}

interface ClusterAnimation {
    frame: number;
    flights: Flight[];
    ghosts: Feature<Geometry>[];
    hidden: Feature<Geometry>[];
}

interface ZoomClusterOptions extends ClusterOptions<Feature<Geometry>> {
    /** Cluster radius in px for a whole zoom level (Leaflet.markercluster `maxClusterRadius`). */
    distanceForZoom: (zoom: number) => number;
}

/**
 * `ol/source/Cluster` that clusters once per whole zoom level instead of on every resolution change.
 * With smooth (fractional) zoom the stock source would re-cluster every animation frame and
 * make markers flicker; Leaflet.markercluster also clusters per zoom level.
 */
export class ZoomCluster extends Cluster<Feature<Geometry>> {
    private readonly distanceForZoom: (zoom: number) => number;
    private zoom: number | undefined;
    /** Set when the next re-cluster comes from a zoom change (and should animate). */
    private zoomChanged = false;
    private animation: ClusterAnimation | null = null;

    constructor({ distanceForZoom, ...options }: ZoomClusterOptions) {
        super(options);
        this.distanceForZoom = distanceForZoom;
    }

    override loadFeatures(extent: Extent, resolution: number, projection: Projection): void {
        const zoom = zoomForResolution(resolution);
        if (zoom !== this.zoom) {
            this.zoomChanged = this.zoom !== undefined;
            this.zoom = zoom;
            this.distance = this.distanceForZoom(zoom);
        }
        super.loadFeatures(extent, resolutionForZoom(zoom), projection);
    }

    /**
     * Re-clusters, and when that was caused by a zoom change, animates like Leaflet.markercluster:
     * a cluster that splits sends its children flying out from where it was, and clusters that
     * merge fly into their new parent, which appears once they arrive.
     */
    override refresh(): void {
        const animate = this.zoomChanged && !prefersReducedMotion();
        this.zoomChanged = false;

        // Where everything is drawn right now (mid-flight positions included, so a new zoom
        // level continues smoothly from an interrupted animation)
        const previous = animate
            ? (this.features ?? [])
                  .filter((cluster) => !cluster.get(CLUSTER_GHOST))
                  .map((cluster) => ({ cluster, at: pointOf(cluster).getCoordinates() }))
            : [];

        this.stopAnimation();
        super.refresh();

        if (animate && previous.length > 0) this.startAnimation(previous);
    }

    private startAnimation(previous: { cluster: Feature<Geometry>; at: Coordinate }[]): void {
        // Which old cluster each marker was in
        const oldClusterOf = new Map<string, { cluster: Feature<Geometry>; at: Coordinate }>();
        for (const entry of previous) {
            for (const member of membersOf(entry.cluster)) oldClusterOf.set(getUid(member), entry);
        }

        const flights: Flight[] = [];
        const ghosts: Feature<Geometry>[] = [];
        const hidden: Feature<Geometry>[] = [];

        for (const cluster of this.features) {
            const to = pointOf(cluster).getCoordinates();
            const sources = new Set<{ cluster: Feature<Geometry>; at: Coordinate }>();
            for (const member of membersOf(cluster)) {
                const source = oldClusterOf.get(getUid(member));
                if (source) sources.add(source);
            }

            if (sources.size === 1) {
                // Split (or unchanged): fly out from the parent's position
                const [source] = sources;
                if (source.at[0] !== to[0] || source.at[1] !== to[1]) {
                    flights.push({ feature: cluster, from: source.at, to });
                }
            } else if (sources.size > 1) {
                // Merge: the old clusters fly in, the parent waits until they arrive
                cluster.set(CLUSTER_HIDDEN, true, true);
                hidden.push(cluster);
                for (const source of sources) {
                    const ghost = source.cluster;
                    ghost.set(CLUSTER_GHOST, true, true);
                    ghosts.push(ghost);
                    flights.push({ feature: ghost, from: source.at, to });
                }
            }
        }

        if (flights.length === 0) return;

        for (const flight of flights) pointOf(flight.feature).setCoordinates(flight.from);
        if (ghosts.length > 0) this.addFeatures(ghosts);

        const start = performance.now();
        const step = (now: number) => {
            const animation = this.animation;
            if (!animation) return;
            const t = Math.min(1, (now - start) / ANIMATION_MS);
            const k = easeOut(t);
            for (const { feature, from, to } of animation.flights) {
                pointOf(feature).setCoordinates([from[0] + (to[0] - from[0]) * k, from[1] + (to[1] - from[1]) * k]);
            }
            if (t < 1) animation.frame = requestAnimationFrame(step);
            else this.stopAnimation();
        };
        this.animation = { frame: requestAnimationFrame(step), flights, ghosts, hidden };
    }

    /** Ends the running animation, putting everything where it belongs. */
    private stopAnimation(): void {
        const animation = this.animation;
        if (!animation) return;
        this.animation = null;
        cancelAnimationFrame(animation.frame);

        for (const { feature, to } of animation.flights) {
            if (!feature.get(CLUSTER_GHOST)) pointOf(feature).setCoordinates(to);
        }
        for (const ghost of animation.ghosts) {
            if (this.hasFeature(ghost)) this.removeFeature(ghost);
        }
        for (const cluster of animation.hidden) cluster.set(CLUSTER_HIDDEN, false);
    }

    /** The whole zoom level the current clusters were computed for. */
    getZoom(): number | undefined {
        return this.zoom;
    }
}

export interface RLayerZoomClusterProps extends Omit<RLayerClusterProps, "distance" | "style"> {
    distanceForZoom: (zoom: number) => number;
    style: StyleLike;
}

/** rlayers `RLayerCluster` backed by a {@link ZoomCluster}. Accepts JSX `<RFeature>` children. */
export class RLayerZoomCluster extends RLayerCluster {
    declare props: Readonly<RLayerZoomClusterProps & { children?: React.ReactNode }>;
    declare source: ZoomCluster;

    protected override createSource(props: Readonly<RLayerClusterProps>): BaseObject[] {
        const { distanceForZoom, style } = props as unknown as RLayerZoomClusterProps;
        this.cluster = new SourceVector<Feature<Geometry>>({ features: props.features });
        this.source = new ZoomCluster({ source: this.cluster, distanceForZoom });
        this.ol = new LayerVector<SourceVector<Feature<Geometry>>, Feature<Geometry>>({
            ...props,
            source: this.source,
            style,
        });
        return [this.ol, this.source, this.cluster];
    }
}
