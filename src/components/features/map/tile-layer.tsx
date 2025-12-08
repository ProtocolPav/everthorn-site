// src/components/map/tile-layer.tsx
import React from "react";
import L, { Coords, TileLayerOptions } from "leaflet";
import { useMap } from "react-leaflet";

type TileUrlBuilder = (params: { x: number; y: number; z: number }) => string;

export class CustomTileLayer extends L.TileLayer {
    layer: string;
    buildUrl: TileUrlBuilder;

    constructor(
        layer: string,
        options: TileLayerOptions & { buildUrl?: TileUrlBuilder } = {}
    ) {
        const defaultBuildUrl: TileUrlBuilder = ({ x, y, z }) => {
            const xBucket = Math.floor(x / 10);
            const yBucket = Math.floor(y / 10);

            if (import.meta.env.DEV) {
                return `https://everthorn.net/amethyst/maps/${layer}/${z}/${xBucket}/${yBucket}/${x}/${y}`;
            }

            return `/amethyst/maps/${layer}/${z}/${xBucket}/${yBucket}/${x}/${y}`;
        };

        const { buildUrl = defaultBuildUrl, ...tileOptions } = options;

        super("", tileOptions);
        this.layer = layer;
        this.buildUrl = buildUrl;
    }

    override getTileUrl(coords: Coords): string {
        const { x, y, z } = coords;
        return this.buildUrl({ x, y, z });
    }
}

export type CustomTileLayerComponentProps = {
    layer: string;
    options?: TileLayerOptions & { buildUrl?: TileUrlBuilder };
};

export function CustomTileLayerComponent(
    {layer, options}: CustomTileLayerComponentProps
) {
    const map = useMap();

    React.useEffect(() => {
        if (!map) return;

        const tileLayer = new CustomTileLayer(layer, {
            maxNativeZoom: 2,
            maxZoom: 6,
            minZoom: -5,
            updateInterval: 10,
            keepBuffer: 50,
            ...options,
        });

        tileLayer.addTo(map);

        return () => {
            map.removeLayer(tileLayer);
        };
    }, [map, layer, options]);

    return null;
}
