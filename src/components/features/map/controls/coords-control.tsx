import { useMap } from "react-leaflet";
import { useState, useEffect } from "react";
import L from "leaflet";
import { Button } from "@/components/ui/button";

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
            className={"flex w-[110px] p-1 font-mono text-[15px]"}
        >
            {coordinates.x}, {coordinates.z}
        </Button>
    );
};
