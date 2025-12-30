import { useMap } from "react-leaflet";
import { useState, useEffect } from "react";
import L from "leaflet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const CoordinatesControl = () => {
    const map = useMap();
    const [coordinates, setCoordinates] = useState({ x: 0, z: 0 });

    useEffect(() => {
        const updateCoordinates = (latlng: L.LatLng) => {
            const { lat, lng } = latlng;
            setCoordinates({ z: -Math.floor(lat), x: Math.floor(lng) });
        };

        // Desktop: Mouse move
        const handleMouseMove = (e: L.LeafletMouseEvent) => {
            updateCoordinates(e.latlng);
        };

        // Mobile: Touch events
        const handleTouch = (e: TouchEvent) => {
            if (e.touches.length > 0) {
                const touch = e.touches[0];
                const containerPoint = L.point(touch.clientX, touch.clientY);

                // Convert screen coordinates to map coordinates
                const latlng = map.containerPointToLatLng(containerPoint);
                updateCoordinates(latlng);
            }
        };

        // Get the map container element
        const mapContainer = map.getContainer();

        // Mouse events for desktop
        map.on("mousemove", handleMouseMove);

        // Touch events for mobile
        mapContainer.addEventListener("touchstart", handleTouch, { passive: true });
        mapContainer.addEventListener("touchmove", handleTouch, { passive: true });

        return () => {
            map.off("mousemove", handleMouseMove);
            mapContainer.removeEventListener("touchstart", handleTouch);
            mapContainer.removeEventListener("touchmove", handleTouch);
        };
    }, [map]);

    return (
        <Button
            variant={"invisible"}
            size="default"
            className={cn(
                "w-[110px] px-3 transition-all cursor-default"
            )}
        >
            <span className="font-minecraft-seven text-sm tracking-wide tabular-nums">
                {coordinates.x}, {coordinates.z}
            </span>
        </Button>
    );
};
