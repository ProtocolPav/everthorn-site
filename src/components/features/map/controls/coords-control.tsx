import { useState, useEffect } from "react";
import { useOL } from "rlayers";
import type { MapBrowserEvent } from "ol";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const CoordinatesControl = () => {
    const { map } = useOL();
    const [coordinates, setCoordinates] = useState({ x: 0, z: 0 });

    useEffect(() => {
        const show = ([x, z]: number[]) => setCoordinates({ x: Math.floor(x), z: Math.floor(z) });

        // Desktop: mouse hover. Mobile: touch drag
        const handleMove = (e: MapBrowserEvent) => show(e.coordinate);
        // Mobile: the touched spot, before any drag
        const handleDown = (e: PointerEvent) => show(map.getEventCoordinate(e));

        const viewport = map.getViewport();
        map.on("pointermove", handleMove);
        viewport.addEventListener("pointerdown", handleDown);

        return () => {
            map.un("pointermove", handleMove);
            viewport.removeEventListener("pointerdown", handleDown);
        };
    }, [map]);

    return (
        <Button variant={"invisible"} size="default" className={cn("w-[110px] px-3 transition-all cursor-default")}>
            <span className="font-minecraft-seven text-sm tracking-wide tabular-nums">
                {coordinates.x}, {coordinates.z}
            </span>
        </Button>
    );
};
