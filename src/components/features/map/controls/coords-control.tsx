import { useMap } from "react-leaflet";
import { useState, useEffect } from "react";
import L from "leaflet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const CoordinatesControl = () => {
    const map = useMap();
    const [coordinates, setCoordinates] = useState({ x: 0, z: 0 });

    useEffect(() => {
        const handleMouseMove = (e: L.LeafletMouseEvent) => {
            const { lat, lng } = e.latlng;
            setCoordinates({ z: -Math.floor(lat), x: Math.floor(lng) });
        };

        map.on("mousemove", handleMouseMove);

        return () => {
            map.off("mousemove", handleMouseMove);
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
