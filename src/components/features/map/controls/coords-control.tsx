import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useOL } from "rlayers";
import type { MapBrowserEvent } from "ol";

export const CoordinatesControl = () => {
    const { map } = useOL();
    const [coordinates, setCoordinates] = useState({ x: 0, z: 0 });

    useEffect(() => {
        const handlePointerMove = (e: MapBrowserEvent<PointerEvent>) => {
            const [x, z] = e.coordinate;
            setCoordinates({ x: Math.floor(x), z: Math.floor(z) });
        };

        // @ts-ignore
        map.on("pointermove", handlePointerMove);
        // @ts-ignore
        return () => map.un('pointermove', handlePointerMove);
    }, [map]);

    return (
        <Button
            variant={"invisible"}
            size="default"
            className={cn("w-[110px] px-3 transition-all cursor-default")}
        >
            <span className="font-minecraft-seven text-sm tracking-wide tabular-nums">
                {coordinates.x}, {coordinates.z}, Z{map.getView().getZoom()}
            </span>
        </Button>
    );
};