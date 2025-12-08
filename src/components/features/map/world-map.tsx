import { MapContainer } from "react-leaflet";
import L from "leaflet";

// import "leaflet/dist/leaflet.css";
import { CustomTileLayerComponent } from "@/components/features/map/tile-layer";

export default function WorldMap() {
    const position: [number, number] = [0, 0];

    // For now, just a single fixed layer id
    const activeLayerId = "overworld";

    return (
        <MapContainer
            center={position}
            zoom={0}
            scrollWheelZoom={true}
            style={{ width: "100%", height: "100%" }}
            className="z-0 flex"
            zoomControl={false}
            crs={L.CRS.Simple}
            maxBounds={[[2200, 2200], [-2200, -2200]]}
            maxBoundsViscosity={0.03}
            attributionControl={false}
            minZoom={-5}
            maxZoom={6}
        >
            <CustomTileLayerComponent layer={activeLayerId} />
        </MapContainer>
    );
}
