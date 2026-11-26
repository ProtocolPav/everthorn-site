import { Vector as LayerVector } from "ol/layer";
import { Vector as SourceVector, Cluster } from "ol/source";
import type { Options as ClusterOptions } from "ol/source/Cluster";
import type BaseObject from "ol/Object";
import type Feature from "ol/Feature";
import type Geometry from "ol/geom/Geometry";
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

    constructor({ distanceForZoom, ...options }: ZoomClusterOptions) {
        super(options);
        this.distanceForZoom = distanceForZoom;
    }

    override loadFeatures(extent: Extent, resolution: number, projection: Projection): void {
        const zoom = zoomForResolution(resolution);
        if (zoom !== this.zoom) {
            this.zoom = zoom;
            this.distance = this.distanceForZoom(zoom);
        }
        super.loadFeatures(extent, resolutionForZoom(zoom), projection);
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
