// Extend L.TileLayer for Custom Tile URL Generation
import L, {TileLayerOptions} from "leaflet";
import {useMap} from "react-leaflet";
import React from "react";

class CustomTileLayer extends L.TileLayer {
    layer: string

    constructor(layer: string, options: TileLayerOptions) {
        super("", options);
        this.layer = layer;
    }

    getTileUrl(coords: L.Coords): string {
        const { x, y: z, z: zoom } = coords;

        let tile_url = `/amethyst/maps/${this.layer}/${zoom}/${Math.floor(x / 10)}/${Math.floor(z / 10)}/${x}/${z}`

        if (process.env.NEXT_PUBLIC_DEV === 'true') {
            tile_url = `/map/tiles/zoom.${zoom}/${Math.floor(x / 10)}/${Math.floor(z / 10)}/tile.${x}.${z}.png`
        }

        return tile_url
    }
}

export default function CustomTileLayerComponent ({layer}: {layer: string}) {
    const map = useMap();

    React.useEffect(() => {
        // Add the custom Tile Layer to the map
        const customTileLayer = new CustomTileLayer(layer, {
            maxNativeZoom: 2,
            maxZoom: 6,
            minZoom:-5,
            updateInterval:10,
            keepBuffer:50,
        });
        customTileLayer.addTo(map);

        return () => {
            map.removeLayer(customTileLayer);
        };
    }, [map, layer]);

    return null;
}